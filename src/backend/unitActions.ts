import { isEmpty } from 'lodash';
import isNil from 'lodash/isNil';
import { ClanName, EMPTY_SLOT, FINISHED } from '../utils/data';
import {
	getAnimalCard,
	getOpponentIdFromCurrentId,
	isAnimalCard,
	isPowerCard,
} from '../utils/helpers';
import { PlayerType, SlotType } from '../utils/interface';
import { getElementType } from './actions';
import { getBoardPath, getGamePath, getItemsOnce, getPlayerPath, setItem } from './db';

export const setActivePowerCard = async (gameId: string, cardId?: string) => {
	await setItem(getBoardPath(gameId), { activeCardId: cardId });
};

export const checkIfAnimalExistAddItToGraveYard = async (
	gameId: string,
	playerType: PlayerType,
	slotNb: number,
) => {
	const slot = await getItemsOnce(getBoardPath(gameId) + playerType + '/' + slotNb);
	if (isAnimalCard(slot?.cardId)) {
		await addAnimalToGraveYard(gameId, slot.cardId);
	}
};

/* Changed canAttack, testing with true */
export const addAnimalToBoard = async (
	gameId: string,
	playerType: PlayerType,
	slotNb: number,
	animalId: string,
	canAttack: boolean = false,
) => {
	await checkIfAnimalExistAddItToGraveYard(gameId, playerType, slotNb);
	const slots = ((await getItemsOnce(getBoardPath(gameId) + playerType)) ?? []) as SlotType[];
	const updatedSlots = [slots[0] ?? EMPTY_SLOT, slots[1] ?? EMPTY_SLOT, slots[2] ?? EMPTY_SLOT];
	updatedSlots[slotNb] = { cardId: animalId, canAttack: true };
	await setItem(getBoardPath(gameId), { [`${playerType}`]: updatedSlots });
	// 3 Animals in element
	const isDoubleAP = await are3AnimalsWithSameElement(gameId, updatedSlots);
	await setPlayerDoubleAP(gameId, playerType, isDoubleAP);
};

export const setPlayerDoubleAP = async (
	gameId: string,
	playerType: PlayerType,
	isDoubleAP: boolean = false,
) => {
	await setItem(getPlayerPath(gameId, playerType), { isDoubleAP });
};

export const are3AnimalsWithSameElement = async (
	gameId: string,
	slots: SlotType[],
	elementType?: ClanName,
) => {
	let latestElementType = elementType;
	if (!latestElementType) {
		latestElementType = await getElementType(gameId);
	}
	const animal1 = getAnimalCard(slots[0]?.cardId);
	const animal2 = getAnimalCard(slots[1]?.cardId);
	const animal3 = getAnimalCard(slots[2]?.cardId);
	console.log(animal1, animal1, animal3, latestElementType);
	return (
		latestElementType === animal1?.clan &&
		animal2?.clan === latestElementType &&
		animal3?.clan === latestElementType
	);
};

export const addCardsToPlayerDeck = async (
	gameId: string,
	playerType: PlayerType,
	cardsIds: string[] = [],
) => {
	const existantCardsIds = await getItemsOnce(getGamePath(gameId) + playerType + '/cardsIds');
	await setItem(getGamePath(gameId) + playerType + '/', {
		cardsIds: [...(existantCardsIds ?? []), ...cardsIds],
	});
};

export const removeCardFromPlayerDeck = async (
	gameId: string,
	playerType: PlayerType,
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

export const removeAnimalFromBoard = async (
	gameId: string,
	playerType: PlayerType,
	slotNumber: number,
): Promise<boolean> => {
	const slot = await getItemsOnce(getBoardPath(gameId) + playerType + '/' + slotNumber);
	if (slot) {
		await setItem(getBoardPath(gameId) + playerType, {
			[`${slotNumber}`]: EMPTY_SLOT,
		});

		await setPlayerDoubleAP(gameId, playerType, false);

		return true;
	}
	return false;
};

export const addHpToPlayer = async (gameId: string, playerType: PlayerType, hp: number) => {
	const oldHp = await getItemsOnce(getGamePath(gameId) + playerType + '/hp');
	if (!isNil(oldHp)) {
		const newHp = (oldHp ?? 0) + hp;
		await setItem(getGamePath(gameId) + playerType, { hp: newHp });
	}
};

export const removeHpFromPlayer = async (gameId: string, playerType: PlayerType, hp: number) => {
	const oldHp = await getItemsOnce(getGamePath(gameId) + playerType + '/hp');
	if (isNil(oldHp)) {
		return;
	}
	const newHp = oldHp - hp;
	await setItem(getGamePath(gameId) + playerType, { hp: newHp });
	if (newHp > 0) {
		return;
	}
	await setItem(getGamePath(gameId), {
		winner: getOpponentIdFromCurrentId(playerType),
		status: FINISHED,
	});
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

export const getCardFromMainDeck = async (gameId: string): Promise<string | null> => {
	const mainDeck = (await getItemsOnce(getBoardPath(gameId) + 'mainDeck')) as string[];
	if (isEmpty(mainDeck)) return null;

	return mainDeck[mainDeck.length - 1];
};

export const removeCardFromMainDeck = async (gameId: string) => {
	const mainDeck = (await getItemsOnce(getBoardPath(gameId) + 'mainDeck')) as string[];
	mainDeck.pop();
	await setItem(getBoardPath(gameId), { mainDeck: mainDeck });
};

export const changeCanAttackVar = async (
	gameId: string,
	playerType: PlayerType,
	value: boolean,
) => {
	await setItem(getGamePath(gameId) + playerType, { canAttack: value });
};

export const changeCanAttackVarOfSlot = async (
	gameId: string,
	playerType: PlayerType,
	slotNumber: number,
	value: boolean,
) => {
	await setItem(getBoardPath(gameId) + playerType + '/' + slotNumber, {
		canAttack: value,
	});
};

export const changeUsingPowerCardsVar = async (
	gameId: string,
	playerType: PlayerType,
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

export const getPLayerHealth = async (gameId: string, playerType: PlayerType): Promise<number> => {
	return await getItemsOnce(getGamePath(gameId) + playerType + '/hp');
};

export const changePLayerHealth = async (gameId: string, playerType: PlayerType, hp: number) => {
	await setItem(getGamePath(gameId) + playerType, { hp: hp });
};

export const getPLayerCards = async (gameId: string, playerType: PlayerType): Promise<string[]> => {
	return (await getItemsOnce(getGamePath(gameId) + playerType + '/cardsIds')) ?? [];
};

export const getPLayerDoubleAP = async (
	gameId: string,
	playerType: PlayerType,
): Promise<boolean> => {
	return (await getItemsOnce(getPlayerPath(gameId, playerType) + '/isDoubleAP')) ?? false;
};

export const setPlayerDeck = async (gameId: string, playerType: PlayerType, cardsIds: string[]) => {
	await setItem(getGamePath(gameId) + playerType, { cardsIds });
};

export const addOneRound = async (gameId: string, playerType: PlayerType) => {
	const round = await getItemsOnce('games/' + gameId + '/round');
	round.player = playerType;
	round.nb += 1;
	await setItem('games/' + gameId + '/round', round);
};
