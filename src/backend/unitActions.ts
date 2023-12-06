import isNil from 'lodash/isNil';
import { ClanName, EMPTY } from '../utils/data';
import { isAnimalCard, isPowerCard } from '../utils/helpers';
import { PlayerType } from '../utils/interface';
import { getBoardPath, getGamePath, getItemsOnce, setItem } from './db';

export const setActivePowerCard = async (gameId: string, cardId?: string) => {
	await setItem(getBoardPath(gameId), { activeCardId: cardId });
};

export const checkIfAnimalExistAddItToGraveYard = async (
	gameId: string,
	playerType: string,
	slotNb: number,
) => {
	const slot = await getItemsOnce(getBoardPath(gameId) + playerType + '/' + slotNb);
	if (isAnimalCard(slot?.cardId)) {
		await addAnimalToGraveYard(gameId, slot.cardId);
	}
};

export const addAnimalToBoard = async (
	gameId: string,
	playerType: PlayerType,
	slotNb: number,
	animalId: string,
	canAttack: boolean = false,
) => {
	await checkIfAnimalExistAddItToGraveYard(gameId, playerType, slotNb);
	const slots = (await getItemsOnce(getBoardPath(gameId) + playerType)) ?? [];
	const updatedSlots = [
		slots[0] ?? { cardId: EMPTY, canAttack: false },
		slots[1] ?? { cardId: EMPTY, canAttack: false },
		slots[2] ?? { cardId: EMPTY, canAttack: false },
	];
	updatedSlots[slotNb] = { cardId: animalId, canAttack };
	await setItem(getBoardPath(gameId), { [`${playerType}`]: updatedSlots });
};

export const addCardsToPlayerDeck = async (
	gameId: string,
	playerType: string,
	cardsIds: string[] = [],
) => {
	const existantCardsIds = await getItemsOnce(getGamePath(gameId) + playerType + '/cardsIds');
	await setItem(getGamePath(gameId) + playerType + '/', {
		cardsIds: [...(existantCardsIds ?? []), ...cardsIds],
	});
};

export const removeCardFromPlayerDeck = async (
	gameId: string,
	playerType: string,
	cardId: string,
) => {
	let cardsIds = await getItemsOnce(getGamePath(gameId) + playerType + '/cardsIds');
	cardsIds = cardsIds.filter((id: string) => id != cardId);
	await setItem(getGamePath(gameId) + playerType, { cardsIds: cardsIds });
};

export const addAnimalToGraveYard = async (gameId: string, animalId: string) => {
	if (!isAnimalCard(animalId)) return;
	const animalGY = (await getItemsOnce(getBoardPath(gameId) + 'animalGY')) ?? [];
	const cardIndex = animalGY.length;
	await setItem(getBoardPath(gameId) + 'animalGY', { [`${cardIndex}`]: animalId });
};

export const addPowerToGraveYard = async (gameId: string, powerId: string) => {
	if (!isPowerCard(powerId)) return;
	const powerGY = (await getItemsOnce(getBoardPath(gameId) + 'powerGY')) ?? [];
	const cardIndex = powerGY.length;
	await setItem(getBoardPath(gameId) + 'powerGY', { [`${cardIndex}`]: powerId });
};

export const removePlayerAnimalFromBoard = async (
	gameId: string,
	playerType: string,
	slotNumber: number,
): Promise<boolean> => {
	const slot = await getItemsOnce(getBoardPath(gameId) + playerType + '/' + slotNumber);
	if (slot) {
		await setItem(getBoardPath(gameId) + playerType, {
			[`${slotNumber}`]: { cardId: EMPTY, canAttack: false },
		});
		return true;
	}
	return false;
};

export const addHpToPlayer = async (gameId: string, playerType: string, hp: number) => {
	const oldHp = await getItemsOnce(getGamePath(gameId) + playerType + '/hp');
	if (!isNil(oldHp)) {
		const newHp = (oldHp ?? 0) + hp;
		await setItem(getGamePath(gameId) + playerType, { hp: newHp });
	}
};

export const removeHpFromPlayer = async (gameId: string, playerType: string, hp: number) => {
	const oldHp = await getItemsOnce(getGamePath(gameId) + playerType + '/hp');
	if (!isNil(oldHp)) {
		const newHp = oldHp - hp;
		await setItem(getGamePath(gameId) + playerType, { hp: newHp });
	}
};

export const addInfoToLog = async (gameId: string, text: string) => {
	await setItem('logs/' + gameId + '/log', {
		[`${new Date().getTime()}`]: {
			action: text,
			time: new Date().toTimeString(),
		},
	});
};

export const changeElementUnitAction = async (gameId: string, elementType: ClanName) => {
	await setItem(getBoardPath(gameId), { elementType });
};

export const getCardFromMainDeck = async (gameId: string): Promise<string> => {
	const mainDeck = (await getItemsOnce(getBoardPath(gameId) + 'mainDeck')) as string[];
	return mainDeck[mainDeck.length - 1];
};

export const removeCardFromMainDeck = async (gameId: string) => {
	const mainDeck = (await getItemsOnce(getBoardPath(gameId) + 'mainDeck')) as string[];
	mainDeck.pop();
	await setItem(getBoardPath(gameId), { mainDeck: mainDeck });
};

export const changeCanAttackVar = async (gameId: string, playerType: string, value: boolean) => {
	await setItem(getGamePath(gameId) + playerType, { canAttack: value });
};

export const changeCanAttackVarOfSlot = async (
	gameId: string,
	playerType: string,
	slotNumber: number,
	value: boolean,
) => {
	await setItem(getBoardPath(gameId) + playerType + '/' + slotNumber, {
		canAttack: value,
	});
};

export const changeUsingPowerCardsVar = async (
	gameId: string,
	playerType: string,
	value: boolean,
) => {
	await setItem(getGamePath(gameId) + playerType, { canPlayPowers: value });
};

export const getPowerCardFromGraveYardByIndex = async (gameId: string, index: number) => {
	let powerGY = await getItemsOnce(getBoardPath(gameId) + 'powerGY');
	return powerGY[index];
};

export const deletePowerCardFromGraveYardById = async (gameId: string, powerId: string) => {
	let powerCardsId = await getItemsOnce(getBoardPath(gameId) + 'powerGY');
	powerCardsId = (powerCardsId ?? []).filter((id: string) => id != powerId);
	await setItem(getBoardPath(gameId), { powerGY: powerCardsId });
};

export const deletePowerCardFromGraveYardByIndex = async (gameId: string, index: number) => {
	let powerCardsId = await getItemsOnce(getBoardPath(gameId) + 'powerGY');
	powerCardsId.splice(index, 1);
	await setItem(getBoardPath(gameId), { powerGY: powerCardsId });
};

export const deleteAnimalCardFromGraveYardById = async (gameId: string, animalId: string) => {
	let animalGY = await getItemsOnce(getBoardPath(gameId) + 'animalGY');
	animalGY = (animalGY ?? []).filter((id: string) => id != animalId);
	await setItem(getBoardPath(gameId), { animalGY: animalGY });
};

export const deleteAnimalCardsFromGraveYardByIds = async (
	gameId: string,
	animalsIds: string[] = [],
) => {
	let animalGY = await getItemsOnce(getBoardPath(gameId) + 'animalGY');
	animalGY = (animalGY ?? []).filter((id: string) => !animalsIds.includes(id));
	await setItem(getBoardPath(gameId), { animalGY: animalGY });
};

export const getAnimalCardFromGraveYardByIndex = async (gameId: string, index: number) => {
	const animalGY = await getItemsOnce(getBoardPath(gameId) + 'animalGY');
	return animalGY[index];
};

export const deleteAnimalCardFromGraveYardByIndex = async (gameId: string, index: number) => {
	const animalGY: string[] = (await getItemsOnce(getBoardPath(gameId) + 'animalGY')) ?? [];
	animalGY.splice(index, 1);
	await setItem(getBoardPath(gameId), { animalGY: animalGY });
};

export const getPLayerHealth = async (gameId: string, playerType: string): Promise<number> => {
	return await getItemsOnce(getGamePath(gameId) + playerType + '/hp');
};

export const changePLayerHealth = async (gameId: string, playerType: string, hp: number) => {
	await setItem(getGamePath(gameId) + playerType, { hp: hp });
};

export const getPLayerCards = async (gameId: string, playerType: string): Promise<string[]> => {
	return (await getItemsOnce(getGamePath(gameId) + playerType + '/cardsIds')) ?? [];
};

export const setPlayerDeck = async (gameId: string, playerType: string, cardsIds: string[]) => {
	await setItem(getGamePath(gameId) + playerType, { cardsIds });
};

export const addOneRound = async (gameId: string, playerType: string) => {
	const round = await getItemsOnce('games/' + gameId + '/round');
	round.player = playerType;
	round.nb += 1;
	await setItem('games/' + gameId + '/round', round);
};
