// ******************************animal abilities**********************************************
// ----------------------king------------------
import _ from 'lodash';
import { drawCardFromMainDeck } from './actions';
import { getBoardPath, getItemsOnce } from './db';
import {
  addAnimalToGraveYard,
  addCardsToPlayerDeck,
  addHpToPlayer,
  deleteAnimalCardFromGraveYardById,
  removeHpFromPlayer,
  removePlayerAnimalFromBoard,
} from './unitActions';

export const returnAnimalToDeck = async (roomId: string, playerType: string, animalId: string) => {
  await addCardsToPlayerDeck(roomId, playerType, [animalId]);
  await deleteAnimalCardFromGraveYardById(roomId, animalId);
};

// ----------------------attacker--------------------
export const removePlayerAnimalFromBoardAndAddToGraveYard = async (
  roomId: string,
  playerType: string,
  slotNumber: number,
  animalId: string,
) => {
  await removePlayerAnimalFromBoard(roomId, playerType, slotNumber);
  await addAnimalToGraveYard(roomId, animalId);
};
// ----------------------tank-----------------------
export const returnTankToDeck = returnAnimalToDeck;
// ----------------------Snake -----------------------
export const add1Hp = async (roomId: string, playerType: string) => {
  await addHpToPlayer(roomId, playerType, 1);
};
// ----------------------jellyfish-----------------------
export const drawOneCard = async (roomId: string, playerType: string) => {
  await drawCardFromMainDeck(roomId, playerType);
};
// ----------------------Crow-----------------------
export const minus1Hp = async (roomId: string, playerType: string) => {
  await removeHpFromPlayer(roomId, playerType, 1);
};
// ----------------------Fox-----------------------
export const addLastAnimalToDeck = async (roomId: string, playerType: string) => {
  const animalGY = await getItemsOnce(getBoardPath(roomId) + 'animalGY');
  if (!_.isEmpty(animalGY)) {
    const lastAnimalCardId = animalGY[animalGY.length - 1];
    await deleteAnimalCardFromGraveYardById(roomId, lastAnimalCardId);
    await addCardsToPlayerDeck(roomId, playerType, [lastAnimalCardId]);
  }
};
