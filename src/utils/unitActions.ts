// ---------------------------unit action-----------------
import {cancelUsingPowerCards} from "./abilities";

export const addAnimalToBoard = (roomId: string, playerId: string, slotNumber: string, animalId: string) => {
  // add to the player board (rooms${roomId}->boards->player${playerId}->slotNumber${slotNumber$}->${animalId})
};
export const addCardToPlayerDeck = (roomId: string, playerId: string, cardId: string) => {
  // add to player cards (rooms${roomId}->player${playerId}->cards)
};
export const removeCardFromPlayerDeck = (roomId: string, playerId: string, cardId: string) => {
  // remove Card From Player Deck (rooms${roomId}->player${playerId}->cards)
};
export const addAnimalToGraveYard = (roomId: string, animalId: string) => {
  // add  animal to graveYard (rooms${roomId}->animalGraveYard)
};
export const addPowerToGraveYard = (roomId: string, animalId: string) => {
  // add  power to graveYard (rooms${roomId}->powerGraveYard)
};
export const removePlayerAnimalFromBoard = (roomId: string, playerId: string, slotNumber: string) => {
  // remove Animal From Player Board (rooms${roomId}->boards->player${playerId}->slot${animalId})
};
export const addHpToPlayer = (roomId: string, playerId: string, hp: number) => {
  // add hp to the player (rooms${roomId}->player${playerId}->health)
};
export const removeHpFromPlayer = (roomId: string, playerId: string, hp: number) => {
  // remove Hp From player (rooms${roomId}->player${playerId}->health)
};
export const addInfoToLog = (roomId: string, text: string) => {
  // write the log (rooms${roomId}->log)
};
export const changeEnv = (roomId: string, env: string) => {
  // change the env in the room (rooms${roomId}->env)
};
export const getCardFromMainDeck = (roomId: string) => {
  // get Random card from mainDeck (rooms${roomId}->mainDeck)
};
export const removeCardFromMainDeck = (roomId: string, cardId: string) => {
  // remove card from mainDeck (rooms${roomId}->MainDeck)
};
export const changeCanAttackVar = (roomId: string, playerId: string,value:boolean) => {
    // change can attack value (rooms${roomId}->player${playerId}->canAttack)
};
export const changeCanAttackVarOfSlot = (roomId: string, playerId: string, slotNumber: string, value:boolean) => {
    // change can attack value (rooms${roomId}->boards->player${playerId}->slotNumber${slotNumber$}->canAttack)
};
export const changeUsingPowerCardsVar = (roomId: string, playerId: string, slotNumber: string, value:boolean) => {
    // change  using power card var (rooms${roomId}->player${playerId}->UsingPowerCards)
};
export const getPowerCardFromGraveYardById = (roomId: string, powerId: string) => {
    // return a power card from the graveYard (rooms${roomId}->powerGraveYard)
};
export const deletePowerCardFromGraveYardById = (roomId: string, powerId: string) => {
    // delete a power card from the graveYard (rooms${roomId}->powerGraveYard)
};
export const getPowerCardFromGraveYardByIndex = (roomId: string, index: string) => {
    // return a power card from the graveYard (rooms${roomId}->powerGraveYard)
};
export const deletePowerCardFromGraveYardByIndex = (roomId: string, index: string) => {
    // delete a power card from the graveYard (rooms${roomId}->powerGraveYard)
};

export const getAnimalCardFromGraveYardById = (roomId: string, animalId: string) => {
    // return an Animal card from the graveYard (rooms${roomId}->animalGraveYard)
};
export const deleteAnimalCardFromGraveYardById = (roomId: string, animalId: string) => {
    // delete an Animal card from the graveYard (rooms${roomId}->animalGraveYard)
};
export const getAnimalCardFromGraveYardByIndex = (roomId: string, index: string) => {
    // return an Animal card from the graveYard (rooms${roomId}->animalGraveYard)
};
export const deleteAnimalCardFromGraveYardByIndex = (roomId: string, index: string) => {
    // delete an Animal card from the graveYard (rooms${roomId}->animalGraveYard)
};
export const getPLayerHealth = (roomId: string, playerId: string) => {
    // return player health(rooms${roomId}->${playerId}-->health)
};
export const changePLayerHealth = (roomId: string, playerId: string,hp:number) => {
    // change player health(rooms${roomId}->${playerId}-->health)
};
export const getPLayerCards = (roomId: string, playerId: string) => {
    // return player health(rooms${roomId}->${playerId}-->cards)
};
export const changePLayerCards = (roomId: string, playerId: string,cards:string[]) => {
    // change player health(rooms${roomId}->${playerId}-->cards)
};