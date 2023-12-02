import {getItemsOnce} from '../backend/db';
import {NEUTRAL} from '../utils/data';

export const getBotSlots = async (gameId: string) => {
	return await getItemsOnce('/games/' + gameId + '/board/two');
};

export const getPlayerSlots = async (gameId: string) => {
	return await getItemsOnce('/games/' + gameId + '/board/one');
};

export const getRoundNb = async (gameId: string) => {
	return await getItemsOnce('/games/' + gameId + '/round/nb');
};
export const getBotDeck = async (gameId: string) => {
	return await getItemsOnce('/games/' + gameId + '/two/cardsIds');
};

export const getPlayerDeck = async (gameId: string) => {
	return await getItemsOnce('/games/' + gameId + '/one/cardsIds');
};

export const getElementFromDb = async (gameId: string) => {
	let element = await getItemsOnce('/games/' + gameId + '/board/elementType');
	return element ?? NEUTRAL;
};
