import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';
import { getOpponentIdFromCurrentId } from '../utils/helpers';
import { drawCardFromMainDeck, setElementLoad } from './actions';

import { getBoardPath, getGamePath, getItemsOnce, setItem } from './db';

import { sampleSize, shuffle } from 'lodash';
import { ClanName, EMPTY, NEUTRAL } from '../utils/data';
import { getPowerCard, isAnimalCard } from '../utils/helpers';
import { PlayerType, SlotType } from '../utils/interface';
import {
	addAnimalToBoard,
	addAnimalToGraveYard,
	addCardsToPlayerDeck,
	addHpToPlayer,
	changeCanAttackVar,
	changeElementUnitAction,
	changePLayerHealth,
	changeUsingPowerCardsVar,
	deleteAnimalCardFromGraveYardById,
	deleteAnimalCardsFromGraveYardByIds,
	deletePowerCardFromGraveYardById,
	getPLayerCards,
	getPLayerHealth,
	removeHpFromPlayer,
	removePlayerAnimalFromBoard,
	setPlayerDeck,
} from './unitActions';

export const stealPowerCardFor2hp = async (
	gameId: string,
	playerType: PlayerType,
	cardId: string,
) => {
	const opponentType = getOpponentIdFromCurrentId(playerType);
	const opponentCards: string[] = (await getPLayerCards(gameId, opponentType)) ?? [];
	const playerCards: string[] = (await getPLayerCards(gameId, playerType)) ?? [];
	await setPlayerDeck(
		gameId,
		opponentType,
		opponentCards.filter(id => id !== cardId),
	);
	await setPlayerDeck(gameId, playerType, [...playerCards, cardId]);
};

export const cancelAttacks = async (gameId: string, playerType: PlayerType) => {
	await changeCanAttackVar(gameId, playerType, false);
};

export const reviveLastPower = async (gameId: string, playerType: PlayerType) => {
	const powerGY: string[] = await getItemsOnce(getBoardPath(gameId) + 'powerGY');
	if (!isEmpty(powerGY)) {
		const lastPowerCardId = powerGY[powerGY.length - 1];
		await deletePowerCardFromGraveYardById(gameId, lastPowerCardId);
		await addCardsToPlayerDeck(gameId, playerType, [lastPowerCardId]);
	}
};

export const reviveAnyPowerFor1hp = async (
	gameId: string,
	playerType: PlayerType,
	cardId: string,
) => {
	if (!getPowerCard(cardId)) {
		return;
	}
	const powerGY: string[] = await getItemsOnce(getBoardPath(gameId) + 'powerGY');
	if (!isEmpty(powerGY) && powerGY.includes(cardId)) {
		await removeHpFromPlayer(gameId, playerType, 1);
		await deletePowerCardFromGraveYardById(gameId, cardId);
		await addCardsToPlayerDeck(gameId, playerType, [cardId]);
	}
};

export const sacrifice1HpToReviveAnyAnimal = async (
	gameId: string,
	playerType: PlayerType,
	animalId?: string,
	slotNb?: number,
) => {
	if (!isAnimalCard(animalId) || isNil(slotNb)) return;
	await removeHpFromPlayer(gameId, playerType, 1);
	await deleteAnimalCardFromGraveYardById(gameId, animalId!);
	await addAnimalToBoard(gameId, playerType, slotNb, animalId!, true);
};

export const sacrifice3HpToSteal = async (
	gameId: string,
	playerType: PlayerType,
	animalId: string,
	oppSlotNb: number,
	mySlotNb: number,
) => {
	if (!animalId || isNil(mySlotNb) || isNil(oppSlotNb)) return;
	await removeHpFromPlayer(gameId, playerType, 3);
	await removePlayerAnimalFromBoard(gameId, getOpponentIdFromCurrentId(playerType), oppSlotNb);
	await addAnimalToBoard(gameId, playerType, mySlotNb, animalId, true);
};

export const sacrifice1HpToReviveLastAnimal = async (
	gameId: string,
	playerType: PlayerType,
	slotNb?: number,
) => {
	if (isNil(slotNb) || !playerType) return;
	await removeHpFromPlayer(gameId, playerType, 1);

	const animalGY = await getItemsOnce(getBoardPath(gameId) + 'animalGY');
	if (!isEmpty(animalGY)) {
		const lastAnimalCardId = animalGY[animalGY.length - 1];
		await deleteAnimalCardFromGraveYardById(gameId, lastAnimalCardId);
		await addAnimalToBoard(gameId, playerType, slotNb, lastAnimalCardId, true);
	}
};

export const switchHealth = async (gameId: string) => {
	const oneHp = await getPLayerHealth(gameId, 'one');
	const twoHp = await getPLayerHealth(gameId, 'two');
	await changePLayerHealth(gameId, 'one', twoHp);
	await changePLayerHealth(gameId, 'two', oneHp);
};

export const switchDeck = async (gameId: string) => {
	const oneCards = await getPLayerCards(gameId, 'one');
	const twoCards = await getPLayerCards(gameId, 'two');
	await setPlayerDeck(gameId, 'one', twoCards);
	await setPlayerDeck(gameId, 'two', oneCards);
};

export const switch2RandomCards = async (gameId: string) => {
	const oneCards = shuffle(await getPLayerCards(gameId, 'one'));
	const twoCards = shuffle(await getPLayerCards(gameId, 'two'));
	const oneCardFirst = oneCards.shift()!;
	const oneCardSecond = oneCards.shift()!;
	const twoCardFirst = twoCards.shift()!;
	const twoCardSecond = twoCards.shift()!;
	await setPlayerDeck(gameId, 'one', [...oneCards, twoCardFirst, twoCardSecond]);
	await setPlayerDeck(gameId, 'two', [...twoCards, oneCardFirst, oneCardSecond]);
};

export const switch2Cards = async (
	gameId: string,
	playerType: PlayerType,
	cardId: string,
	cardsIds: string[],
) => {
	const opponentType = getOpponentIdFromCurrentId(playerType);
	const opponentCards = await getPLayerCards(gameId, opponentType);
	const playerCards = await getPLayerCards(gameId, playerType);
	const twoCardsFromPlayerDeck = sampleSize(playerCards, 2);
	const newPlayerDeck = [
		...playerCards.filter(id => !cardsIds.includes(id) || id !== cardId),
		...twoCardsFromPlayerDeck,
	];
	const newOpponentDeck = [
		...opponentCards.filter(id => !twoCardsFromPlayerDeck.includes(id)),
		...cardsIds,
	];
	await setPlayerDeck(gameId, playerType, newPlayerDeck);
	await setPlayerDeck(gameId, opponentType, newOpponentDeck);
};

export const changeElement = async (
	gameId: string,
	elementType: ClanName,
	playerType?: PlayerType,
) => {
	await changeElementUnitAction(gameId, elementType);
	if (playerType) {
		setElementLoad(gameId, playerType, 0);
	}
};

export const sacrificeAnimalToGet3Hp = async (
	gameId: string,
	playerType: PlayerType,
	animalId?: string,
	slotNb?: number,
	elementType?: string,
) => {
	if (!animalId || isNil(slotNb)) return;
	const isRemoved = await removePlayerAnimalFromBoard(gameId, playerType, slotNb);
	if (isRemoved) {
		await addAnimalToGraveYard(gameId, animalId);
		await addHpToPlayer(gameId, playerType, 3);
	}
};

export const shieldOwnerPlus2Hp = async (gameId: string, playerType: PlayerType) => {
	await addHpToPlayer(gameId, playerType, 2);
};

export const shieldOwnerPlus3Hp = async (gameId: string, playerType: PlayerType) => {
	await addHpToPlayer(gameId, playerType, 3);
};

export const draw2Cards = async (gameId: string, playerType: PlayerType) => {
	await drawCardFromMainDeck(gameId, playerType);
	await drawCardFromMainDeck(gameId, playerType);
};

export const return2animalsFromGYToDeck = async (
	gameId: string,
	playerType: PlayerType,
	animalsIds: string[] = [],
) => {
	if (animalsIds.length != 2) return;
	await deleteAnimalCardsFromGraveYardByIds(gameId, animalsIds);
	await addCardsToPlayerDeck(gameId, playerType, animalsIds);
};

export const cancelUsingPowerCards = async (gameId: string, playerType: PlayerType) => {
	await changeUsingPowerCardsVar(gameId, playerType, false);
};

export const returnOneAnimalFromGYToDeck = async (
	gameId: string,
	playerType: PlayerType,
	animalId?: string,
) => {
	if (!animalId) return;
	await deleteAnimalCardFromGraveYardById(gameId, animalId);
	await addCardsToPlayerDeck(gameId, playerType, [animalId]);
};

export const resetBoard = async (
	gameId: string,
	playerType: PlayerType,
	currentPSlots: SlotType[] = [],
	opponentPSlots: SlotType[] = [],
) => {
	for (let i = 0; i < 3; i++) {
		await removePlayerAnimalFromBoard(gameId, playerType, i);
		if (!isEmpty(currentPSlots[i]?.cardId) && currentPSlots[i]?.cardId !== EMPTY) {
			await addCardsToPlayerDeck(gameId, playerType, [currentPSlots[i]?.cardId]);
		}
	}
	for (let i = 0; i < 3; i++) {
		await removePlayerAnimalFromBoard(gameId, getOpponentIdFromCurrentId(playerType), i);
		if (!isEmpty(opponentPSlots[i]?.cardId) && opponentPSlots[i]?.cardId !== EMPTY) {
			await addCardsToPlayerDeck(gameId, getOpponentIdFromCurrentId(playerType), [
				opponentPSlots[i]?.cardId,
			]);
		}
	}
	await changeElement(gameId, NEUTRAL);
};

export const doubleTankAP = async (
	gameId: string,
	playerType: PlayerType,
	tankIdWithDoubleAP: string,
) => {
	await setItem(getGamePath(gameId) + playerType, { tankIdWithDoubleAP });
};
