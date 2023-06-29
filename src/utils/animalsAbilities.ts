// ******************************animal abilities**********************************************
// ----------------------king------------------
export const attackOwner = (roomId: string, playerId: string, animal1Id: string) => {
  // user attack owner from actions
};
// ----------------------attacker--------------------
export const removeOpponentAnimal = (roomId: string, playerId: string, animal1Id: string) => {
  // remove the animal from the player board (rooms${roomId}->boards->player${playerId})
  // add  animal to graveYard (rooms${roomId}->animalGraveYard)
};
// ----------------------tank-----------------------
export const returnTankToDeck = (roomId: string, playerId: string, animal1Id: string) => {
  // add animal to player cards (rooms${roomId}->player${playerId}->cards)
};
// ----------------------Snake -----------------------
export const add1Hp = (roomId: string, playerId: string) => {
  // add 1 hp to the player (rooms${roomId}->player${playerId}->health)
};
// ----------------------jellyfish-----------------------
export const drawOneCard = (roomId: string, playerId: string) => {
  // use draw one card from actions
};
// ----------------------Crow-----------------------
export const minus1Hp = (roomId: string, playerId: string) => {
  // add 1 hp to the player (rooms${roomId}->player${playerId}->health)
};
// ----------------------Fox-----------------------
export const ReviveLastAnimalToDeck = (roomId: string, playerId: string) => {
  // get last animal card (rooms${roomId}->animalGraveYard${length-1})
  // delete from animal graveYard (rooms${roomId}->animalGraveYard${length-1})
  // add animal to player cards (rooms${roomId}->player${playerId}->cards)
};
