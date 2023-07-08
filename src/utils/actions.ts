// ---------------------------Complex Action-----------------
import {ANIMALS_POINTS, ANIMAL_CARDS_OBJECT, POWER_CARDS_OBJECT} from './data';
import {
  addAnimalToBoard, addAnimalToGraveYard,
  addCardToPlayerDeck,
  addInfoToLog, addPowerToGraveYard,
  getCardFromMainDeck,
  removeCardFromMainDeck,
  removeCardFromPlayerDeck,
  removeHpFromPlayer, removePlayerAnimalFromBoard,
} from './unitActions';
import {
  cancelAttacks, cancelUsingPowerCards, changeEnv, draw2Cards, returnOneAnimal,
  reviveLastPower,
  sacrifice1HpReviveLastAnimal, sacrifice1HpToReturn2animals,
  sacrifice2HpToRevive,
  sacrifice3HpToSteal, sacrificeAnimalToGet3Hp, shieldOwnerPlus2Hp, shieldOwnerPlus3Hp, switchDeck, switchHealth
} from "./abilities";
import {getItemsOnce} from "./db";
import {
  add1Hp,
  drawOneCard,
  minus1Hp,
  removeOpponentAnimal,
  returnTankToDeck,
  ReviveLastAnimalToDeck
} from "./animalsAbilities";

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
export const placeAnimalOnBoard = async (
  roomId: string,
  playerType: string,
  slotNumber: number,
  animalId: string,
) => {
  const animal = ANIMAL_CARDS_OBJECT[animalId];
  await addInfoToLog(
    roomId,
    'player ' + playerType + ' placed a ' + animal.name + ' in slot ' + slotNumber,
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
  // addInfoToLog (unit action)
  let king = ANIMAL_CARDS_OBJECT[kingId];
  let sacrificedAnimal = ANIMAL_CARDS_OBJECT[sacrificedAnimalId];
  await addInfoToLog(
      roomId,
      'player ' + playerType + ' sacrificed a ' + sacrificedAnimal.name + ' to play ' + king.name,
  );
  // removePlayerAnimalFromBoard (sacrificedAnimal) (unit action)
  let isRemoved = await removePlayerAnimalFromBoard(roomId,playerType,slotNumber)
  if(isRemoved){
    // addAnimalToGraveYard (sacrificedAnimal) (unit action)
     await addAnimalToGraveYard(roomId,sacrificedAnimalId)
    // removeCardFromPlayerDeck (King) (unit action)
    await removeCardFromPlayerDeck(roomId, playerType, kingId);
    // addAnimalToBoard (King)  (unit action)
    await addAnimalToBoard(roomId, playerType, slotNumber, kingId);
  }
};
export const attackAnimal = async (
  roomId: string,
  playerAType: string,
  playerDType: string,
  animalAId: string,
  animalDId: string,
  slotNumber:number
) => {
  // addInfoToLog (unit action)
  let animalA = ANIMAL_CARDS_OBJECT[animalAId];
  let animalD = ANIMAL_CARDS_OBJECT[animalDId];

  await addInfoToLog(roomId, animalA.name + ' killed '+animalD.name);
  // removePlayerAnimalFromBoard (unit action)
  await removePlayerAnimalFromBoard(roomId,playerDType,slotNumber)
  // addAnimalToGraveYard (unit action)
  await addAnimalToGraveYard(roomId,animalDId)
  let env  =   await getItemsOnce('rooms/' + roomId + '/env');
  if(env==animalD.clan){
    // check if the animal killed is an attacker in his env so activate (removeOpponentAnimal ability)
    if(animalD.role=='attacker'){
      await removeOpponentAnimal(roomId,playerAType,slotNumber,animalAId)
    }
    // check if the animal killed is a tank in his env so activate (returnTankToDeck ability)
    else if(animalD.role=='tank'){
      await returnTankToDeck(roomId,playerDType,animalDId)
    }
  }
};
export const attackOwner = async (roomId: string, playerDType: string, animalId: string) => {
  let animal = ANIMAL_CARDS_OBJECT[animalId];
  // addInfoToLog (unit action)
  await addInfoToLog(roomId, animal.name + ' has attacked '+playerDType+' directly');
  // removeHpFromPlayer (unit action)
  // @ts-ignore
  await removeHpFromPlayer(roomId, playerDType, ANIMALS_POINTS[animal.role].ap);
};
export const jokerAbilities = async (roomId: string,jokerId:string,playerType:string) => {
  let joker = ANIMAL_CARDS_OBJECT[jokerId];
  let env  =   await getItemsOnce('rooms/' + roomId + '/env');
  if(env==joker.clan) {
    await addInfoToLog(roomId, joker.name + ' has activated his ability');
    switch (joker.name) {
      case "Crow":
        await minus1Hp(roomId, playerType)
        break;
      case "Fox":
        await ReviveLastAnimalToDeck(roomId, playerType)
        break;
      case "Snake":
        await add1Hp(roomId, playerType)
        break;
      case "jellyfish":
        await drawOneCard(roomId, playerType)
        break;
    }
  }
}

export const placePowerCard = async (roomId: string, playerType: string, powerCardId: string,animalId:string,slotNumber:number
    ,animalId2:string) => {
  // addInfoToLog (unit action)
  let power = POWER_CARDS_OBJECT[powerCardId];
  await addInfoToLog(
      roomId,
      'player ' + playerType + ' placed a '+power.name,
  );
  // removeCardFromPlayerDeck (unit action)
  await removeCardFromPlayerDeck(roomId, playerType, powerCardId);
  // use the abilities (abilities)
  switch (power.id) {
    case "1-p":
      await cancelAttacks(roomId,playerType)
      break;
    case "2-p":
      await reviveLastPower(roomId,playerType)
      break;
    case "3-p":
      await sacrifice2HpToRevive(roomId,playerType,animalId,slotNumber)
      break;
    case "4-p":
      await sacrifice3HpToSteal(roomId,playerType,animalId,slotNumber)
      break;
    case "5-p":
      await sacrifice1HpReviveLastAnimal(roomId,playerType,slotNumber)
      break;
    case "6-p":
      await switchHealth(roomId)
      break;
    case "7-p":
      await switchDeck(roomId)
      break;
    case "8-p":
      await changeEnv(roomId,powerCardId)
      break;
    case "9-p":
      await sacrificeAnimalToGet3Hp(roomId,powerCardId,animalId)
      break;
    case "10-p":
      await shieldOwnerPlus2Hp(roomId,playerType)
      break;
    case "11-p":
      await shieldOwnerPlus3Hp(roomId,playerType)
      break;
    case "12-p":
      await draw2Cards(roomId,playerType)
      break;
    case "13-p":
      await sacrifice1HpToReturn2animals(roomId,playerType,animalId,animalId2)
      break;
    case "14-p":
      await changeEnv(roomId,powerCardId)
      break;
    case "15-p":
      await changeEnv(roomId,powerCardId)
      break;
    case "16-p":
      await changeEnv(roomId,powerCardId)
      break;
    case "17-p":
      await cancelUsingPowerCards(roomId,playerType)
      break;
    case "18-p":
      await returnOneAnimal(roomId,playerType,animalId)
      break;
  }
  // addPowerToGraveYard (unit action)
  await addPowerToGraveYard(roomId,powerCardId)
}