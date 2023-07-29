import {
  add1Hp,
  addLastAnimalToDeck,
  drawOneCard,
  minus1Hp,
  removePlayerAnimalFromBoardAndAddToGraveYard,
  returnTankToDeck,
} from './animalsAbilities';
import { ANIMALS_POINTS, ATTACKER, ClanName, JOKER, TANK, getAnimalCard } from './data';
import { getBoardPath, getItemsOnce, setItem } from './db';
import { getOpponentIdFromCurrentId, isAnimalCard, waitFor } from './helpers';
import { PlayerType, SlotType } from './interface';
import {
  addAnimalToBoard,
  addAnimalToGraveYard,
  addCardsToPlayerDeck,
  addInfoToLog,
  changeCanAttackVarOfSlot,
  getCardFromMainDeck,
  removeCardFromMainDeck,
  removeCardFromPlayerDeck,
  removeHpFromPlayer,
  removePlayerAnimalFromBoard,
  setActivePowerCard,
} from './unitActions';

export const enableAttackingAndPlayingPowerCards = async (roomId: string, playerType: string) => {
  await setItem('rooms/' + roomId + '/' + playerType, { canAttack: true, canPlayPowers: true });
};

export const drawCardFromMainDeck = async (roomId: string, playerType: string) => {
  await addInfoToLog(roomId, 'player ' + playerType + ' draw a card');
  const powerCardId = await getCardFromMainDeck(roomId);
  await removeCardFromMainDeck(roomId);
  await addCardsToPlayerDeck(roomId, playerType, [powerCardId]);
};

export const placeAnimalOnBoard = async (
  roomId: string,
  playerType: string,
  slotNb: number,
  animalId: string,
) => {
  const animal = getAnimalCard(animalId);
  await addInfoToLog(
    roomId,
    'player ' + playerType + ' placed a ' + animal?.name + ' in slot ' + slotNb,
  );
  await removeCardFromPlayerDeck(roomId, playerType, animalId);
  await addAnimalToBoard(roomId, playerType, slotNb, animalId);
};

export const placeKingOnBoard = async (
  roomId: string,
  playerType: string,
  kingId: string,
  sacrificedAnimalId: string,
  slotNb: number,
) => {
  const king = getAnimalCard(kingId);
  const sacrificedAnimal = getAnimalCard(sacrificedAnimalId);
  await addInfoToLog(
    roomId,
    'player ' + playerType + ' sacrificed a ' + sacrificedAnimal?.name + ' to play ' + king?.name,
  );
  if (!king || !sacrificedAnimal) return;
  const isRemoved = await removePlayerAnimalFromBoard(roomId, playerType, slotNb);
  if (isRemoved) {
    await addAnimalToGraveYard(roomId, sacrificedAnimalId);
    await removeCardFromPlayerDeck(roomId, playerType, kingId);
    await addAnimalToBoard(roomId, playerType, slotNb, kingId, true);
  }
};

export const attackAnimal = async (
  roomId: string,
  playerAType: PlayerType,
  playerDType: PlayerType,
  animalAId: string,
  animalDId: string,
  slotANumber: number,
  slotDNumber: number,
) => {
  const animalA = getAnimalCard(animalAId);
  const animalD = getAnimalCard(animalDId);
  if (!animalA || !animalD || ANIMALS_POINTS[animalA.role].ap < ANIMALS_POINTS[animalD.role].hp)
    return;

  await addInfoToLog(roomId, animalA.name + ' killed ' + animalD.name);
  await removePlayerAnimalFromBoard(roomId, playerDType, slotDNumber);
  await addAnimalToGraveYard(roomId, animalDId);

  const envType = await getEnvType(roomId);
  if (envType != animalD.clan) return;

  if (animalD.role == ATTACKER) {
    await removePlayerAnimalFromBoardAndAddToGraveYard(roomId, playerAType, slotANumber, animalAId);
  } else if (animalD.role == TANK) {
    await returnTankToDeck(roomId, playerDType, animalDId);
  }
};

export const attackOwner = async (roomId: string, playerDType: PlayerType, animalId: string) => {
  if (!isAnimalCard(animalId)) return;
  const { name, role } = getAnimalCard(animalId)!;
  await addInfoToLog(roomId, name + ' has attacked ' + playerDType + ' directly');
  await removeHpFromPlayer(roomId, playerDType, ANIMALS_POINTS[role].ap);
};

export const activateJokerAbility = async (
  roomId: string,
  jokerId: string,
  playerType: PlayerType,
) => {
  const joker = getAnimalCard(jokerId);
  if (!joker || joker.role != JOKER) return;

  const envType = await getEnvType(roomId);
  if (envType != joker.clan) return;

  await addInfoToLog(roomId, joker.name + ' has activated his ability');

  switch (joker.name) {
    case 'Crow':
      await minus1Hp(roomId, getOpponentIdFromCurrentId(playerType));
      break;
    case 'Fox':
      await addLastAnimalToDeck(roomId, playerType);
      break;
    case 'Snake':
      await add1Hp(roomId, playerType);
      break;
    case 'Jellyfish':
      await drawOneCard(roomId, playerType);
      break;
  }
};

export const setPowerCardAsActive = async (
  roomId: string,
  playerType: PlayerType,
  cardId: string,
  name: string,
) => {
  await addInfoToLog(roomId, 'player ' + playerType + ' placed a ' + name);
  await removeCardFromPlayerDeck(roomId, playerType, cardId);
  await setActivePowerCard(roomId, cardId);
  await waitFor(1200);
  await setActivePowerCard(roomId, '');
};

export const enableAttackForOpponentAnimals = async (
  roomId: string,
  playerDType: PlayerType,
  oppSlots: SlotType[] = [],
) => {
  for (let i = 0; i < oppSlots.length; i++) {
    if (isAnimalCard(oppSlots[i].cardId)) {
      await changeCanAttackVarOfSlot(roomId, playerDType, i, true);
    }
  }
};

export const activateJokersAbilities = async (
  roomId: string,
  playerDType: PlayerType,
  oppSlots: SlotType[] = [],
) => {
  for (let i = 0; i < oppSlots.length; i++) {
    const cardId = oppSlots[i]?.cardId;
    if (!!cardId && isAnimalCard(cardId)) {
      await activateJokerAbility(roomId, cardId, playerDType);
    }
  }
};

export const getEnvType = async (roomId: string): Promise<ClanName> => {
  return await getItemsOnce(getBoardPath(roomId) + 'envType');
};
