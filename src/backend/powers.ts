import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';
import { getOpponentIdFromCurrentId } from '../utils/helpers';
import { drawCardFromMainDeck, setElementLoad } from './actions';

import { getBoardPath, getGamePath, getItemsOnce, setItem } from './db';

import { sampleSize, shuffle } from 'lodash';
import { ClanName, EMPTY, NEUTRAL } from '../utils/data';
import { getPowerCard, isAnimalCard } from '../utils/helpers';
import { PlayerType, SlotType } from '../utils/interface';
import { minus1Hp, minus2Hp } from './animalsAbilities';
import {
	addAnimalToBoard,
	addAnimalToGraveYard,
	addCardsToPlayerDeck,
	addHpToPlayer,
	are3AnimalsWithSameElement,
	changeCanAttackVar,
	changeElementUnitAction,
	changePLayerHealth,
	changeUsingPowerCardsVar,
	deleteAnimalCardFromGraveYardById,
	deleteAnimalCardsFromGraveYardByIds,
	deletePowerCardFromGraveYardById,
	getPLayerCards,
	getPLayerHealth,
	removeAnimalFromBoard,
	removeHpFromPlayer,
	setPlayerDeck,
	setPlayerDoubleAP,
} from './unitActions';

export const stealCardFromOpponent = async (
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

export const stealPowerCardFor2hp = async (
	gameId: string,
	playerType: PlayerType,
	cardId: string,
) => {
	await minus2Hp(gameId, playerType);
	await stealCardFromOpponent(gameId, playerType, cardId);
};

export const cancelAttacks = async (gameId: string, playerType: PlayerType) => {
	await changeCanAttackVar(gameId, playerType, false);
};

export const returnLastPower = async (gameId: string, playerType: PlayerType) => {
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
	await removeAnimalFromBoard(gameId, getOpponentIdFromCurrentId(playerType), oppSlotNb);
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
	const oneHp = await getPLayerHealth(gameId, PlayerType.ONE);
	const twoHp = await getPLayerHealth(gameId, PlayerType.TWO);
	await changePLayerHealth(gameId, PlayerType.ONE, twoHp);
	await changePLayerHealth(gameId, PlayerType.TWO, oneHp);
};

export const switchDeck = async (gameId: string) => {
	const oneCards = await getPLayerCards(gameId, PlayerType.ONE);
	const twoCards = await getPLayerCards(gameId, PlayerType.TWO);
	await setPlayerDeck(gameId, PlayerType.ONE, twoCards);
	await setPlayerDeck(gameId, PlayerType.TWO, oneCards);
};

export const switch2RandomCards = async (gameId: string) => {
	const oneCards = shuffle(await getPLayerCards(gameId, PlayerType.ONE));
	const twoCards = shuffle(await getPLayerCards(gameId, PlayerType.TWO));
	const oneCardFirst = oneCards.shift()!;
	const oneCardSecond = oneCards.shift()!;
	const twoCardFirst = twoCards.shift()!;
	const twoCardSecond = twoCards.shift()!;
	await setPlayerDeck(gameId, PlayerType.ONE, [...oneCards, twoCardFirst, twoCardSecond]);
	await setPlayerDeck(gameId, PlayerType.TWO, [...twoCards, oneCardFirst, oneCardSecond]);
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
	const twoCardsFromOpponentDeck = sampleSize(opponentCards, 2);
	const newPlayerDeck = [
		...playerCards.filter(id => !cardsIds.includes(id) && id !== cardId),
		...twoCardsFromOpponentDeck,
	];
	const newOpponentDeck = [
		...opponentCards.filter(id => !twoCardsFromOpponentDeck.includes(id)),
		...cardsIds,
	];
	await setPlayerDeck(gameId, playerType, newPlayerDeck);
	await setPlayerDeck(gameId, opponentType, newOpponentDeck);
};

export const changeElement = async (
	gameId: string,
	elementType: ClanName,
	playerType: PlayerType,
) => {
	await changeElementUnitAction(gameId, elementType);

	const currSlots = (await getItemsOnce(getBoardPath(gameId) + playerType)) ?? [];
	const isCurrDoubleAP = await are3AnimalsWithSameElement(gameId, currSlots, elementType);
	await setPlayerDoubleAP(gameId, playerType, isCurrDoubleAP);

	const oppPlayerType = getOpponentIdFromCurrentId(playerType);
	const oppSlots = (await getItemsOnce(getBoardPath(gameId) + oppPlayerType)) ?? [];
	const isOppDoubleAP = await are3AnimalsWithSameElement(gameId, oppSlots, elementType);
	await setPlayerDoubleAP(gameId, oppPlayerType, isOppDoubleAP);

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
	const isRemoved = await removeAnimalFromBoard(gameId, playerType, slotNb);
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

export const returnOnePowerFromGYToDeck = async (
	gameId: string,
	playerType: PlayerType,
	powerId?: string,
) => {
	if (!powerId) return;
	await deletePowerCardFromGraveYardById(gameId, powerId);
	await addCardsToPlayerDeck(gameId, playerType, [powerId]);
};

export const resetBoard = async (
	gameId: string,
	playerType: PlayerType,
	currPSlots: SlotType[] = [],
	oppPSlots: SlotType[] = [],
) => {
	for (let i = 0; i < 3; i++) {
		await removeAnimalFromBoard(gameId, playerType, i);
		if (!isEmpty(currPSlots[i]?.cardId) && currPSlots[i]?.cardId !== EMPTY) {
			await addCardsToPlayerDeck(gameId, playerType, [currPSlots[i]?.cardId]);
		}
	}
	for (let i = 0; i < 3; i++) {
		await removeAnimalFromBoard(gameId, getOpponentIdFromCurrentId(playerType), i);
		if (!isEmpty(oppPSlots[i]?.cardId) && oppPSlots[i]?.cardId !== EMPTY) {
			await addCardsToPlayerDeck(gameId, getOpponentIdFromCurrentId(playerType), [
				oppPSlots[i]?.cardId,
			]);
		}
	}
	await changeElement(gameId, NEUTRAL, playerType);
};

export const doubleTanksAP = async (gameId: string, playerType: PlayerType) => {
	await setItem(getGamePath(gameId) + playerType, { tanksWithDoubleAP: true });
};

export const resetBoardMinusHp = async (
	gameId: string,
	playerType: PlayerType,
	currPSlots: SlotType[],
	oppPSlots: SlotType[],
) => {
	await minus1Hp(gameId, playerType);
	await resetBoard(gameId, playerType, currPSlots, oppPSlots);
};

export const blockPowersMinusHp = async (gameId: string, playerType: PlayerType) => {
	await minus1Hp(gameId, playerType);
	await cancelUsingPowerCards(gameId, getOpponentIdFromCurrentId(playerType));
};

export const blockAttacksMinusHp = async (gameId: string, playerType: PlayerType) => {
	await minus1Hp(gameId, playerType);
	await cancelAttacks(gameId, getOpponentIdFromCurrentId(playerType));
};

export const switchDeckMinusHp = async (gameId: string, playerType: PlayerType) => {
	await minus1Hp(gameId, playerType);
	await switchDeck(gameId);
};
