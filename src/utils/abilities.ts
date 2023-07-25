import { drawCardFromMainDeck } from './actions';
import { ClanName } from './data';
import { getItemsOnce } from './db';
import {
  addAnimalToBoard,
  addAnimalToGraveYard,
  addCardsToPlayerDeck,
  addHpToPlayer,
  changeCanAttackVar,
  changeCanAttackVarOfSlot,
  changeEnvUnitAction,
  changePLayerCards,
  changePLayerHealth,
  changeUsingPowerCardsVar,
  deleteAnimalCardFromGraveYardById,
  deleteAnimalCardsFromGraveYardByIds,
  deletePowerCardFromGraveYardById,
  getPLayerCards,
  getPLayerHealth,
  removeHpFromPlayer,
  removePlayerAnimalFromBoard,
} from './unitActions';

export const cancelAttacks = async (roomId: string, playerType: string) => {
  await changeCanAttackVar(roomId, playerType, false);
};

export const reviveLastPower = async (roomId: string, playerType: string) => {
  const powerGY: string[] = await getItemsOnce('rooms/' + roomId + '/board/powerGY');
  if (powerGY) {
    const lastPowerCardId = powerGY[powerGY.length - 1];
    await deletePowerCardFromGraveYardById(roomId, lastPowerCardId);
    await addCardsToPlayerDeck(roomId, playerType, [lastPowerCardId]);
  }
};

export const sacrifice2HpToRevive = async (
  roomId: string,
  playerType: string,
  animalId?: string,
  slotNumber?: number,
) => {
  if (!animalId || !slotNumber) return;
  await removeHpFromPlayer(roomId, playerType, 2);
  await deleteAnimalCardFromGraveYardById(roomId, animalId);
  await addAnimalToBoard(roomId, playerType, slotNumber, animalId);
  await changeCanAttackVarOfSlot(roomId, playerType, slotNumber, true);
};

export const sacrifice3HpToSteal = async (
  roomId: string,
  playerType: string,
  animalId?: string,
  slotNumber?: number,
) => {
  if (!animalId || !slotNumber) return;
  await removeHpFromPlayer(roomId, playerType, 3);
  await removePlayerAnimalFromBoard(roomId, playerType, slotNumber);
  await addAnimalToBoard(roomId, playerType, slotNumber, animalId);
  await changeCanAttackVarOfSlot(roomId, playerType, slotNumber, true);
};

export const sacrifice1HpToReviveLastAnimal = async (
  roomId: string,
  playerType: string,
  slotNumber?: number,
) => {
  if (!slotNumber || !playerType) return;
  await removeHpFromPlayer(roomId, playerType, 1);
  const animalGY = await getItemsOnce('rooms/' + roomId + '/board/animalGY');
  if (animalGY) {
    const lastAnimalCardId = animalGY[animalGY.length - 1];
    await deleteAnimalCardFromGraveYardById(roomId, lastAnimalCardId);
    await addAnimalToBoard(roomId, playerType, slotNumber, lastAnimalCardId, true);
  }
};

export const switchHealth = async (roomId: string) => {
  const oneHp = await getPLayerHealth(roomId, 'one');
  const twoHp = await getPLayerHealth(roomId, 'two');
  await changePLayerHealth(roomId, 'one', twoHp);
  await changePLayerHealth(roomId, 'two', oneHp);
};

export const switchDeck = async (roomId: string) => {
  const oneCards = await getPLayerCards(roomId, 'one');
  const twoCards = await getPLayerCards(roomId, 'two');
  await changePLayerCards(roomId, 'one', twoCards);
  await changePLayerCards(roomId, 'two', oneCards);
};

export const changeEnv = async (roomId: string, envType: ClanName) => {
  await changeEnvUnitAction(roomId, envType);
};

export const sacrificeAnimalToGet3Hp = async (
  roomId: string,
  playerType: string,
  animalId?: string,
) => {
  if (!animalId) return;
  // remove animal from board
  await addAnimalToGraveYard(roomId, animalId);
  await addHpToPlayer(roomId, playerType, 3);
};

export const shieldOwnerPlus2Hp = async (roomId: string, playerType: string) => {
  await addHpToPlayer(roomId, playerType, 2);
};

export const shieldOwnerPlus3Hp = async (roomId: string, playerType: string) => {
  await addHpToPlayer(roomId, playerType, 3);
};

export const draw2Cards = async (roomId: string, playerType: string) => {
  await drawCardFromMainDeck(roomId, playerType);
  await drawCardFromMainDeck(roomId, playerType);
};

export const sacrifice1HpToAdd2animalsFromGYToDeck = async (
  roomId: string,
  playerType: string,
  animalsIds: string[] = [],
) => {
  if (animalsIds.length < 2) return;
  await removeHpFromPlayer(roomId, playerType, 1);
  await deleteAnimalCardsFromGraveYardByIds(roomId, animalsIds);
  await addCardsToPlayerDeck(roomId, playerType, animalsIds);
};

export const cancelUsingPowerCards = async (roomId: string, playerType: string) => {
  await changeUsingPowerCardsVar(roomId, playerType, false);
};

export const returnOneAnimalFromGYToDeck = async (
  roomId: string,
  playerType: string,
  animalId?: string,
) => {
  if (!animalId) return;
  await deleteAnimalCardFromGraveYardById(roomId, animalId);
  await addCardsToPlayerDeck(roomId, playerType, [animalId]);
};
