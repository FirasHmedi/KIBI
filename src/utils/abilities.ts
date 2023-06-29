// ******************************Power cards**********************************************
export const cancelAttacks = (roomId: string, playerId: string) => {
  // changeCanAttackVar (false) (unit action)
};
export const reviveLastPower = (roomId: string, playerId: string) => {
    // getPowerCardFromGraveYardByIndex (length-1)  (unit action)
    // deletePowerCardFromGraveYardByIndex (length-1) (unit action)
    // addCardToPlayerDeck (unit action)
};
export const sacrifice2HpToRevive = (roomId: string, playerId: string, animalId: string, slotNumber: string) => {
  // removeHpFromPlayer (2hp) (unit action)
  // deleteAnimalCardFromGraveYardById (unit action)
  // addAnimalToBoard (unit action)
  // changeCanAttackVarOfSlot (true) (unit action)
};
export const sacrifice3HpToSteal = (roomId: string, playerId: string, animalId: string, slotNumber: string) => {
  // removeHpFromPlayer (3hp) (unit action)
  // removePlayerAnimalFromBoard (unit action)
  // addAnimalToBoard (unit action)
  // changeCanAttackVarOfSlot (true) (unit action)
};
export const sacrifice1HpReviveLastAnimal = (roomId: string, playerId: string, slotNumber: string) => {
  // removeHpFromPlayer (1hp) (unit action)
  // getAnimalCardFromGraveYardByIndex (length-1)  (unit action)
  // deleteAnimalCardFromGraveYardByIndex (length-1) (unit action)
  // addAnimalToBoard (unit action)
};
export const switchHealth = (roomId: string) => {
  // getPLayerHealth (player one) (unit action)
  // getPLayerHealth (player one) (unit action)
  // changePLayerHealth (player one) (unit action)
  // changePLayerHealth (player one) (unit action)
};
export const switchDeck = (roomId: string) => {
    // getPLayerCards (player one) (unit action)
    // getPLayerCards (player one) (unit action)
    // changePLayerCards (player one) (unit action)
    // changePLayerCards (player one) (unit action)
};
export const changeEnv = (roomId: string, env: string) => {
    // changeEnv (unit action)
};
export const sacrificeAnimalToGet3Hp = (roomId: string, playerId: string, animalId: string) => {
  // removeCardFromPlayerDeck (unit action)
  // addAnimalToGraveYard  (unit action)
  // addHpToPlayer (3hp) (unit action)
};
export const shieldOwnerPlus2Hp = (roomId: string, playerId: string) => {
    // addHpToPlayer (2hp) (unit action)
};
export const shieldOwnerPlus3Hp = (roomId: string, playerId: string) => {
    // addHpToPlayer (3hp) (unit action)
};
export const draw2Cards = (roomId: string, playerId: string) => {
  // playerDrawCard (Complex action) * 2
};
export const sacrifice1HpToReturn2animals = (roomId: string, playerId: string, animal1Id: string, animal2Id: string) => {
    // addHpToPlayer (1hp) (unit action)
    // deleteAnimalCardFromGraveYardById (animal1Id) (unit action)
    // addCardToPlayerDeck (animal1Id) (unit action)
    // deleteAnimalCardFromGraveYardById (animal2Id) (unit action)
    // addCardToPlayerDeck (animal2Id) (unit action)
};
export const cancelUsingPowerCards = (roomId: string, playerId: string) => {
     // changeUsingPowerCardsVar (false) (unit action)
};
export const returnOneAnimal = (roomId: string, playerId: string, animalId: string) => {
    // deleteAnimalCardFromGraveYardById (animalId) (unit action)
    // addCardToPlayerDeck (animalId) (unit action)
};
