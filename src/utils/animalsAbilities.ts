// ******************************animal abilities**********************************************
// ----------------------king------------------
export const attackOwner = (roomId: string, playerId: string, animal1Id: string) => {
  // attackOwner (complex action)
};
// ----------------------attacker--------------------
export const removeOpponentAnimal = (roomId: string, playerId: string, animal1Id: string) => {
    // removePlayerAnimalFromBoard (unit action)
    // addAnimalToGraveYard (unit action)
};
// ----------------------tank-----------------------
export const returnTankToDeck = (roomId: string, playerId: string, animal1Id: string) => {
  // addCardToPlayerDeck (unit action)
};
// ----------------------Snake -----------------------
export const add1Hp = (roomId: string, playerId: string) => {
    // addHpToPlayer (1hp) (unit action)
};
// ----------------------jellyfish-----------------------
export const drawOneCard = (roomId: string, playerId: string) => {
  // playerDrawCard (Complex action)
};
// ----------------------Crow-----------------------
export const minus1Hp = (roomId: string, playerId: string) => {
    // removeHpFromPlayer (1hp) (unit action)
};
// ----------------------Fox-----------------------
export const ReviveLastAnimalToDeck = (roomId: string, playerId: string) => {
    // getAnimalCardFromGraveYardByIndex (length-1)  (unit action)
    // deleteAnimalCardFromGraveYardByIndex (length-1) (unit action)
    // addCardToPlayerDeck (unit action)
};
