// ---------------------------unit action-----------------
import { getItemsOnce, setItem } from './db';

export const addAnimalToBoard = async (
  roomId: string,
  playerType: string,
  slotNumber: number,
  animalId: string,
) => {
  // add to the player board (rooms${roomId}->boards->player${playerType}->slotNumber${slotNumber$}->${animalId})
  const slots = (await getItemsOnce('rooms/' + roomId + '/board/' + playerType)) ?? [];
  const updatedSlots = [slots[0] ?? 'empty', slots[1] ?? 'empty', slots[2] ?? 'empty'];
  updatedSlots[slotNumber] = animalId;
  await setItem('rooms/' + roomId + '/board/', { [`${playerType}`]: updatedSlots });
};
export const addCardToPlayerDeck = async (roomId: string, playerType: string, cardId: string) => {
  // add to player cards (rooms${roomId}->player${playerType}->cards)
  let cards = await getItemsOnce('rooms/' + roomId + '/' + playerType + '/cards');
  let index = cards ? cards.length : 0;
  await setItem('rooms/' + roomId + '/' + playerType + '/cards', { [`${index}`]: cardId });
};
export const removeCardFromPlayerDeck = async (
  roomId: string,
  playerType: string,
  cardId: string,
) => {
  let cardsIds = await getItemsOnce('rooms/' + roomId + '/' + playerType + '/cardsIds');
  cardsIds = cardsIds.filter((id: string) => id != cardId);
  console.log(cardsIds);
  await setItem('rooms/' + roomId + '/' + playerType, { cardsIds });
};
export const addAnimalToGraveYard = (roomId: string, animalId: string) => {
  // add  animal to graveYard (rooms${roomId}->animalGraveYard)
};
export const addPowerToGraveYard = (roomId: string, animalId: string) => {
  // add  power to graveYard (rooms${roomId}->powerGraveYard)
};
export const removePlayerAnimalFromBoard = (
  roomId: string,
  playerType: string,
  slotNumber: string,
) => {
  // remove Animal From Player Board (rooms${roomId}->boards->player${playerType}->slot${animalId})
};
export const addHpToPlayer = async (roomId: string, playerType: string, hp: number) => {
  // add hp to the player (rooms${roomId}->player${playerType}->health)
  let oldHp = await getItemsOnce('rooms/' + roomId + '/' + playerType + '/hp');
  if (oldHp) {
    let newHp = oldHp + hp;
    await setItem('rooms/' + roomId + '/' + playerType, { hp: newHp });
  }
};
export const removeHpFromPlayer = async (roomId: string, playerType: string, hp: number) => {
  // remove Hp From player (rooms${roomId}->player${playerType}->health)
  let oldHp = await getItemsOnce('rooms/' + roomId + '/' + playerType + '/hp');
  if (oldHp) {
    let newHp = oldHp - hp;
    await setItem('rooms/' + roomId + '/' + playerType, { hp: newHp });
  }
};
export const addInfoToLog = async (roomId: string, text: string) => {
  // write the log (rooms${roomId}->log)
  let log = await getItemsOnce('rooms/' + roomId + '/log');
  let index = log ? log.length : 0;
  console.log('index ', index, text);
  await setItem('rooms/' + roomId + '/log', { [`${index}`]: text });
};
export const changeEnv = (roomId: string, env: string) => {
  // change the env in the room (rooms${roomId}->env)
};
export const getCardFromMainDeck = async (roomId: string) => {
  // get last card from mainDeck (rooms${roomId}->mainDeck)
  let mainDeck = await getItemsOnce('rooms/' + roomId + '/mainDeck');
  return mainDeck[mainDeck.length - 1];
};
export const removeCardFromMainDeck = async (roomId: string) => {
  // remove last card from mainDeck (rooms${roomId}->MainDeck)
  let mainDeck = await getItemsOnce('rooms/' + roomId + '/mainDeck');
  mainDeck.pop();
  await setItem('rooms/' + roomId, { mainDeck: mainDeck });
};
export const changeCanAttackVar = (roomId: string, playerType: string, value: boolean) => {
  // change can attack value (rooms${roomId}->player${playerType}->canAttack)
};
export const changeCanAttackVarOfSlot = (
  roomId: string,
  playerType: string,
  slotNumber: string,
  value: boolean,
) => {
  // change can attack value (rooms${roomId}->boards->player${playerType}->slotNumber${slotNumber$}->canAttack)
};
export const changeUsingPowerCardsVar = (
  roomId: string,
  playerType: string,
  slotNumber: string,
  value: boolean,
) => {
  // change  using power card var (rooms${roomId}->player${playerType}->UsingPowerCards)
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
export const changePLayerHealth = (roomId: string, playerType: string, hp: number) => {
  // change player health(rooms${roomId}->${playerType}-->health)
};
export const getPLayerCards = (roomId: string, playerType: string) => {
  // return player health(rooms${roomId}->${playerType}-->cards)
};
export const changePLayerCards = (roomId: string, playerType: string, cards: string[]) => {
  // change player health(rooms${roomId}->${playerType}-->cards)
};
