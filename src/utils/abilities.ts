// ******************************Power cards**********************************************
import {
    addAnimalToBoard,
    addAnimalToGraveYard,
    addCardToPlayerDeck,
    addHpToPlayer,
    changeCanAttackVar,
    changeCanAttackVarOfSlot,
    changeEnvUnitAction,
    changePLayerCards,
    changePLayerHealth,
    changeUsingPowerCardsVar,
    deleteAnimalCardFromGraveYardById,
    deletePowerCardFromGraveYardById,
    getPLayerCards,
    getPLayerHealth,
    getPowerCardFromGraveYardByIndex,
    removeCardFromPlayerDeck,
    removeHpFromPlayer,
    removePlayerAnimalFromBoard
} from "./unitActions";
import {getItemsOnce} from "./db";
import {playerDrawCard} from "./actions";

export const cancelAttacks = async (roomId: string, playerType: string) => {
  // changeCanAttackVar (false) (unit action)
    await changeCanAttackVar(roomId,playerType,false)
};
export const reviveLastPower = async (roomId: string, playerType: string) => {
   let powerGraveYard = await getItemsOnce('rooms/' + roomId + '/powerGraveYard')
   if(powerGraveYard){
       let lastPowerCardId = powerGraveYard[powerGraveYard.length-1]
       // deletePowerCardFromGraveYardByIndex (length-1) (unit action)
       await deletePowerCardFromGraveYardById(roomId,lastPowerCardId)
       // addCardToPlayerDeck (unit action)
       await  addCardToPlayerDeck(roomId,playerType,lastPowerCardId)
   }
};
export const sacrifice2HpToRevive = async (
  roomId: string,
  playerType: string,
  animalId: string,
  slotNumber: number,
) => {
  // removeHpFromPlayer (2hp) (unit action)
    await removeHpFromPlayer(roomId,playerType,2)
  // deleteAnimalCardFromGraveYardById (unit action)
    await deleteAnimalCardFromGraveYardById(roomId,animalId)
  // addAnimalToBoard (unit action)
    await addAnimalToBoard(roomId,playerType,slotNumber,animalId)
  // changeCanAttackVarOfSlot (true) (unit action)
    await changeCanAttackVarOfSlot(roomId,playerType,slotNumber,true)
};
export const sacrifice3HpToSteal = async (
  roomId: string,
  playerType: string,
  animalId: string,
  slotNumber: number,
) => {
  // removeHpFromPlayer (3hp) (unit action)
    await removeHpFromPlayer(roomId,playerType,3)
    // removePlayerAnimalFromBoard (unit action)
    await removePlayerAnimalFromBoard(roomId,playerType,slotNumber)
  // addAnimalToBoard (unit action)
    await addAnimalToBoard(roomId,playerType,slotNumber,animalId)
  // changeCanAttackVarOfSlot (true) (unit action)
    await changeCanAttackVarOfSlot(roomId,playerType,slotNumber,true)
};
export const sacrifice1HpReviveLastAnimal = async (
  roomId: string,
  playerType: string,
  slotNumber: number,
) => {
  // removeHpFromPlayer (1hp) (unit action)
    await removeHpFromPlayer(roomId,playerType,3)
    let animalGraveYard = await getItemsOnce('rooms/' + roomId + '/animalGraveYard')
    if(animalGraveYard){
        let lastAnimalCardId = animalGraveYard[animalGraveYard.length-1]
        // deleteAnimalCardFromGraveYardByIndex (length-1) (unit action)
        await deleteAnimalCardFromGraveYardById(roomId,lastAnimalCardId)
        // addAnimalToBoard (unit action)
        await  addAnimalToBoard(roomId,playerType,slotNumber,lastAnimalCardId)
    }
};
export const switchHealth = async (roomId: string) => {
  // getPLayerHealth (player one) (unit action)
   let oneHp = await getPLayerHealth(roomId,"one")
  // getPLayerHealth (player one) (unit action)
   let twoHp = await getPLayerHealth(roomId,"two")
  // changePLayerHealth (player one) (unit action)
  await changePLayerHealth(roomId,"one",twoHp)
  // changePLayerHealth (player one) (unit action)
  await changePLayerHealth(roomId,"two",oneHp)
};
export const switchDeck = async (roomId: string) => {
    // getPLayerCards (player one) (unit action)
    let oneCards = await getPLayerCards(roomId,"one")
    // getPLayerCards (player one) (unit action)
    let twoCards = await getPLayerCards(roomId,"two")
    // changePLayerCards (player one) (unit action)
    await changePLayerCards(roomId,"one",twoCards)
    // changePLayerCards (player one) (unit action)
    await changePLayerCards(roomId,"two",oneCards)
};
export const changeEnv = async (roomId: string, env: string) => {
    await changeEnvUnitAction(roomId,env)
};
export const sacrificeAnimalToGet3Hp = async (roomId: string, playerType: string, animalId: string) => {
  // removeCardFromPlayerDeck (unit action)
    await removeCardFromPlayerDeck(roomId,playerType,animalId)
    // addAnimalToGraveYard  (unit action)
    await addAnimalToGraveYard(roomId,animalId)
  // addHpToPlayer (3hp) (unit action)
    await addHpToPlayer(roomId,playerType,3)
};
export const shieldOwnerPlus2Hp = async (roomId: string, playerType: string) => {
  // addHpToPlayer (2hp) (unit action)
    await addHpToPlayer(roomId,playerType,2)
};
export const shieldOwnerPlus3Hp = async (roomId: string, playerType: string) => {
  // addHpToPlayer (3hp) (unit action)
    await addHpToPlayer(roomId,playerType,3)
};
export const draw2Cards = async (roomId: string, playerType: string) => {
  // playerDrawCard (Complex action) * 2
    await playerDrawCard(roomId,playerType)
    await playerDrawCard(roomId,playerType)
};
export const sacrifice1HpToReturn2animals = async (
  roomId: string,
  playerType: string,
  animal1Id: string,
  animal2Id: string,
) => {
  // removeHpToPlayer (1hp) (unit action)
    await removeHpFromPlayer(roomId,playerType,1)
  // deleteAnimalCardFromGraveYardById (animal1Id) (unit action)
    await deleteAnimalCardFromGraveYardById(roomId,animal1Id)
  // addCardToPlayerDeck (animal1Id) (unit action)
    await addCardToPlayerDeck(roomId,playerType,animal1Id)
    // deleteAnimalCardFromGraveYardById (animal1Id) (unit action)
    await deleteAnimalCardFromGraveYardById(roomId,animal2Id)
    // addCardToPlayerDeck (animal1Id) (unit action)
    await addCardToPlayerDeck(roomId,playerType,animal2Id)
};
export const cancelUsingPowerCards = async (roomId: string, playerType: string) => {
  // changeUsingPowerCardsVar (false) (unit action)
    await changeUsingPowerCardsVar(roomId,playerType,false)
};
export const returnOneAnimal = async (roomId: string, playerType: string, animalId: string) => {
  // deleteAnimalCardFromGraveYardById (animalId) (unit action)
    await deleteAnimalCardFromGraveYardById(roomId,animalId)
  // addCardToPlayerDeck (animalId) (unit action)
    await addCardToPlayerDeck(roomId,playerType,animalId)
};
