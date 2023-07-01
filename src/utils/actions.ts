// ---------------------------Complex Action-----------------
import { ANIMALS_POINTS, ANIMAL_CARDS_OBJECT } from './data';
import {
  addAnimalToBoard,
  addCardToPlayerDeck,
  addInfoToLog,
  getCardFromMainDeck,
  removeCardFromMainDeck,
  removeCardFromPlayerDeck,
  removeHpFromPlayer,
} from './unitActions';

export const playerDrawCard = async (roomId: string, playerType: string) => {
  // addInfoToLog (unit action)
  await addInfoToLog(roomId, 'player ' + playerType + ' draw a card');
  // getCardFromMainDeck (unit action)
  let powerCardId = await getCardFromMainDeck(roomId);
  // removeCardFromMainDeck (unit action)
  await removeCardFromMainDeck(roomId);
  // addCardToPlayerDeck (unit action)
  await addCardToPlayerDeck(roomId, playerType, powerCardId);
};
export const placeAnimalOnBoard = async (roomId: string, playerType: string, slotNumber: number, animalId: string) => {
  // addInfoToLog (unit action)
  let animal = ANIMAL_CARDS_OBJECT[animalId];
  await addInfoToLog(roomId, 'player ' + playerType + ' placed a' + animal + ' in slot ' + slotNumber);
  // addAnimalToBoard (unit action)
  await addAnimalToBoard(roomId, playerType, slotNumber, animalId);
  // removeCardFromPlayerDeck (unit action)
  await removeCardFromPlayerDeck(roomId, playerType, animalId);
};
export const placeKingOnBoard = (roomId: string, playerType: string, kingId: string, sacrificedAnimalId: string) => {
  // addInfoToLog (unit action)
  // removePlayerAnimalFromBoard (sacrificedAnimal) (unit action)
  // addAnimalToGraveYard (sacrificedAnimal) (unit action)
  // removeCardFromPlayerDeck (King) (unit action)
  // addAnimalToBoard (King)  (unit action)
};
export const placePowerCard = (roomId: string, playerId: string, powerCardId: string) => {
  // addInfoToLog (unit action)
  // removeCardFromPlayerDeck (unit action)
  // use the abilities (abilities)
  // addPowerToGraveYard (unit action)
};
export const attackAnimal = (roomId: string, playerType: string, animal1Id: string, animal2Id: string) => {
  // addInfoToLog (unit action)
  // removePlayerAnimalFromBoard (unit action)
  // addAnimalToGraveYard (unit action)
  // check if the animal killed is an attacker in his env so activate (removeOpponentAnimal ability)
  // check if the animal killed is a tank in his env so activate (returnTankToDeck ability)
};
export const attackOwner = async (roomId: string, playerType: string, animalId: string) => {
  let animal = ANIMAL_CARDS_OBJECT[animalId];
  // addInfoToLog (unit action)
  await addInfoToLog(roomId, animal.name + ' has attacked u directly');
  // removeHpFromPlayer (unit action)
  // @ts-ignore
  await removeHpFromPlayer(roomId, playerType, ANIMALS_POINTS[animal.role].ap);
};
export const jokerAbilities = (roomId: string) => {
  // each round or after player change the env
  // check if there's joker in the right env so activate their Abilities
  // addInfoToLog (unit action)
};
