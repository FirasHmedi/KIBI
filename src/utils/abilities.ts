// ******************************Power cards**********************************************
export const cancelAttacks  = (roomId:string,playerId:string) =>{
    // change can attack var to false (rooms${roomId}->player${playerId}->canAttack)
}
export const reviveLastPower = (roomId:string,playerId:string) =>{
    // get last power card (rooms${roomId}->powerGraveYard${length-1})
    // delete from power graveYard (rooms${roomId}->powerGraveYard${length-1})
    // add to player cards (rooms${roomId}->player${playerId}->cards)
}
export const sacrifice2HpToRevive = (roomId:string,playerId:string,animalId:string,slotNumber:string) =>{
    // remove 2 hp to the player (rooms${roomId}->player${playerId}->health)
    // add to  player board (rooms${roomId}->boards->player${playerId}->slotNumber${slotNumber$}->${animalId})
    // change can of attack var of slot to true (rooms${roomId}->boards->player${playerId}->slotNumber${slotNumber$}->canAttack)
}
export const sacrifice3HpToSteal = (roomId:string,playerId:string,animalId:string,slotNumber:string) =>{
    // remove 3 hp to the player (rooms${roomId}->player${playerId}->health)
    // get card from the opponent and remove it (rooms${roomId}->boards->player${playerId}->slot${animalId})
    // add to the player board (rooms${roomId}->boards->player${playerId}->slotNumber${slotNumber$}->${animalId})
    // change can of attack var of slot to true (rooms${roomId}->boards->player${playerId}->slotNumber${slotNumber$}->canAttack)
}
export const sacrifice1HpReviveLastAnimal = (roomId:string,playerId:string,slotNumber:string) =>{
    // remove 1 hp to the player (rooms${roomId}->player${playerId}->health)
    // get last animal card (rooms${roomId}->animalGraveYard${length-1})
    // delete from animal graveYard (rooms${roomId}->animalGraveYard${length-1})
    // add to the player board (rooms${roomId}->boards->player${playerId}->slotNumber${slotNumber$}->${animalId})
}
export const switchHealth  = (roomId:string) =>{
    // get player One health(rooms${roomId}->playerOne-->health)
    // get player Two health(rooms${roomId}->playerTwo-->health)
    // switch player health (rooms${roomId}->player->health)
}
export const switchDeck  = (roomId:string) =>{
    // get player One cards(rooms${roomId}->playerOne-->cards)
    // get player Two cards(rooms${roomId}->playerTwo-->cards)
    // switch player cards (rooms${roomId}->player->cards)
}
export const environment  = (roomId:string,env:string) =>{
    // change the env in the room (rooms${roomId}->env)
}
export const sacrificeAnimalToGet3Hp = (roomId:string,playerId:string,animalId:string) =>{
    // remove animal from player deck (rooms${roomId}->player${playerId}->cards)
    // add 3 hp to the player (rooms${roomId}->player${playerId}->health)
    // add  animal to graveYard (rooms${roomId}->animalGraveYard)
}
export const shieldOwnerPlus2Hp = (roomId:string,playerId:string) =>{
    // add 2 hp to the player (rooms${roomId}->player${playerId}->health)
}
export const shieldOwnerPlus3Hp = (roomId:string,playerId:string) =>{
    // add 3 hp to the player (rooms${roomId}->player${playerId}->health)
}
export const draw2Cards = (roomId:string,playerId:string) =>{
    // draw 2 cards (action draw one card*2)
}
export const sacrifice1HpToReturn2animals = (roomId:string,playerId:string,animal1Id:string,animal2Id:string) =>{
    // remove 1 hp to the player (rooms${roomId}->player${playerId}->health)
    // add 2 animals to player cards (rooms${roomId}->player${playerId}->cards)
}
export const cancelUsingPowerCards  = (roomId:string,playerId:string) =>{
    // change  using power card var to false (rooms${roomId}->player${playerId}->UsingPowerCards)
}
export const returnOneAnimal = (roomId:string,playerId:string,animal1Id:string) =>{
    // add animal to player cards (rooms${roomId}->player${playerId}->cards)
}
// ******************************animal cards**********************************************
// ----------------------king------------------
export const attackOwner = (roomId:string,playerId:string,animal1Id:string) =>{
    // user attack owner from actions
}
// ----------------------attacker--------------------
export const removeOpponentAnimal = (roomId:string,playerId:string,animal1Id:string) =>{
    // remove the animal from the player board (rooms${roomId}->boards->player${playerId})
    // add  animal to graveYard (rooms${roomId}->animalGraveYard)
}
// ----------------------tank-----------------------
export const returnTankToDeck = (roomId:string,playerId:string,animal1Id:string) =>{
    // add animal to player cards (rooms${roomId}->player${playerId}->cards)
}
// ----------------------Snake -----------------------
export const add1Hp = (roomId:string,playerId:string) =>{
    // add 1 hp to the player (rooms${roomId}->player${playerId}->health)
}
// ----------------------jellyfish-----------------------
export const drawOneCard= (roomId:string,playerId:string) =>{
    // use draw one card from actions
}
// ----------------------Crow-----------------------
export const minus1Hp = (roomId:string,playerId:string) =>{
    // add 1 hp to the player (rooms${roomId}->player${playerId}->health)
}
// ----------------------Fox-----------------------
export const ReviveLastAnimalToDeck = (roomId:string,playerId:string) =>{
    // get last animal card (rooms${roomId}->animalGraveYard${length-1})
    // delete from animal graveYard (rooms${roomId}->animalGraveYard${length-1})
    // add animal to player cards (rooms${roomId}->player${playerId}->cards)
}
