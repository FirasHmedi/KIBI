import { getItemsOnce, setItem } from './db';

export const addAnimalToBoard = async (
  roomId: string,
  playerType: string,
  slotNumber: number,
  animalId: string,
) => {
  const slots = (await getItemsOnce('rooms/' + roomId + '/board/' + playerType)) ?? [];
  const updatedSlots = [slots[0] ?? {cardId:'empty',canAttack:false}, slots[1] ?? {cardId:'empty',canAttack:false}, slots[2] ?? {cardId:'empty',canAttack:false}];
  updatedSlots[slotNumber].cardId = animalId;
  await setItem('rooms/' + roomId + '/board/', { [`${playerType}`]: updatedSlots });
};
export const addCardToPlayerDeck = async (roomId: string, playerType: string, cardId: string) => {
  const cards = await getItemsOnce('rooms/' + roomId + '/' + playerType + '/cardsIds');
  const index = cards ? cards.length : 0;
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
   const animalGraveYard = await getItemsOnce('rooms/' + roomId + '/board/animalGraveYard');
  const index = animalGraveYard ? animalGraveYard.length : 0;
  await setItem('rooms/' + roomId +  '/board/animalGraveYard', { [`${index}`]: animalId });
};
export const addPowerToGraveYard = async (roomId: string, powerId: string) => {
  const powerGraveYard = await getItemsOnce('rooms/' + roomId + '/board/powerGraveYard');
  const index = powerGraveYard ? powerGraveYard.length : 0;
  await setItem('rooms/' + roomId +  '/board/powerGraveYard', { [`${index}`]: powerId });
};
export const removePlayerAnimalFromBoard = async (
  roomId: string,
  playerType: string,
  slotNumber: number,
):Promise<boolean> => {
  const cardId =  await getItemsOnce('rooms/' + roomId + '/board/' + playerType+'/'+slotNumber );
  if(cardId){
    await setItem('rooms/' + roomId + '/board/' + playerType, { [`${slotNumber}`]: {cardId:'empty',canAttack:false} });
    return true;
  }
 return false;
};
export const addHpToPlayer = async (roomId: string, playerType: string, hp: number) => {
  const oldHp = await getItemsOnce('rooms/' + roomId + '/' + playerType + '/hp');
  if (oldHp) {
    const newHp = oldHp + hp;
    await setItem('rooms/' + roomId + '/' + playerType, { hp: newHp });
  }
};
export const removeHpFromPlayer = async (roomId: string, playerType: string, hp: number) => {
  const oldHp = await getItemsOnce('rooms/' + roomId + '/' + playerType + '/hp');
  if (oldHp) {
    const newHp = oldHp - hp;
    await setItem('rooms/' + roomId + '/' + playerType, { hp: newHp });
  }
};
export const addInfoToLog = async (roomId: string, text: string) => {
  const log = await getItemsOnce('rooms/' + roomId + '/log');
  const index = log ? log.length : 0;
  await setItem('rooms/' + roomId + '/log', { [`${index}`]: text });
};
export const changeEnvUnitAction = async (roomId: string, env: string) => {
  await setItem('rooms/' + roomId ,{env:env});
};
export const getCardFromMainDeck = async (roomId: string) => {
  const mainDeck = await getItemsOnce('rooms/' + roomId + '/board/mainDeck');
  return mainDeck[mainDeck.length - 1];
};
export const removeCardFromMainDeck = async (roomId: string) => {
  const mainDeck = await getItemsOnce('rooms/' + roomId + '/board/mainDeck');
  mainDeck.pop();
  await setItem('rooms/' + roomId, { mainDeck: mainDeck });
};
export const changeCanAttackVar = async (roomId: string, playerType: string, value: boolean) => {
  await setItem('rooms/' + roomId+'/'+playerType ,{canAttack:value});

};
export const changeCanAttackVarOfSlot = async (
  roomId: string,
  playerType: string,
  slotNumber: number,
  value: boolean,
) => {
  await setItem('rooms/' + roomId + '/board/' + playerType+'/'+slotNumber ,{canAttack:value});

};
export const changeUsingPowerCardsVar = async (
  roomId: string,
  playerType: string,
  value:boolean
) => {
  await setItem('rooms/' + roomId + '/' + playerType ,{UsingPowerCards:value});
};

export const getPowerCardFromGraveYardByIndex = async (roomId: string, index: number) => {
  let powerGraveYard = await getItemsOnce('rooms/' + roomId + '/board/powerGraveYard');
  return powerGraveYard[index]
};
export const deletePowerCardFromGraveYardById = async (roomId: string, powerId: string) => {
  let powerCardsId = await getItemsOnce('rooms/' + roomId + '/board/powerGraveYard');
  powerCardsId = powerCardsId.filter((id: string) => id != powerId);
  await setItem('rooms/' + roomId  , { powerGraveYard:powerCardsId });
};
export const deletePowerCardFromGraveYardByIndex = async (roomId: string, index: number) => {
  let powerCardsId = await getItemsOnce('rooms/' + roomId + '/board/powerGraveYard');
  powerCardsId.splice(index,1);
  await setItem('rooms/' + roomId  , { powerGraveYard:powerCardsId });
};

export const deleteAnimalCardFromGraveYardById = async (roomId: string, animalId: string) => {
  let animalGraveYard = await getItemsOnce('rooms/' + roomId + '/board/animalGraveYard');
  animalGraveYard = animalGraveYard.filter((id: string) => id != animalId);
  await setItem('rooms/' + roomId  , { animalGraveYard:animalGraveYard });
};
export const getAnimalCardFromGraveYardByIndex = async (roomId: string, index: number) => {
  const animalGraveYard = await getItemsOnce('rooms/' + roomId + '/board/animalGraveYard');
  return animalGraveYard[index]
};
export const deleteAnimalCardFromGraveYardByIndex = async (roomId: string, index: number) => {
  const animalGraveYard = await getItemsOnce('rooms/' + roomId + '/board/animalGraveYard');
  animalGraveYard.splice(index,1);
  await setItem('rooms/' + roomId  , { animalGraveYard:animalGraveYard });
};
export const getPLayerHealth = async (roomId: string, playerType: string) => {
  return  await getItemsOnce('rooms/' + roomId +'/'+playerType +'/hp');

};
export const changePLayerHealth = async (roomId: string, playerType: string, hp: number) => {
  await setItem('rooms/' + roomId +'/'+playerType ,{hp:hp})
};
export const getPLayerCards = async (roomId: string, playerType: string) => {
  return  await getItemsOnce('rooms/' + roomId + '/' + playerType + '/cardsIds');

};
export const changePLayerCards = async (roomId: string, playerType: string, cards: string[]) => {
  await setItem('rooms/' + roomId + '/' + playerType, { cardsIds:cards });
};
