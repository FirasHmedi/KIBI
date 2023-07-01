// ******************************animal abilities**********************************************
// ----------------------king------------------
export const attackOwner = (roomId: string, playerType: string, animal1Id: string) => {
  // attackOwner (complex action)
};
// ----------------------attacker--------------------
export const removeOpponentAnimal = (roomId: string, playerType: string, animal1Id: string) => {
    // removePlayerAnimalFromBoard (unit action)
    // addAnimalToGraveYard (unit action)
};
// ----------------------tank-----------------------
export const returnTankToDeck = (roomId: string, playerType: string, animal1Id: string) => {
  // addCardToPlayerDeck (unit action)
};
// ----------------------Snake -----------------------
export const add1Hp = (roomId: string, playerType: string) => {
    // addHpToPlayer (1hp) (unit action)
};
// ----------------------jellyfish-----------------------
export const drawOneCard = (roomId: string, playerType: string) => {
  // playerDrawCard (Complex action)
};
// ----------------------Crow-----------------------
export const minus1Hp = (roomId: string, playerType: string) => {
    // removeHpFromPlayer (1hp) (unit action)
};
// ----------------------Fox-----------------------
export const ReviveLastAnimalToDeck = (roomId: string, playerType: string) => {
    // getAnimalCardFromGraveYardByIndex (length-1)  (unit action)
    // deleteAnimalCardFromGraveYardByIndex (length-1) (unit action)
    // addCardToPlayerDeck (unit action)
};
