// ---------------------------unit action-----------------
export const addAnimalToBoard = (roomId:string,playerId:string,slotNumber:string,animalId:string) =>{
    // add to the player board (rooms${roomId}->boards->player${playerId}->slotNumber${slotNumber$}->${animalId})
}
export const addCardToPlayerDeck = (roomId:string,playerId:string,cardId:string) =>{
    // add to player cards (rooms${roomId}->player${playerId}->cards)
}
export const removeCardFromPlayerDeck = (roomId:string,playerId:string,cardId:string) =>{
    // remove Card From Player Deck (rooms${roomId}->player${playerId}->cards)
}
export const addAnimalToGraveYard = (roomId:string,animalId:string) =>{
    // add  animal to graveYard (rooms${roomId}->animalGraveYard)
}
export const addPowerToGraveYard = (roomId:string,animalId:string) =>{
    // add  power to graveYard (rooms${roomId}->powerGraveYard)
}
export const removePlayerAnimalFromBoard = (roomId:string,playerId:string,slotNumber:string) =>{
    // remove Animal From Player Board (rooms${roomId}->boards->player${playerId}->slot${animalId})
}
export const addHpToPlayer = (roomId:string,playerId:string,hp:number) =>{
    // add hp to the player (rooms${roomId}->player${playerId}->health)
}
export const removeHpFromPlayer = (roomId:string,playerId:string,hp:number) =>{
    // remove Hp From player (rooms${roomId}->player${playerId}->health)
}
export const addInfoToLog = (roomId:string,text:string) =>{
    // write the log (rooms${roomId}->log)
}
export const changeEnv = (roomId:string,env:string) =>{
    // change the env in the room (rooms${roomId}->env)
}
export const getCardFromMainDeck = (roomId:string) =>{
    // get Random card from mainDeck (rooms${roomId}->mainDeck)
}
export const removeCardFromMainDeck = (roomId:string,cardId:string) =>{
    // remove card from mainDeck (rooms${roomId}->MainDeck)
}