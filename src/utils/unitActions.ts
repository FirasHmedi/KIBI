import { ClanName } from './data';
import { getItemsOnce, setItem } from './db';

export const setActivePowerCard = async (roomId: string, cardId?: string) => {
  await setItem('rooms/' + roomId + '/board/', { activeCardId: cardId });
};

export const addAnimalToBoard = async (
  roomId: string,
  playerType: string,
  slotNumber: number,
  animalId: string,
  canAttack: boolean = false,
) => {
  const slots = (await getItemsOnce('rooms/' + roomId + '/board/' + playerType)) ?? [];
  const updatedSlots = [
    slots[0] ?? { cardId: 'empty', canAttack: false },
    slots[1] ?? { cardId: 'empty', canAttack: false },
    slots[2] ?? { cardId: 'empty', canAttack: false },
  ];
  updatedSlots[slotNumber] = { cardId: animalId, canAttack };
  await setItem('rooms/' + roomId + '/board/', { [`${playerType}`]: updatedSlots });
};

export const addCardsToPlayerDeck = async (
  roomId: string,
  playerType: string,
  cardsIds: string[] = [],
) => {
  const existantCardsIds = await getItemsOnce('rooms/' + roomId + '/' + playerType + '/cardsIds');
  await setItem('rooms/' + roomId + '/' + playerType + '/', {
    cardsIds: [...(existantCardsIds ?? []), ...cardsIds],
  });
};

export const removeCardFromPlayerDeck = async (
  roomId: string,
  playerType: string,
  cardId: string,
) => {
  let cardsIds = await getItemsOnce('rooms/' + roomId + '/' + playerType + '/cardsIds');
  cardsIds = cardsIds.filter((id: string) => id != cardId);
  await setItem('rooms/' + roomId + '/' + playerType, { cardsIds: cardsIds });
};

export const addAnimalToGraveYard = async (roomId: string, animalId: string) => {
  const animalGY = await getItemsOnce('rooms/' + roomId + '/board/animalGY');
  const index = animalGY ? animalGY.length : 0;
  await setItem('rooms/' + roomId + '/board/animalGY', { [`${index}`]: animalId });
};

export const addPowerToGraveYard = async (roomId: string, powerId: string) => {
  const powerGY = await getItemsOnce('rooms/' + roomId + '/board/powerGY');
  const index = powerGY ? powerGY.length : 0;
  await setItem('rooms/' + roomId + '/board/powerGY', { [`${index}`]: powerId });
};

export const removePlayerAnimalFromBoard = async (
  roomId: string,
  playerType: string,
  slotNumber: number,
): Promise<boolean> => {
  const cardId = await getItemsOnce('rooms/' + roomId + '/board/' + playerType + '/' + slotNumber);
  if (cardId) {
    await setItem('rooms/' + roomId + '/board/' + playerType, {
      [`${slotNumber}`]: { cardId: 'empty', canAttack: false },
    });
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

export const changeEnvUnitAction = async (roomId: string, envType: ClanName) => {
  await setItem('rooms/' + roomId + '/board/', { envType });
};

export const getCardFromMainDeck = async (roomId: string): Promise<string> => {
  const mainDeck = (await getItemsOnce('rooms/' + roomId + '/board/mainDeck')) as string[];
  return mainDeck[mainDeck.length - 1];
};

export const removeCardFromMainDeck = async (roomId: string) => {
  const mainDeck = (await getItemsOnce('rooms/' + roomId + '/board/mainDeck')) as string[];
  mainDeck.pop();
  await setItem('rooms/' + roomId + '/board/', { mainDeck: mainDeck });
};

export const changeCanAttackVar = async (roomId: string, playerType: string, value: boolean) => {
  await setItem('rooms/' + roomId + '/' + playerType, { canAttack: value });
};

export const changeCanAttackVarOfSlot = async (
  roomId: string,
  playerType: string,
  slotNumber: number,
  value: boolean,
) => {
  await setItem('rooms/' + roomId + '/board/' + playerType + '/' + slotNumber, {
    canAttack: value,
  });
};

export const changeUsingPowerCardsVar = async (
  roomId: string,
  playerType: string,
  value: boolean,
) => {
  await setItem('rooms/' + roomId + '/' + playerType, { canPlayPowers: value });
};

export const getPowerCardFromGraveYardByIndex = async (roomId: string, index: number) => {
  let powerGY = await getItemsOnce('rooms/' + roomId + '/board/powerGY');
  return powerGY[index];
};

export const deletePowerCardFromGraveYardById = async (roomId: string, powerId: string) => {
  let powerCardsId = await getItemsOnce('rooms/' + roomId + '/board/powerGY');
  powerCardsId = (powerCardsId ?? []).filter((id: string) => id != powerId);
  await setItem('rooms/' + roomId, { powerGY: powerCardsId });
};

export const deletePowerCardFromGraveYardByIndex = async (roomId: string, index: number) => {
  let powerCardsId = await getItemsOnce('rooms/' + roomId + '/board/powerGY');
  powerCardsId.splice(index, 1);
  await setItem('rooms/' + roomId, { powerGY: powerCardsId });
};

export const deleteAnimalCardFromGraveYardById = async (roomId: string, animalId: string) => {
  let animalGY = await getItemsOnce('rooms/' + roomId + '/board/animalGY');
  animalGY = (animalGY ?? []).filter((id: string) => id != animalId);
  await setItem('rooms/' + roomId, { animalGY: animalGY });
};

export const deleteAnimalCardsFromGraveYardByIds = async (
  roomId: string,
  animalsIds: string[] = [],
) => {
  let animalGY = await getItemsOnce('rooms/' + roomId + '/board/animalGY');
  animalGY = (animalGY ?? []).filter((id: string) => !animalsIds.includes(id));
  await setItem('rooms/' + roomId, { animalGY: animalGY });
};

export const getAnimalCardFromGraveYardByIndex = async (roomId: string, index: number) => {
  const animalGY = await getItemsOnce('rooms/' + roomId + '/board/animalGY');
  return animalGY[index];
};

export const deleteAnimalCardFromGraveYardByIndex = async (roomId: string, index: number) => {
  const animalGY: string[] = (await getItemsOnce('rooms/' + roomId + '/board/animalGY')) ?? [];
  animalGY.splice(index, 1);
  await setItem('rooms/' + roomId, { animalGY: animalGY });
};

export const getPLayerHealth = async (roomId: string, playerType: string) => {
  return await getItemsOnce('rooms/' + roomId + '/' + playerType + '/hp');
};

export const changePLayerHealth = async (roomId: string, playerType: string, hp: number) => {
  await setItem('rooms/' + roomId + '/' + playerType, { hp: hp });
};

export const getPLayerCards = async (roomId: string, playerType: string) => {
  return await getItemsOnce('rooms/' + roomId + '/' + playerType + '/cardsIds');
};

export const changePLayerCards = async (roomId: string, playerType: string, cards: string[]) => {
  await setItem('rooms/' + roomId + '/' + playerType, { cardsIds: cards });
};

export const addOneRound = async (roomId: string, playerType: string) => {
  const round = await getItemsOnce('rooms/' + roomId + '/round');
  round.player = playerType;
  round.nb += 1;
  await setItem('rooms/' + roomId + '/round', round);
};
