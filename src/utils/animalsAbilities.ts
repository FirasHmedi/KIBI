// ******************************animal abilities**********************************************
// ----------------------king------------------
import { playerDrawCard } from './actions';
import { getItemsOnce } from './db';
import {
  addAnimalToGraveYard,
  addCardToPlayerDeck,
  addHpToPlayer,
  deleteAnimalCardFromGraveYardById,
  removeHpFromPlayer,
  removePlayerAnimalFromBoard,
} from './unitActions';

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
export const returnTankToDeck = async (roomId: string, playerType: string, animalId: string) => {
  await addCardToPlayerDeck(roomId, playerType, animalId);
  await deleteAnimalCardFromGraveYardById(roomId,animalId)
};
// ----------------------Snake -----------------------
export const add1Hp = async (roomId: string, playerType: string) => {
  await addHpToPlayer(roomId, playerType, 1);
};
// ----------------------jellyfish-----------------------
export const drawOneCard = async (roomId: string, playerType: string) => {
  await playerDrawCard(roomId, playerType);
};
// ----------------------Crow-----------------------
export const minus1Hp = async (roomId: string, playerType: string) => {
  await removeHpFromPlayer(roomId, playerType, 1);
};
// ----------------------Fox-----------------------
export const ReviveLastAnimalToDeck = async (roomId: string, playerType: string) => {
  let animalGY = await getItemsOnce('rooms/' + roomId + '/animalGY');
  if (animalGY) {
    let lastAnimalCardId = animalGY[animalGY.length - 1];
    await deleteAnimalCardFromGraveYardById(roomId, lastAnimalCardId);
    await addCardToPlayerDeck(roomId, playerType, lastAnimalCardId);
  }
};
