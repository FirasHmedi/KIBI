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
    await changeCanAttackVar(roomId,playerType,false)
};
export const reviveLastPower = async (roomId: string, playerType: string) => {
   const powerGraveYard = await getItemsOnce('rooms/' + roomId + '/board/powerGraveYard')
   if(powerGraveYard){
       const lastPowerCardId = powerGraveYard[powerGraveYard.length-1]
       await deletePowerCardFromGraveYardById(roomId,lastPowerCardId)
       await  addCardToPlayerDeck(roomId,playerType,lastPowerCardId)
   }
};
export const sacrifice2HpToRevive = async (
  roomId: string,
  playerType: string,
  animalId: string,
  slotNumber: number,
) => {
    await removeHpFromPlayer(roomId,playerType,2)
    await deleteAnimalCardFromGraveYardById(roomId,animalId)
    await addAnimalToBoard(roomId,playerType,slotNumber,animalId)
    await changeCanAttackVarOfSlot(roomId,playerType,slotNumber,true)
};
export const sacrifice3HpToSteal = async (
  roomId: string,
  playerType: string,
  animalId: string,
  slotNumber: number,
) => {
    await removeHpFromPlayer(roomId,playerType,3)
    await removePlayerAnimalFromBoard(roomId,playerType,slotNumber)
    await addAnimalToBoard(roomId,playerType,slotNumber,animalId)
    await changeCanAttackVarOfSlot(roomId,playerType,slotNumber,true)
};
export const sacrifice1HpReviveLastAnimal = async (
  roomId: string,
  playerType: string,
  slotNumber: number,
) => {
    await removeHpFromPlayer(roomId,playerType,3)
    const animalGraveYard = await getItemsOnce('rooms/' + roomId + '/board/animalGraveYard')
    if(animalGraveYard){
        const lastAnimalCardId = animalGraveYard[animalGraveYard.length-1]
        await deleteAnimalCardFromGraveYardById(roomId,lastAnimalCardId)
        await  addAnimalToBoard(roomId,playerType,slotNumber,lastAnimalCardId)
    }
};
export const switchHealth = async (roomId: string) => {
   const oneHp = await getPLayerHealth(roomId,"one")
   const twoHp = await getPLayerHealth(roomId,"two")
  await changePLayerHealth(roomId,"one",twoHp)
  await changePLayerHealth(roomId,"two",oneHp)
};
export const switchDeck = async (roomId: string) => {
    const oneCards = await getPLayerCards(roomId,"one")
    const twoCards = await getPLayerCards(roomId,"two")
    await changePLayerCards(roomId,"one",twoCards)
    await changePLayerCards(roomId,"two",oneCards)
};
export const changeEnv = async (roomId: string, env: string) => {
    await changeEnvUnitAction(roomId,env)
};
export const sacrificeAnimalToGet3Hp = async (roomId: string, playerType: string, animalId: string) => {
    await removeCardFromPlayerDeck(roomId,playerType,animalId)
    await addAnimalToGraveYard(roomId,animalId)
    await addHpToPlayer(roomId,playerType,3)
};
export const shieldOwnerPlus2Hp = async (roomId: string, playerType: string) => {
    await addHpToPlayer(roomId,playerType,2)
};
export const shieldOwnerPlus3Hp = async (roomId: string, playerType: string) => {
    await addHpToPlayer(roomId,playerType,3)
};
export const draw2Cards = async (roomId: string, playerType: string) => {
    await playerDrawCard(roomId,playerType)
    await playerDrawCard(roomId,playerType)
};
export const sacrifice1HpToReturn2animals = async (
  roomId: string,
  playerType: string,
  animal1Id: string,
  animal2Id: string,
) => {
    await removeHpFromPlayer(roomId,playerType,1)
    await deleteAnimalCardFromGraveYardById(roomId,animal1Id)
    await addCardToPlayerDeck(roomId,playerType,animal1Id)
    await deleteAnimalCardFromGraveYardById(roomId,animal2Id)
    await addCardToPlayerDeck(roomId,playerType,animal2Id)
};
export const cancelUsingPowerCards = async (roomId: string, playerType: string) => {
    await changeUsingPowerCardsVar(roomId,playerType,false)
};
export const returnOneAnimal = async (roomId: string, playerType: string, animalId: string) => {
    await deleteAnimalCardFromGraveYardById(roomId,animalId)
    await addCardToPlayerDeck(roomId,playerType,animalId)
};
