
// ---------------------------Complex Action-----------------
export const playerDrawCard = (roomId:string,playerId:string) =>{
    // addInfoToLog (unit action)
    // getCardFromMainDeck (unit action)
    // removeCardFromMainDeck (unit action)
    // addCardToPlayerDeck (unit action)
}
export const placeNormalAnimalOnBoard = (roomId:string,playerId:string,slotNumber:string,animalId:string) =>{
    // addInfoToLog (unit action)
    // addAnimalToBoard (unit action)
    // removeCardFromPlayerDeck (unit action)
}
export const placeNormalKingOnBoard = (roomId:string,playerId:string,kingId:string,sacrificedAnimalId:string) =>{
    // addInfoToLog (unit action)
    // removePlayerAnimalFromBoard (sacrificedAnimal) (unit action)
    // addAnimalToGraveYard (sacrificedAnimal) (unit action)
    // removeCardFromPlayerDeck (King) (unit action)
    // addAnimalToBoard (King)  (unit action)
}
export const placePowerCard = (roomId:string,playerId:string,powerCardId:string) =>{
    // addInfoToLog (unit action)
    // removeCardFromPlayerDeck (unit action)
    // use the abilities (abilities)
    // addPowerToGraveYard (unit action)
}
export const attackAnimal = (roomId:string,playerId:string,animal1Id:string,animal2Id:string) =>{
    // addInfoToLog (unit action)
    // removePlayerAnimalFromBoard (unit action)
    // addAnimalToGraveYard (unit action)
    // check if the animal killed is an attacker in his env so activate (removeOpponentAnimal ability)
    // check if the animal killed is a tank in his env so activate (returnTankToDeck ability)
}
export const attackOwner = (roomId:string,playerId:string,animal1Id:string,animal2Id:string) =>{
    // addInfoToLog (unit action)
    // removeHpFromPlayer (unit action)
}
export const jokerAbilities = (roomId:string) =>{
    // each round or after player change the env
    // check if there's joker in the right env so activate their Abilities
    // addInfoToLog (unit action)
}