import _ from 'lodash';
import { useState } from 'react';
import { flexColumnStyle } from '../styles/Style';
import {
  cancelAttacks,
  cancelUsingPowerCards,
  changeEnv,
  draw2Cards,
  handleKingAbility,
  returnAllBoardAnimalsToDecks,
  returnOneAnimalFromGYToDeck,
  reviveLastPower,
  sacrifice1HpToAdd2animalsFromGYToDeck,
  sacrifice1HpToReviveLastAnimal,
  sacrifice2HpToReviveAnyAnimal,
  sacrifice3HpToSteal,
  sacrificeAnimalToGet3Hp,
  shieldOwnerPlus2Hp,
  shieldOwnerPlus3Hp,
  switchDeck,
  switchHealth,
} from '../utils/abilities';
import {
  activateJokerAbility,
  activateJokersAbilities,
  attackAnimal,
  attackOwner,
  changeHasAttacked,
  enableAttackForOpponentAnimals,
  enableAttackingAndPlayingPowerCards,
  placeAnimalOnBoard,
  placeKingOnBoard,
  placeKingWithoutSacrifice,
  setPowerCardAsActive,
} from '../utils/actions';
import {
  ANIMALS_POINTS,
  ClanName,
  EMPTY,
  JOKER,
  KING,
  cardsWithSlotSelection,
  envCardsIds,
  getAnimalCard,
  getOriginalCardId,
  getPowerCard,
} from '../utils/data';
import { getOpponentIdFromCurrentId, isAnimalCard, isPowerCard, waitFor } from '../utils/helpers';
import { Board, Player, Round } from '../utils/interface';
import { addOneRound, addPowerToGraveYard } from '../utils/unitActions';
import { BoardView } from './Board';
import { EnvPopup, RoundView } from './Elements';
import { CurrentPView, OpponentPView } from './PlayersView';

export function GameView({
  round,
  roomId,
  board,
  opponentPlayer,
  currentPlayer,
}: {
  round: Round;
  roomId: string;
  board: Board;
  opponentPlayer: Player;
  currentPlayer: Player;
}) {
  const { opponentPSlots, currentPSlots, envType } = board;

  const [selectedCurrPSlotNb, setSelectedCurrPSlotNb] = useState<number>();
  const [selectedOppPSlotNb, setSelectedOppPSlotNb] = useState<number>();
  const [selectedGYAnimals, setSelectedGYAnimals] = useState<string[]>();
  const [showEnvPopup, setShowEnvPopup] = useState<boolean>(false);
  const [canPlaceKingWithoutSacrifice, setCanPlaceKingWithoutSacrifice] = useState<boolean>(false);
  const playerType = currentPlayer.playerType!;
  const animalIdInOppPSlot = opponentPSlots[selectedOppPSlotNb ?? 3]?.cardId;
  const animalIdInCurrPSlot = currentPSlots[selectedCurrPSlotNb ?? 3]?.cardId;
  const [nbCardsToPlay, setNbCardsToPlay] = useState(2);
  const [hasAttacked, setHasAttacked] = useState(false);

  const isAttackAnimalEnabled =
    round.player === playerType &&
    !_.isNil(selectedCurrPSlotNb) &&
    !_.isNil(selectedOppPSlotNb) &&
    !_.isEmpty(animalIdInCurrPSlot) &&
    animalIdInCurrPSlot !== EMPTY &&
    !_.isEmpty(animalIdInOppPSlot) &&
    animalIdInOppPSlot !== EMPTY &&
    currentPSlots[selectedCurrPSlotNb]?.canAttack;

  const isAttackOwnerEnabled =
    round.player === playerType &&
    !!animalIdInCurrPSlot &&
    isAnimalCard(animalIdInCurrPSlot) &&
    !_.isNil(selectedCurrPSlotNb) &&
    ((getAnimalCard(animalIdInCurrPSlot)?.role === KING &&
      envType === getAnimalCard(animalIdInCurrPSlot)?.clan) ||
      (!isAnimalCard(opponentPSlots[0]?.cardId) &&
        !isAnimalCard(opponentPSlots[1]?.cardId) &&
        !isAnimalCard(opponentPSlots[2]?.cardId))) &&
    currentPSlots[selectedCurrPSlotNb]?.canAttack;

  const handlePlacingKing = async (cardId: string, clan: ClanName): Promise<void> => {
    if (canPlaceKingWithoutSacrifice) {
      await placeKingWithoutSacrifice(roomId, playerType, cardId, selectedCurrPSlotNb!);
      setCanPlaceKingWithoutSacrifice(false);
    } else {
      await placeKingOnBoard(roomId, playerType, cardId, animalIdInCurrPSlot, selectedCurrPSlotNb!);
    }
  };

  const playAnimalCard = async (cardId: string): Promise<void> => {
    const { role, clan } = getAnimalCard(cardId)!;

    if (role === KING) {
      const sacrificedAnimal = getAnimalCard(animalIdInCurrPSlot);
      if (!canPlaceKingWithoutSacrifice && sacrificedAnimal?.clan !== clan) {
        return;
      }
      await handlePlacingKing(cardId, clan);
    } else {
      await placeAnimalOnBoard(roomId, playerType, selectedCurrPSlotNb!, cardId);
    }

    if (role === JOKER && clan === envType) {
      await activateJokerAbility(roomId, cardId, playerType);
    }

    setNbCardsToPlay(nbCardsToPlay => (nbCardsToPlay > 1 ? nbCardsToPlay - 1 : 0));
  };

  const playPowerCard = async (cardId: string) => {
    if (cardsWithSlotSelection.includes(getOriginalCardId(cardId!)) && _.isNil(selectedCurrPSlotNb))
      return;

    switch (getOriginalCardId(cardId!)) {
      case '3-p':
        if (selectedGYAnimals?.length != 1 || _.isNil(selectedCurrPSlotNb)) return;
      case '4-p':
        if (
          _.isNil(selectedCurrPSlotNb) ||
          _.isNil(selectedOppPSlotNb) ||
          !animalIdInOppPSlot ||
          animalIdInOppPSlot === EMPTY
        )
          return;
        break;
      case '9-p':
        if (_.isNil(selectedCurrPSlotNb) || animalIdInCurrPSlot === EMPTY) return;
        break;
      case '18-p':
        if (!selectedGYAnimals || selectedGYAnimals?.length != 1) return;
        break;
    }

    const { name } = getPowerCard(cardId)!;

    await setPowerCardAsActive(roomId, playerType, cardId!, name!);

    switch (getOriginalCardId(cardId!)) {
      case '1-p':
        await cancelAttacks(roomId, getOpponentIdFromCurrentId(playerType));
        break;
      case '2-p':
        await reviveLastPower(roomId, playerType);
        setNbCardsToPlay(nbCardsToPlay => nbCardsToPlay + 1);
        break;
      case '3-p':
        await sacrifice2HpToReviveAnyAnimal(
          roomId,
          playerType,
          selectedGYAnimals![0],
          selectedCurrPSlotNb,
        );
        break;
      case '4-p':
        await sacrifice3HpToSteal(
          roomId,
          playerType,
          animalIdInOppPSlot,
          selectedOppPSlotNb!,
          selectedCurrPSlotNb!,
        );
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
      case '8-p': // env
        break;
      case '9-p':
        await sacrificeAnimalToGet3Hp(roomId, playerType, animalIdInCurrPSlot, selectedCurrPSlotNb);
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
        await sacrifice1HpToAdd2animalsFromGYToDeck(roomId, playerType, selectedGYAnimals);
        break;
      case '14-p': // env
        break;
      case '15-p': // env
        break;
      case '16-p': // env
        break;
      case '17-p':
        await cancelUsingPowerCards(roomId, getOpponentIdFromCurrentId(playerType));
        break;
      case '18-p':
        await returnOneAnimalFromGYToDeck(roomId, playerType, selectedGYAnimals![0]);
        break;
      case '19-p':
        await returnAllBoardAnimalsToDecks(roomId, playerType, currentPSlots, opponentPSlots);
        break;
      case '20-p':
        setCanPlaceKingWithoutSacrifice(true);
        setNbCardsToPlay(nbCardsToPlay => nbCardsToPlay + 1);
        break;
      case '21-p':
        await handleKingAbility(roomId, playerType, true);
        break;
    }

    await addPowerToGraveYard(roomId, cardId!);

    if (envCardsIds.includes(getOriginalCardId(cardId!))) {
      setShowEnvPopup(true);
    }

    setSelectedGYAnimals([]);
    setSelectedCurrPSlotNb(undefined);
    setSelectedCurrPSlotNb(undefined);
    setNbCardsToPlay(nbCardsToPlay => (nbCardsToPlay > 1 ? nbCardsToPlay - 1 : 0));
  };

  const playCard = async (cardId?: string) => {
    if (_.isEmpty(cardId) || _.isEmpty(playerType)) return;

    if (isAnimalCard(cardId) && selectedCurrPSlotNb != null) {
      await playAnimalCard(cardId!);
    }

    if (isPowerCard(cardId)) {
      await playPowerCard(cardId!);
    }
  };

  const changeEnvWithPopup = async (envType: ClanName) => {
    await changeEnv(roomId, envType);
    setShowEnvPopup(false);
    await activateJokersAbilities(roomId, playerType, currentPSlots);
  };

  const finishRound = async () => {
    await handleKingAbility(roomId, playerType, false);
    setNbCardsToPlay(2);
    setHasAttacked(false);
    setCanPlaceKingWithoutSacrifice(false);
    await enableAttackingAndPlayingPowerCards(roomId, playerType);
    await addOneRound(roomId, getOpponentIdFromCurrentId(playerType));
    await enableAttackForOpponentAnimals(
      roomId,
      getOpponentIdFromCurrentId(playerType),
      opponentPSlots,
    );
    await activateJokersAbilities(roomId, getOpponentIdFromCurrentId(playerType), opponentPSlots);
  };

  const attackOppAnimal = async () => {
    if (!isAttackAnimalEnabled) return;
    if (isAnimalCard(opponentPSlots[1]?.cardId) && selectedOppPSlotNb !== 1) return;

    const animalA = getAnimalCard(animalIdInCurrPSlot);
    const animalD = getAnimalCard(animalIdInOppPSlot);
    const slotNb = selectedCurrPSlotNb;
    if (!animalA || !animalD || ANIMALS_POINTS[animalA.role].ap < ANIMALS_POINTS[animalD.role].hp)
      return;
    await changeHasAttacked(roomId, playerType, slotNb, true);
    await attackAnimal(
      roomId,
      playerType,
      getOpponentIdFromCurrentId(playerType),
      animalIdInCurrPSlot,
      animalIdInOppPSlot,
      selectedOppPSlotNb,
    );
    await waitFor(500);
    await changeHasAttacked(roomId, playerType, slotNb, false);
  };

  const attackOppHp = async () => {
    await attackOwner(
      roomId,
      getOpponentIdFromCurrentId(playerType),
      animalIdInCurrPSlot,
      currentPlayer.isDoubleAP,
    );
    setHasAttacked(true);
  };

  return (
    <div
      style={{
        ...flexColumnStyle,
        width: '100vw',
        height: '96vh',
        justifyContent: 'space-between',
        paddingTop: '2vh',
        paddingBottom: '2vh',
      }}>
      <OpponentPView player={opponentPlayer} />

      <RoundView nb={round.nb} />

      {showEnvPopup && <EnvPopup changeEnv={changeEnvWithPopup} />}

      <BoardView
        board={board}
        selectedCurrentPSlotNb={selectedCurrPSlotNb}
        selectCurrentSlot={setSelectedCurrPSlotNb}
        selectedOpponentPSlotNb={selectedOppPSlotNb}
        selectOpponentSlot={setSelectedOppPSlotNb}
        selectedGYAnimals={selectedGYAnimals}
        setSelectedGYAnimals={setSelectedGYAnimals}
      />

      <CurrentPView
        player={currentPlayer}
        round={round}
        playCard={playCard}
        finishRound={finishRound}
        attackOpponentAnimal={attackOppAnimal}
        attackOppHp={attackOppHp}
        isAttackAnimalEnabled={isAttackAnimalEnabled}
        isAttackOwnerEnabled={isAttackOwnerEnabled}
        nbCardsToPlay={nbCardsToPlay}
      />
    </div>
  );
}
