// ******************************animal abilities**********************************************
// ----------------------king------------------
import _ from 'lodash';
import { drawCardFromMainDeck, setPowerCardAsActive } from './actions';
import { getBoardPath, getItemsOnce, getRoomPath } from './db';
import {
	addAnimalToGraveYard,
	addCardsToPlayerDeck,
	addHpToPlayer,
	addPowerToGraveYard,
	deleteAnimalCardFromGraveYardById,
	deletePowerCardFromGraveYardById,
	removeHpFromPlayer,
	removePlayerAnimalFromBoard,
} from './unitActions';
import { getOpponentIdFromCurrentId } from './helpers';
import { PlayerType } from './interface';

export const returnAnimalToDeck = async (roomId: string, playerType: string, animalId: string) => {
	await addCardsToPlayerDeck(roomId, playerType, [animalId]);
	await deleteAnimalCardFromGraveYardById(roomId, animalId);
};

// ----------------------attacker--------------------
export const removePlayerAnimalFromBoardAndAddToGraveYard = async (
	roomId: string,
	playerType: string,
	slotNumber: number,
	animalId: string,
) => {
	await removePlayerAnimalFromBoard(roomId, playerType, slotNumber);
	await addAnimalToGraveYard(roomId, animalId);
};
// ----------------------tank-----------------------
export const returnTankToDeck = returnAnimalToDeck;
// ----------------------Snake -----------------------
export const add1Hp = async (roomId: string, playerType: string) => {
	await addHpToPlayer(roomId, playerType, 1);
};
// ----------------------jellyfish-----------------------
export const drawOneCard = async (roomId: string, playerType: string) => {
	await drawCardFromMainDeck(roomId, playerType);
};

export const minus1Hp = async (roomId: string, playerType: string) => {
	await removeHpFromPlayer(roomId, playerType, 1);
};

// tank
export const add2Hp = async (roomId: string, playerType: string) => {
	await addHpToPlayer(roomId, playerType, 2);
};
// attacker
export const minus2Hp = async (roomId: string, playerType: string) => {
	await removeHpFromPlayer(roomId, playerType, 2);
};

// ----------------------Snake-----------------------
export const sendRandomOpponentCardToGY = async (roomId: string, playerType: PlayerType) => {
	const cardsIds = await getItemsOnce(getRoomPath(roomId) + playerType + '/cardsIds');
	const cardId = cardsIds[getRandomNumber(cardsIds.length)];
	await setPowerCardAsActive(roomId, getOpponentIdFromCurrentId(playerType), cardId);
	addPowerToGraveYard(roomId, cardId);
};
// ----------------------Fox-----------------------
export const returnRandomPowerCardToDeck = async (roomId: string, playerType: string) => {
	const powerGY = await getItemsOnce(getBoardPath(roomId) + 'powerGY');
	if (!_.isEmpty(powerGY)) {
		const cardId = powerGY[getRandomNumber(powerGY.length)];
		await deletePowerCardFromGraveYardById(roomId, cardId);
		await addCardsToPlayerDeck(roomId, playerType, [cardId]);
	}
};
// ----------------------Crow-----------------------
export const returnRandomAnimalCardToDeck = async (roomId: string, playerType: string) => {
	const animalGY = await getItemsOnce(getBoardPath(roomId) + 'animalGY');
	if (!_.isEmpty(animalGY)) {
		const cardId = animalGY[getRandomNumber(animalGY.length)];
		await deleteAnimalCardFromGraveYardById(roomId, cardId);
		await addCardsToPlayerDeck(roomId, playerType, [cardId]);
	}
};
function getRandomNumber(max: number) {
	return Math.floor(Math.random() * max);
}
