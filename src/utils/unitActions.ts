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
  const updatedSlots = [slots[0] ?? {cardId:'empty',canAttack:false}, slots[1] ?? {cardId:'empty',canAttack:false}, slots[2] ?? {cardId:'empty',canAttack:false}];
  updatedSlots[slotNumber].cardId = animalId;
  await setItem('rooms/' + roomId + '/board/', { [`${playerType}`]: updatedSlots });
};
export const addCardToPlayerDeck = async (roomId: string, playerType: string, cardId: string) => {
  // add to player cards (rooms${roomId}->player${playerType}->cards)
  let cards = await getItemsOnce('rooms/' + roomId + '/' + playerType + '/cardsIds');
  let index = cards ? cards.length : 0;
  await setItem('rooms/' + roomId + '/' + playerType + '/cardsIds', { [`${index}`]: cardId });
};
export const removeCardFromPlayerDeck = async (
  roomId: string,
  playerType: string,
  cardId: string,
) => {
  let cardsIds = await getItemsOnce('rooms/' + roomId + '/' + playerType + '/cardsIds');
  cardsIds = cardsIds.filter((id: string) => id != cardId);
  await setItem('rooms/' + roomId + '/' + playerType, { cardsIds:cardsIds });
};
export const addAnimalToGraveYard = async (roomId: string, animalId: string) => {
  // add  animal to graveYard (rooms${roomId}->animalGraveYard)
   let animalGraveYard = await getItemsOnce('rooms/' + roomId + '/animalGraveYard');
  let index = animalGraveYard ? animalGraveYard.length : 0;
  await setItem('rooms/' + roomId +  '/animalGraveYard', { [`${index}`]: animalId });
};
export const addPowerToGraveYard = async (roomId: string, powerId: string) => {
  // add  power to graveYard (rooms${roomId}->powerGraveYard)
  let powerGraveYard = await getItemsOnce('rooms/' + roomId + '/powerGraveYard');
  let index = powerGraveYard ? powerGraveYard.length : 0;
  await setItem('rooms/' + roomId +  '/powerGraveYard', { [`${index}`]: powerId });
};
export const removePlayerAnimalFromBoard = async (
  roomId: string,
  playerType: string,
  slotNumber: number,
):Promise<boolean> => {
  // remove Animal From Player Board (rooms${roomId}->boards->player${playerType}->slot${animalId})
  let cardId =  await getItemsOnce('rooms/' + roomId + '/board/' + playerType+'/'+slotNumber );
  if(cardId){
    await setItem('rooms/' + roomId + '/board/' + playerType, { [`${slotNumber}`]: {cardId:'empty',canAttack:false} });
    return true;
  }
 return false;
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
export const changeEnvUnitAction = async (roomId: string, env: string) => {
  // change the env in the room (rooms${roomId}->env)
  await setItem('rooms/' + roomId ,{env:env});
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
export const changeCanAttackVar = async (roomId: string, playerType: string, value: boolean) => {
  // change can attack value (rooms${roomId}->player${playerType}->canAttack)
  await setItem('rooms/' + roomId+'/'+playerType ,{canAttack:value});

};
export const changeCanAttackVarOfSlot = async (
  roomId: string,
  playerType: string,
  slotNumber: number,
  value: boolean,
) => {
  // change can attack value (rooms${roomId}->boards->player${playerType}->slotNumber${slotNumber$}->canAttack)
  await setItem('rooms/' + roomId + '/board/' + playerType+'/'+slotNumber ,{canAttack:value});

};
export const changeUsingPowerCardsVar = async (
  roomId: string,
  playerType: string,
  value:boolean
) => {
  // change  using power card var (rooms${roomId}->player${playerType}->UsingPowerCards)
  await setItem('rooms/' + roomId + '/' + playerType ,{UsingPowerCards:value});
};

export const getPowerCardFromGraveYardByIndex = async (roomId: string, index: number) => {
  // delete an Animal card from the graveYard (rooms${roomId}->animalGraveYard)
  let powerGraveYard = await getItemsOnce('rooms/' + roomId + '/powerGraveYard');
  return powerGraveYard[index]
};
export const deletePowerCardFromGraveYardById = async (roomId: string, powerId: string) => {
  // delete a power card from the graveYard (rooms${roomId}->powerGraveYard)
  let powerCardsId = await getItemsOnce('rooms/' + roomId + '/powerGraveYard');
  powerCardsId = powerCardsId.filter((id: string) => id != powerId);
  await setItem('rooms/' + roomId  , { powerGraveYard:powerCardsId });
};
export const deletePowerCardFromGraveYardByIndex = async (roomId: string, index: number) => {
  // delete a power card from the graveYard (rooms${roomId}->powerGraveYard)
  let powerCardsId = await getItemsOnce('rooms/' + roomId + '/powerGraveYard');
  powerCardsId.splice(index,1);
  await setItem('rooms/' + roomId  , { powerGraveYard:powerCardsId });
};

export const deleteAnimalCardFromGraveYardById = async (roomId: string, animalId: string) => {
  // delete an Animal card from the graveYard (rooms${roomId}->animalGraveYard)
  let animalGraveYard = await getItemsOnce('rooms/' + roomId + '/animalGraveYard');
  animalGraveYard = animalGraveYard.filter((id: string) => id != animalId);
  await setItem('rooms/' + roomId  , { animalGraveYard:animalGraveYard });
};
export const getAnimalCardFromGraveYardByIndex = async (roomId: string, index: number) => {
  // delete an Animal card from the graveYard (rooms${roomId}->animalGraveYard)
  let animalGraveYard = await getItemsOnce('rooms/' + roomId + '/animalGraveYard');
  return animalGraveYard[index]
};
export const deleteAnimalCardFromGraveYardByIndex = async (roomId: string, index: number) => {
  // delete an Animal card from the graveYard (rooms${roomId}->animalGraveYard)
  let animalGraveYard = await getItemsOnce('rooms/' + roomId + '/animalGraveYard');
  animalGraveYard.splice(index,1);
  await setItem('rooms/' + roomId  , { animalGraveYard:animalGraveYard });
};
export const getPLayerHealth = async (roomId: string, playerType: string) => {
  // return player health(rooms${roomId}->${playerId}-->health)
  return  await getItemsOnce('rooms/' + roomId +'/'+playerType +'/hp');

};
export const changePLayerHealth = async (roomId: string, playerType: string, hp: number) => {
  await setItem('rooms/' + roomId +'/'+playerType ,{hp:hp})
};
export const getPLayerCards = async (roomId: string, playerType: string) => {
  // return player health(rooms${roomId}->${playerType}-->cards)
  return  await getItemsOnce('rooms/' + roomId + '/' + playerType + '/cardsIds');

};
export const changePLayerCards = async (roomId: string, playerType: string, cards: string[]) => {
  // change player health(rooms${roomId}->${playerType}-->cards)
  await setItem('rooms/' + roomId + '/' + playerType, { cardsIds:cards });

};
