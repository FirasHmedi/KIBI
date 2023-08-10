// ******************************animal abilities**********************************************
// ----------------------king------------------
import _ from 'lodash';
import { drawCardFromMainDeck } from './actions';
import { getBoardPath, getItemsOnce } from './db';
import {
  addAnimalToGraveYard,
  addCardsToPlayerDeck,
  addHpToPlayer,
  deleteAnimalCardFromGraveYardById, deletePowerCardFromGraveYardById,
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
export const returnRandomPowerCardToDeck = async (roomId: string, playerType: string) => {
  const powerGY = await getItemsOnce(getBoardPath(roomId) + 'powerGY');
  if (!_.isEmpty(powerGY)) {
    const CardId = powerGY[getRandomNumber(powerGY.length)];
    await deletePowerCardFromGraveYardById(roomId, CardId);
    await addCardsToPlayerDeck(roomId, playerType, [CardId]);
  }
};
function getRandomNumber(max:number) {
  return Math.floor(Math.random() * max) ;
}