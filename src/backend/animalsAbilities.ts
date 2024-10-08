import isEmpty from 'lodash/isEmpty';
import { getOpponentIdFromCurrentId, isAnimalCard, isPowerCard } from '../utils/helpers';
import { PlayerType } from '../utils/interface';
import { drawCardFromMainDeck, setPowerCardAsActive } from './actions';
import { getBoardPath, getGamePath, getItemsOnce } from './db';
import {
	addAnimalToGraveYard,
	addCardsToPlayerDeck,
	addHpToPlayer,
	addPowerToGraveYard,
	deleteAnimalCardFromGraveYardById,
	deletePowerCardFromGraveYardById,
	removeAnimalFromBoard,
	removeCardFromPlayerDeck,
	removeHpFromPlayer,
} from './unitActions';

export const returnAnimalToDeck = async (
	gameId: string,
	playerType: PlayerType,
	animalId: string,
) => {
	await addCardsToPlayerDeck(gameId, playerType, [animalId]);
	await deleteAnimalCardFromGraveYardById(gameId, animalId);
};

// ----------------------attacker--------------------
export const removeAnimalFromBoardAndAddToGraveYard = async (
	gameId: string,
	playerType: PlayerType,
	slotNumber: number,
	animalId: string,
) => {
	await removeAnimalFromBoard(gameId, playerType, slotNumber);
	await addAnimalToGraveYard(gameId, animalId);
};
// ----------------------tank-----------------------
export const returnTankToDeck = returnAnimalToDeck;
// ----------------------Snake -----------------------
export const add1Hp = async (gameId: string, playerType: PlayerType) => {
	await addHpToPlayer(gameId, playerType, 1);
};
// ----------------------jellyfish-----------------------
export const drawOneCard = async (gameId: string, playerType: PlayerType) => {
	await drawCardFromMainDeck(gameId, playerType);
};

export const minus1Hp = async (gameId: string, playerType: PlayerType) => {
	await removeHpFromPlayer(gameId, playerType, 1);
};

// tank
export const add2Hp = async (gameId: string, playerType: PlayerType) => {
	await addHpToPlayer(gameId, playerType, 2);
};
// attacker
export const minus2Hp = async (gameId: string, playerType: PlayerType) => {
	await removeHpFromPlayer(gameId, playerType, 2);
};

// ----------------------Snake-----------------------
export const sendRandomOpponentCardToGY = async (gameId: string, playerType: PlayerType) => {
	const cardsIds = await getItemsOnce(
		getGamePath(gameId) + getOpponentIdFromCurrentId(playerType) + '/cardsIds',
	);
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
export const returnRandomPowerCardToDeck = async (gameId: string, playerType: PlayerType) => {
	const powerGY = await getItemsOnce(getBoardPath(gameId) + 'powerGY');
	if (!isEmpty(powerGY)) {
		const cardId = powerGY[getRandomNumber(powerGY.length)];
		await deletePowerCardFromGraveYardById(gameId, cardId);
		await addCardsToPlayerDeck(gameId, playerType, [cardId]);
	}
};
// ----------------------Crow-----------------------
export const returnRandomAnimalCardToDeck = async (gameId: string, playerType: PlayerType) => {
	const animalGY = await getItemsOnce(getBoardPath(gameId) + 'animalGY');
	if (!isEmpty(animalGY)) {
		const cardId = animalGY[getRandomNumber(animalGY.length)];
		await deleteAnimalCardFromGraveYardById(gameId, cardId);
		await addCardsToPlayerDeck(gameId, playerType, [cardId]);
	}
};
function getRandomNumber(max: number) {
	return Math.floor(Math.random() * max);
}
