import {
  cancelAttacks,
  cancelUsingPowerCards,
  changeEnv,
  draw2Cards,
  returnOneAnimal,
  reviveLastPower,
  sacrifice1HpReviveLastAnimal,
  sacrifice1HpToReturn2animals,
  sacrifice2HpToRevive,
  sacrifice3HpToSteal,
  sacrificeAnimalToGet3Hp,
  shieldOwnerPlus2Hp,
  shieldOwnerPlus3Hp,
  switchDeck,
  switchHealth,
} from './abilities';
import {
  ReviveLastAnimalToDeck,
  add1Hp,
  drawOneCard,
  minus1Hp,
  returnTankToDeck, removePlayerAnimalFromBoardAndAddToGraveYard,
} from './animalsAbilities';
import { ANIMALS_POINTS, POWER_CARDS_OBJECT, getAnimalCard } from './data';
import { getItemsOnce } from './db';
import {
  addAnimalToBoard,
  addAnimalToGraveYard,
  addCardToPlayerDeck,
  addInfoToLog,
  addPowerToGraveYard,
  getCardFromMainDeck,
  removeCardFromMainDeck,
  removeCardFromPlayerDeck,
  removeHpFromPlayer,
  removePlayerAnimalFromBoard,
} from './unitActions';

export const playerDrawCard = async (roomId: string, playerType: string) => {
  await addInfoToLog(roomId, 'player ' + playerType + ' draw a card');
  const powerCardId = await getCardFromMainDeck(roomId);
  await removeCardFromMainDeck(roomId);
  await addCardToPlayerDeck(roomId, playerType, powerCardId);
};
export const placeAnimalOnBoard = async (
  roomId: string,
  playerType: string,
  slotNumber: number,
  animalId: string,
) => {
  const animal = getAnimalCard(animalId);
  await addInfoToLog(
    roomId,
    'player ' + playerType + ' placed a ' + animal?.name + ' in slot ' + slotNumber,
  );
  await removeCardFromPlayerDeck(roomId, playerType, animalId);
  await addAnimalToBoard(roomId, playerType, slotNumber, animalId);
};
export const placeKingOnBoard = async (
  roomId: string,
  playerType: string,
  kingId: string,
  sacrificedAnimalId: string,
  slotNumber: number,
) => {
  const king = getAnimalCard(kingId);
  const sacrificedAnimal = getAnimalCard(sacrificedAnimalId);
  await addInfoToLog(
    roomId,
    'player ' + playerType + ' sacrificed a ' + sacrificedAnimal?.name + ' to play ' + king?.name,
  );
  const isRemoved = await removePlayerAnimalFromBoard(roomId, playerType, slotNumber);
  if (isRemoved) {
    await addAnimalToGraveYard(roomId, sacrificedAnimalId);
    await removeCardFromPlayerDeck(roomId, playerType, kingId);
    await addAnimalToBoard(roomId, playerType, slotNumber, kingId);
  }
};
export const attackAnimal = async (
  roomId: string,
  playerAType: string,
  playerDType: string,
  animalAId: string,
  animalDId: string,
  slotANumber: number,
  slotDNumber: number,
) => {
  const animalA = getAnimalCard(animalAId);
  const animalD = getAnimalCard(animalDId);
  if (!animalA || !animalD) return;

  await addInfoToLog(roomId, animalA.name + ' killed ' + animalD.name);
  await removePlayerAnimalFromBoard(roomId, playerDType, slotDNumber);
  await addAnimalToGraveYard(roomId, animalDId);
  const env = await getItemsOnce('rooms/' + roomId + '/env');
  if (env == animalD.clan) {
    if (animalD.role == 'attacker') {
      await removePlayerAnimalFromBoardAndAddToGraveYard(roomId, playerAType, slotANumber, animalAId);
    }
    else if (animalD.role == 'tank') {
      await returnTankToDeck(roomId, playerDType, animalDId);
    }
  }
};
export const attackOwner = async (roomId: string, playerDType: string, animalId: string) => {
  const animal = getAnimalCard(animalId);
  await addInfoToLog(roomId, animal?.name + ' has attacked ' + playerDType + ' directly');
  // @ts-ignore
  await removeHpFromPlayer(roomId, playerDType, ANIMALS_POINTS[animal.role].ap);
};
export const jokerAbilities = async (roomId: string, jokerId: string, playerType: string) => {
  const joker = getAnimalCard(jokerId);
  if (!joker) return;
  const env = await getItemsOnce('rooms/' + roomId + '/env');
  if (env == joker.clan) {
    await addInfoToLog(roomId, joker.name + ' has activated his ability');
    switch (joker.name) {
      case 'Crow':
        await minus1Hp(roomId, playerType);
        break;
      case 'Fox':
        await ReviveLastAnimalToDeck(roomId, playerType);
        break;
      case 'Snake':
        await add1Hp(roomId, playerType);
        break;
      case 'jellyfish':
        await drawOneCard(roomId, playerType);
        break;
    }
  }
};

export const placePowerCard = async (
  roomId: string,
  playerType: string,
  powerCardId: string,
  animalId: string,
  slotNumber: number,
  animalId2: string,
) => {
  const power = POWER_CARDS_OBJECT[powerCardId];
  await addInfoToLog(roomId, 'player ' + playerType + ' placed a ' + power.name);
  await removeCardFromPlayerDeck(roomId, playerType, powerCardId);
  switch (power.id) {
    case '1-p':
      await cancelAttacks(roomId, playerType);
      break;
    case '2-p':
      await reviveLastPower(roomId, playerType);
      break;
    case '3-p':
      await sacrifice2HpToRevive(roomId, playerType, animalId, slotNumber);
      break;
    case '4-p':
      await sacrifice3HpToSteal(roomId, playerType, animalId, slotNumber);
      break;
    case '5-p':
      await sacrifice1HpReviveLastAnimal(roomId, playerType, slotNumber);
      break;
    case '6-p':
      await switchHealth(roomId);
      break;
    case '7-p':
      await switchDeck(roomId);
      break;
    case '8-p':
      await changeEnv(roomId, powerCardId);
      break;
    case '9-p':
      await sacrificeAnimalToGet3Hp(roomId, powerCardId, animalId);
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
      await sacrifice1HpToReturn2animals(roomId, playerType, animalId, animalId2);
      break;
    case '14-p':
      await changeEnv(roomId, powerCardId);
      break;
    case '15-p':
      await changeEnv(roomId, powerCardId);
      break;
    case '16-p':
      await changeEnv(roomId, powerCardId);
      break;
    case '17-p':
      await cancelUsingPowerCards(roomId, playerType);
      break;
    case '18-p':
      await returnOneAnimal(roomId, playerType, animalId);
      break;
  }
  await addPowerToGraveYard(roomId, powerCardId);
};
