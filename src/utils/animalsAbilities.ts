// ******************************animal abilities**********************************************
// ----------------------king------------------
import {ANIMAL_CARDS_OBJECT, ANIMALS_POINTS} from "./data";
import {
    addAnimalToBoard,
    addAnimalToGraveYard,
    addCardToPlayerDeck, addHpToPlayer,
    addInfoToLog, deleteAnimalCardFromGraveYardById,
    removeHpFromPlayer,
    removePlayerAnimalFromBoard
} from "./unitActions";
import {playerDrawCard} from "./actions";
import {getItemsOnce} from "./db";


// ----------------------attacker--------------------
export const removeOpponentAnimal = async (roomId: string, playerType: string, slotNumber: number,animalId:string) => {
  // removePlayerAnimalFromBoard (unit action)
    await removePlayerAnimalFromBoard(roomId,playerType,slotNumber)
  // addAnimalToGraveYard (unit action)
    await addAnimalToGraveYard(roomId,animalId)
};
// ----------------------tank-----------------------
export const returnTankToDeck = async (roomId: string, playerType: string, animalId: string) => {
  // addCardToPlayerDeck (unit action)
   await addCardToPlayerDeck(roomId,playerType,animalId)
};
// ----------------------Snake -----------------------
export const add1Hp = async (roomId: string, playerType: string) => {
  // addHpToPlayer (1hp) (unit action)
    await addHpToPlayer(roomId,playerType,1)
};
// ----------------------jellyfish-----------------------
export const drawOneCard = async (roomId: string, playerType: string) => {
  // playerDrawCard (Complex action)
    await playerDrawCard(roomId,playerType)
};
// ----------------------Crow-----------------------
export const minus1Hp = async (roomId: string, playerType: string) => {
  // removeHpFromPlayer (1hp) (unit action)
    await removeHpFromPlayer(roomId,playerType,1)
};
// ----------------------Fox-----------------------
export const ReviveLastAnimalToDeck = async (roomId: string, playerType: string) => {
    let animalGraveYard = await getItemsOnce('rooms/' + roomId + '/animalGraveYard')
    if(animalGraveYard){
        let lastAnimalCardId = animalGraveYard[animalGraveYard.length-1]
        // deleteAnimalCardFromGraveYardByIndex (length-1) (unit action)
        await deleteAnimalCardFromGraveYardById(roomId,lastAnimalCardId)
        // addCardToPlayerDeck (unit action)
        await  addCardToPlayerDeck(roomId,playerType,lastAnimalCardId)
    }
};
