import { useEffect, useState } from 'react';
import { Game } from '../pages/game/Game';
import { flexColumnStyle, violet } from '../styles/Style';
import { changeEnv } from '../utils/abilities';
import {
  attackAnimal,
  drawCardFromMainDeck,
  placeAnimalOnBoard,
  placePowerCard,
} from '../utils/actions';
import {
  ClanName,
  DefaultBoard,
  Player,
  PlayerType,
  Round,
  envCardsIds,
  getOriginalCardId,
} from '../utils/data';
import {
  getOpponentIdFromCurrentId,
  isAnimalCard,
  isGameRunning,
  isPowerCard,
} from '../utils/helpers';
import { addOneRound } from '../utils/unitActions';
import { Board, BoardView } from './Board';
import { EnvPopup } from './Elements';
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
  const [showEnvPopup, setShowEnvPopup] = useState<boolean>(false);

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

  const selectOppSlot = (nbSlot?: number, _cardId?: string) => {
    nbSlot !== selectedOppPSlotNb
      ? setSelectedOppPSlotNb(nbSlot)
      : setSelectedOppPSlotNb(undefined);
  };
  const selectCurrSlot = (nbSlot?: number, _cardId?: string) => {
    nbSlot !== selectedCurrPSlotNb
      ? setSelectedCurrPSlotNb(nbSlot)
      : setSelectedCurrPSlotNb(undefined);
  };

  const playCard = async (cardId?: string) => {
    if (isAnimalCard(cardId) && selectedCurrPSlotNb != null) {
      await placeAnimalOnBoard(roomId, playerType, selectedCurrPSlotNb, cardId!);
    }

    if (isPowerCard(cardId)) {
      await placePowerCard(roomId, playerType, cardId!);
      if (envCardsIds.includes(getOriginalCardId(cardId!))) {
        setShowEnvPopup(true);
      }
    }
  };

  const changeEnvWithPopup = async (envType: ClanName) => {
    await changeEnv(roomId, envType);
    setShowEnvPopup(false);
  };

  const finishRound = async () => {
    await addOneRound(roomId, getOpponentIdFromCurrentId(playerType));
  };

  const attackOppAnimal = async () => {
    if (selectedCurrPSlotNb == null || selectedOppPSlotNb == null) {
      return;
    }
    const animalAId = board?.currentPSlots[selectedCurrPSlotNb!];
    const animalDId = board?.opponentPSlots[selectedOppPSlotNb!];
    if (!animalDId || !animalAId) {
      return;
    }

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

  if (!isGameRunning(game.status) || !board || !opponentPlayer || !currentPlayer || !round) {
    return <></>;
  }

  return (
    <div
      style={{
        ...flexColumnStyle,
        width: '100vw',
        height: '94vh',
        justifyContent: 'space-between',
        paddingTop: '3vh',
        paddingBottom: '3vh',
      }}>
      <OpponentPView player={opponentPlayer} />

      <RoundView nb={game.round.nb} />

      {showEnvPopup && <EnvPopup changeEnv={changeEnvWithPopup} />}

      <BoardView
        board={board}
        selectedCurrentPSlotNb={selectedCurrPSlotNb}
        selectCurrentSlot={selectCurrSlot}
        selectedOpponentPSlotNb={selectedOppPSlotNb}
        selectOpponentSlot={selectOppSlot}
      />

      <CurrentPView
        player={currentPlayer}
        round={round}
        playCard={playCard}
        finishRound={finishRound}
        attackOpponentAnimal={attackOppAnimal}
      />
    </div>
  );
}

const RoundView = ({ nb }: { nb: number }) => (
  <div
    style={{
      position: 'absolute',
      left: '2%',
      top: '50%',
      fontSize: '1.1em',
      fontWeight: 'bold',
      color: violet,
    }}>
    Round {nb}
  </div>
);
