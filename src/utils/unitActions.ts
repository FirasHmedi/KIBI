import _ from 'lodash';
import { ClanName } from './data';
import { getBoardPath, getItemsOnce, getRoomPath, setItem } from './db';
import { isAnimalCard, isPowerCard } from './helpers';

export const setActivePowerCard = async (roomId: string, cardId?: string) => {
	await setItem(getBoardPath(roomId), { activeCardId: cardId });
};

export const checkIfAnimalExistAddItToGraveYard = async (roomId: string, playerType: string, slotNb: number) => {
	const slot = await getItemsOnce(getBoardPath(roomId) + playerType + '/' + slotNb);
	if (slot && isAnimalCard(slot.cardId)) {
		await addAnimalToGraveYard(roomId, slot.cardId);
	}
};

export const addAnimalToBoard = async (
	roomId: string,
	playerType: string,
	slotNb: number,
	animalId: string,
	canAttack: boolean = false,
) => {
	await checkIfAnimalExistAddItToGraveYard(roomId, playerType, slotNb);
	const slots = (await getItemsOnce(getBoardPath(roomId) + playerType)) ?? [];
	const updatedSlots = [
		slots[0] ?? { cardId: 'empty', canAttack: false },
		slots[1] ?? { cardId: 'empty', canAttack: false },
		slots[2] ?? { cardId: 'empty', canAttack: false },
	];
	updatedSlots[slotNb] = { cardId: animalId, canAttack };
	await setItem(getBoardPath(roomId), { [`${playerType}`]: updatedSlots });
};

export const addCardsToPlayerDeck = async (roomId: string, playerType: string, cardsIds: string[] = []) => {
	const existantCardsIds = await getItemsOnce(getRoomPath(roomId) + playerType + '/cardsIds');
	await setItem(getRoomPath(roomId) + playerType + '/', {
		cardsIds: [...(existantCardsIds ?? []), ...cardsIds],
	});
};

export const removeCardFromPlayerDeck = async (roomId: string, playerType: string, cardId: string) => {
	let cardsIds = await getItemsOnce(getRoomPath(roomId) + playerType + '/cardsIds');
	cardsIds = cardsIds.filter((id: string) => id != cardId);
	await setItem(getRoomPath(roomId) + playerType, { cardsIds: cardsIds });
};

export const addAnimalToGraveYard = async (roomId: string, animalId: string) => {
	if (!isAnimalCard(animalId)) return;
	const animalGY = await getItemsOnce(getBoardPath(roomId) + 'animalGY');
	const index = !!animalGY ? animalGY.length : 0;
	await setItem(getBoardPath(roomId) + 'animalGY', { [`${index}`]: animalId });
};

export const addPowerToGraveYard = async (roomId: string, powerId: string) => {
	if (!isPowerCard(powerId)) return;
	const powerGY = await getItemsOnce(getBoardPath(roomId) + 'powerGY');
	const index = powerGY ? powerGY.length : 0;
	await setItem(getBoardPath(roomId) + 'powerGY', { [`${index}`]: powerId });
};

export const removePlayerAnimalFromBoard = async (
	roomId: string,
	playerType: string,
	slotNumber: number,
): Promise<boolean> => {
	const slot = await getItemsOnce(getBoardPath(roomId) + playerType + '/' + slotNumber);
	if (slot) {
		await setItem(getBoardPath(roomId) + playerType, {
			[`${slotNumber}`]: { cardId: 'empty', canAttack: false },
		});
		return true;
	}
	return false;
};

export const addHpToPlayer = async (roomId: string, playerType: string, hp: number) => {
	const oldHp = await getItemsOnce(getRoomPath(roomId) + playerType + '/hp');
	if (!_.isNil(oldHp)) {
		const newHp = (oldHp ?? 0) + hp;
		await setItem(getRoomPath(roomId) + playerType, { hp: newHp });
	}
};

export const removeHpFromPlayer = async (roomId: string, playerType: string, hp: number) => {
	const oldHp = await getItemsOnce(getRoomPath(roomId) + playerType + '/hp');
	if (!_.isNil(oldHp)) {
		const newHp = oldHp - hp;
		await setItem(getRoomPath(roomId) + playerType, { hp: newHp });
	}
};

export const addInfoToLog = async (roomId: string, text: string) => {
	await setItem('logs/' + roomId + '/log', {
		[`${new Date().getTime()}`]: {
			action: text,
			time: new Date().toTimeString(),
		},
	});
};

export const changeElementUnitAction = async (roomId: string, elementType: ClanName) => {
	await setItem(getBoardPath(roomId), { elementType });
};

export const getCardFromMainDeck = async (roomId: string): Promise<string> => {
	const mainDeck = (await getItemsOnce(getBoardPath(roomId) + 'mainDeck')) as string[];
	return mainDeck[mainDeck.length - 1];
};

export const removeCardFromMainDeck = async (roomId: string) => {
	const mainDeck = (await getItemsOnce(getBoardPath(roomId) + 'mainDeck')) as string[];
	mainDeck.pop();
	await setItem(getBoardPath(roomId), { mainDeck: mainDeck });
};

export const changeCanAttackVar = async (roomId: string, playerType: string, value: boolean) => {
	await setItem(getRoomPath(roomId) + playerType, { canAttack: value });
};

export const changeCanAttackVarOfSlot = async (
	roomId: string,
	playerType: string,
	slotNumber: number,
	value: boolean,
) => {
	await setItem(getBoardPath(roomId) + playerType + '/' + slotNumber, {
		canAttack: value,
	});
};

export const changeUsingPowerCardsVar = async (roomId: string, playerType: string, value: boolean) => {
	await setItem(getRoomPath(roomId) + playerType, { canPlayPowers: value });
};

export const getPowerCardFromGraveYardByIndex = async (roomId: string, index: number) => {
	let powerGY = await getItemsOnce(getBoardPath(roomId) + 'powerGY');
	return powerGY[index];
};

export const deletePowerCardFromGraveYardById = async (roomId: string, powerId: string) => {
	let powerCardsId = await getItemsOnce(getBoardPath(roomId) + 'powerGY');
	powerCardsId = (powerCardsId ?? []).filter((id: string) => id != powerId);
	await setItem(getBoardPath(roomId), { powerGY: powerCardsId });
};

export const deletePowerCardFromGraveYardByIndex = async (roomId: string, index: number) => {
	let powerCardsId = await getItemsOnce(getBoardPath(roomId) + 'powerGY');
	powerCardsId.splice(index, 1);
	await setItem(getBoardPath(roomId), { powerGY: powerCardsId });
};

export const deleteAnimalCardFromGraveYardById = async (roomId: string, animalId: string) => {
	let animalGY = await getItemsOnce(getBoardPath(roomId) + 'animalGY');
	animalGY = (animalGY ?? []).filter((id: string) => id != animalId);
	await setItem(getBoardPath(roomId), { animalGY: animalGY });
};

export const deleteAnimalCardsFromGraveYardByIds = async (roomId: string, animalsIds: string[] = []) => {
	let animalGY = await getItemsOnce(getBoardPath(roomId) + 'animalGY');
	animalGY = (animalGY ?? []).filter((id: string) => !animalsIds.includes(id));
	await setItem(getBoardPath(roomId), { animalGY: animalGY });
};

export const getAnimalCardFromGraveYardByIndex = async (roomId: string, index: number) => {
	const animalGY = await getItemsOnce(getBoardPath(roomId) + 'animalGY');
	return animalGY[index];
};

export const deleteAnimalCardFromGraveYardByIndex = async (roomId: string, index: number) => {
	const animalGY: string[] = (await getItemsOnce(getBoardPath(roomId) + 'animalGY')) ?? [];
	animalGY.splice(index, 1);
	await setItem(getBoardPath(roomId), { animalGY: animalGY });
};

export const getPLayerHealth = async (roomId: string, playerType: string) => {
	return await getItemsOnce(getRoomPath(roomId) + playerType + '/hp');
};

export const changePLayerHealth = async (roomId: string, playerType: string, hp: number) => {
	await setItem(getRoomPath(roomId) + playerType, { hp: hp });
};

export const getPLayerCards = async (roomId: string, playerType: string) => {
	return await getItemsOnce(getRoomPath(roomId) + playerType + '/cardsIds');
};

export const changePLayerCards = async (roomId: string, playerType: string, cards: string[]) => {
	await setItem(getRoomPath(roomId) + playerType, { cardsIds: cards });
};

export const addOneRound = async (roomId: string, playerType: string) => {
	const round = await getItemsOnce('rooms/' + roomId + '/round');
	round.player = playerType;
	round.nb += 1;
	await setItem('rooms/' + roomId + '/round', round);
};
