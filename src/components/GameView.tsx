import _ from 'lodash';
import { useEffect, useState } from 'react';
import { Game } from '../pages/game/Game';
import { flexColumnStyle } from '../styles/Style';
import {
  cancelAttacks,
  cancelUsingPowerCards,
  changeEnv,
  draw2Cards,
  returnOneAnimalFromGYToDeck,
  reviveLastPower,
  sacrifice1HpToAdd2animalsFromGYToDeck,
  sacrifice1HpToReviveLastAnimal,
  shieldOwnerPlus2Hp,
  shieldOwnerPlus3Hp,
  switchDeck,
  switchHealth,
} from '../utils/abilities';
import {
  attackAnimal,
  drawCardFromMainDeck,
  enableAttackingAndPlayingPowerCards,
  placeAnimalOnBoard,
  setPowerCardAsActive,
} from '../utils/actions';
import {
  ClanName,
  DefaultBoard,
  Player,
  PlayerType,
  Round,
  cardsWithSlotSelection,
  envCardsIds,
  getOriginalCardId,
  getPowerCard,
} from '../utils/data';
import {
  getOpponentIdFromCurrentId,
  isAnimalCard,
  isGameRunning,
  isPowerCard,
} from '../utils/helpers';
import { addOneRound, addPowerToGraveYard } from '../utils/unitActions';
import { Board, BoardView } from './Board';
import { EnvPopup, RoundView } from './Elements';
import { CurrentPView, OpponentPView } from './PlayersView';

export function GameView({
  game,
  playerType,
  roomId,
}: {
  game: Game;
  playerType: PlayerType;
  roomId: string;
}) {
  const [board, setBoard] = useState<Board>();
  const [round, setRound] = useState<Round>();
  const [currentPlayer, setCurrPlayer] = useState<Player>();
  const [opponentPlayer, setOppPlayer] = useState<Player>();
  const [selectedCurrPSlotNb, setSelectedCurrPSlotNb] = useState<number>();
  const [selectedOppPSlotNb, setSelectedOppPSlotNb] = useState<number>();
  const [selectedGYAnimls, setSelectedGYAnimals] = useState<string[]>();
  const [showEnvPopup, setShowEnvPopup] = useState<boolean>(false);

  const isAttackAnimalEnabled =
    round?.player === playerType && selectedCurrPSlotNb != null && selectedOppPSlotNb != null;

  useEffect(() => {
    if (!isGameRunning(game.status)) {
      return;
    }

    const gameBoard = game.board;
    const partOfBoard: Board = {
      mainDeck: gameBoard?.mainDeck ?? DefaultBoard.mainDeck,
      animalGY: gameBoard?.animalGY ?? DefaultBoard.animalGY,
      powerGY: gameBoard?.powerGY ?? DefaultBoard.powerGY,
      envType: gameBoard?.envType ?? DefaultBoard.envType,
      activeCardId: gameBoard?.activeCardId ?? DefaultBoard.activeCardId,
      currentPSlots: [],
      opponentPSlots: [],
    };
    const p1 = { ...game[PlayerType.ONE], playerType: PlayerType.ONE };
    const p2 = { ...game[PlayerType.TWO], playerType: PlayerType.TWO };

    if (playerType === PlayerType.ONE) {
      setCurrPlayer(p1);
      setOppPlayer(p2);
      setBoard({
        ...partOfBoard,
        currentPSlots: gameBoard.one ?? [],
        opponentPSlots: gameBoard.two ?? [],
      });
    } else {
      setCurrPlayer(p2);
      setOppPlayer(p1);
      setBoard({
        ...partOfBoard,
        currentPSlots: gameBoard.two ?? [],
        opponentPSlots: gameBoard.one ?? [],
      });
    }
    const newRound = game.round;
    if (round) {
      checkAndDrawCardFromMainDeck(newRound);
    }
    setRound(newRound);
  }, [game]);

  const checkAndDrawCardFromMainDeck = ({ player, nb }: Round) => {
    if (nb > round!?.nb && !!round!.nb && player != round!.player && player === playerType) {
      drawCardFromMainDeck(roomId, playerType).then();
    }
  };

  const playCard = async (cardId?: string) => {
    if (_.isEmpty(cardId) || _.isEmpty(playerType)) return;

    if (isAnimalCard(cardId) && selectedCurrPSlotNb != null) {
      await placeAnimalOnBoard(roomId, playerType, selectedCurrPSlotNb, cardId!);
    }

    if (!isPowerCard(cardId)) return;

    if (cardsWithSlotSelection.includes(getOriginalCardId(cardId!)) && _.isNil(selectedCurrPSlotNb))
      return;

    const { name } = getPowerCard(cardId)!;

    await setPowerCardAsActive(roomId, playerType, cardId!, name!);

    switch (getOriginalCardId(cardId!)) {
      case '1-p':
        await cancelAttacks(roomId, getOpponentIdFromCurrentId(playerType));
        break;
      case '2-p':
        await reviveLastPower(roomId, playerType);
        break;
      case '3-p':
        // await sacrifice2HpToRevive(roomId, playerType, animalId, slotNb);
        break;
      case '4-p':
        // await sacrifice3HpToSteal(roomId, playerType, animalId, slotNb);
        break;
      case '5-p':
        await sacrifice1HpToReviveLastAnimal(roomId, playerType, selectedCurrPSlotNb);
        break;
      case '6-p':
        await switchHealth(roomId);
        break;
      case '7-p':
        await switchDeck(roomId);
        break;
      case '8-p':
        break;
      case '9-p':
        // await sacrificeAnimalToGet3Hp(roomId, playerType, animalId);
        break;
      case '10-p':
        await shieldOwnerPlus2Hp(roomId, playerType);
        break;
      case '11-p':
        await shieldOwnerPlus3Hp(roomId, playerType);
        break;
      case '12-p':
        await draw2Cards(roomId, playerType);
        break;
      case '13-p':
        await sacrifice1HpToAdd2animalsFromGYToDeck(roomId, playerType, selectedGYAnimls);
        break;
      case '14-p':
        break;
      case '15-p':
        break;
      case '16-p':
        break;
      case '17-p':
        await cancelUsingPowerCards(roomId, getOpponentIdFromCurrentId(playerType));
        break;
      case '18-p':
        if (!selectedGYAnimls || selectedGYAnimls?.length != 1) return;
        await returnOneAnimalFromGYToDeck(roomId, playerType, selectedGYAnimls[0]);
        break;
    }

    await addPowerToGraveYard(roomId, cardId!);

    if (envCardsIds.includes(getOriginalCardId(cardId!))) {
      setShowEnvPopup(true);
    }
  };

  const changeEnvWithPopup = async (envType: ClanName) => {
    await changeEnv(roomId, envType);
    setShowEnvPopup(false);
  };

  const finishRound = async () => {
    await enableAttackingAndPlayingPowerCards(roomId, playerType);
    await addOneRound(roomId, getOpponentIdFromCurrentId(playerType));
  };

  const attackOppAnimal = async () => {
    if (selectedCurrPSlotNb == null || selectedOppPSlotNb == null) return;
    const animalAId = board?.currentPSlots[selectedCurrPSlotNb!];
    const animalDId = board?.opponentPSlots[selectedOppPSlotNb!];
    if (!animalDId || !animalAId) return;

    await attackAnimal(
      roomId,
      playerType,
      getOpponentIdFromCurrentId(playerType),
      animalAId.cardId!,
      animalDId.cardId!,
      selectedCurrPSlotNb,
      selectedOppPSlotNb,
    );
  };

  if (!isGameRunning(game.status) || !board || !opponentPlayer || !currentPlayer || !round)
    return <></>;

  return (
    <div
      style={{
        ...flexColumnStyle,
        width: '100vw',
        height: '92vh',
        justifyContent: 'space-between',
        paddingTop: '4vh',
        paddingBottom: '4vh',
      }}>
      <OpponentPView player={opponentPlayer} />

      <RoundView nb={game.round.nb} />

      {showEnvPopup && <EnvPopup changeEnv={changeEnvWithPopup} />}

      <BoardView
        board={board}
        selectedCurrentPSlotNb={selectedCurrPSlotNb}
        selectCurrentSlot={setSelectedCurrPSlotNb}
        selectedOpponentPSlotNb={selectedOppPSlotNb}
        selectOpponentSlot={setSelectedOppPSlotNb}
      />

      <CurrentPView
        player={currentPlayer}
        round={round}
        playCard={playCard}
        finishRound={finishRound}
        attackOpponentAnimal={attackOppAnimal}
        isAttackAnimalEnabled={isAttackAnimalEnabled}
      />
    </div>
  );
}
