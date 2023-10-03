// ******************************animal abilities**********************************************
// ----------------------king------------------
import _ from 'lodash';
import { drawCardFromMainDeck, setPowerCardAsActive } from './actions';
import { getBoardPath, getItemsOnce, getGamePath } from './db';
import {
	addAnimalToGraveYard,
	addCardsToPlayerDeck,
	addHpToPlayer,
	addPowerToGraveYard,
	deleteAnimalCardFromGraveYardById,
	deletePowerCardFromGraveYardById,
	removeCardFromPlayerDeck,
	removeHpFromPlayer,
	removePlayerAnimalFromBoard,
} from './unitActions';
import { getOpponentIdFromCurrentId, isAnimalCard, isPowerCard } from '../utils/helpers';
import { PlayerType } from '../utils/interface';

export const returnAnimalToDeck = async (gameId: string, playerType: string, animalId: string) => {
	await addCardsToPlayerDeck(gameId, playerType, [animalId]);
	await deleteAnimalCardFromGraveYardById(gameId, animalId);
};

// ----------------------attacker--------------------
export const removePlayerAnimalFromBoardAndAddToGraveYard = async (
	gameId: string,
	playerType: string,
	slotNumber: number,
	animalId: string,
) => {
	await removePlayerAnimalFromBoard(gameId, playerType, slotNumber);
	await addAnimalToGraveYard(gameId, animalId);
};
// ----------------------tank-----------------------
export const returnTankToDeck = returnAnimalToDeck;
// ----------------------Snake -----------------------
export const add1Hp = async (gameId: string, playerType: string) => {
	await addHpToPlayer(gameId, playerType, 1);
};
// ----------------------jellyfish-----------------------
export const drawOneCard = async (gameId: string, playerType: string) => {
	await drawCardFromMainDeck(gameId, playerType);
};

export const minus1Hp = async (gameId: string, playerType: string) => {
	await removeHpFromPlayer(gameId, playerType, 1);
};

// tank
export const add2Hp = async (gameId: string, playerType: string) => {
	await addHpToPlayer(gameId, playerType, 2);
};
// attacker
export const minus2Hp = async (gameId: string, playerType: string) => {
	await removeHpFromPlayer(gameId, playerType, 2);
};

// ----------------------Snake-----------------------
export const sendRandomOpponentCardToGY = async (gameId: string, playerType: PlayerType) => {
	const cardsIds = await getItemsOnce(getGamePath(gameId) + getOpponentIdFromCurrentId(playerType) + '/cardsIds');
	const cardId = cardsIds[getRandomNumber(cardsIds.length)];

	if (isAnimalCard(cardId)) {
		await removeCardFromPlayerDeck(gameId, getOpponentIdFromCurrentId(playerType), cardId);
		await addAnimalToGraveYard(gameId, cardId);
	} else if (isPowerCard(cardId)) {
		await setPowerCardAsActive(gameId, getOpponentIdFromCurrentId(playerType), cardId);
		await addPowerToGraveYard(gameId, cardId);
	}
};
// ----------------------Fox-----------------------
export const returnRandomPowerCardToDeck = async (gameId: string, playerType: string) => {
	const powerGY = await getItemsOnce(getBoardPath(gameId) + 'powerGY');
	if (!_.isEmpty(powerGY)) {
		const cardId = powerGY[getRandomNumber(powerGY.length)];
		await deletePowerCardFromGraveYardById(gameId, cardId);
		await addCardsToPlayerDeck(gameId, playerType, [cardId]);
	}
};
// ----------------------Crow-----------------------
export const returnRandomAnimalCardToDeck = async (gameId: string, playerType: string) => {
	const animalGY = await getItemsOnce(getBoardPath(gameId) + 'animalGY');
	if (!_.isEmpty(animalGY)) {
		const cardId = animalGY[getRandomNumber(animalGY.length)];
		await deleteAnimalCardFromGraveYardById(gameId, cardId);
		await addCardsToPlayerDeck(gameId, playerType, [cardId]);
	}
};
function getRandomNumber(max: number) {
	return Math.floor(Math.random() * max);
}
