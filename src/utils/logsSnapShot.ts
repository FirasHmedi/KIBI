import { getItemsOnce, getRoomPath, setItem } from './db';
import { Game, SlotType } from './interface';
import { getAnimalCard, getCard } from './data';

export const addSnapShot = async (roomId: string) => {
	let game: Game = await getItemsOnce(getRoomPath(roomId));
	await setItem('logs/' + roomId + '/SnapShot', {
		[game?.round?.nb]: {
			boards: {
				one: game?.board?.one ? transformBoardCardIdListToCardNameString(game?.board?.one) : 'empty',
				two: game?.board?.two ? transformBoardCardIdListToCardNameString(game?.board?.two) : 'empty',
				animalsGYId: game?.board?.animalGY ? transformCardIdListCardIdString(game?.board?.animalGY) : 'empty',
				animalsGYName: game?.board?.animalGY ? transformCardIdListCardNameString(game?.board?.animalGY) : 'empty',
				powersGYId: game?.board?.powerGY ? transformCardIdListCardIdString(game?.board?.powerGY) : 'empty',
				powersGYName: game?.board?.powerGY ? transformCardIdListCardNameString(game?.board?.powerGY) : 'empty',
				env: game?.board?.elementType ? game?.board?.elementType : 'empty',
			},
			playerTurn: game?.round?.player,
			one: {
				hp: game?.one?.hp,
				cardsName: game?.one?.cardsIds ? transformCardIdListCardNameString(game?.one?.cardsIds) : 'empty',
				cardsId: game?.one?.cardsIds ? transformCardIdListCardIdString(game?.one?.cardsIds) : 'empty',
			},
			two: {
				hp: game?.two?.hp,
				cardsName: game?.two?.cardsIds ? transformCardIdListCardNameString(game?.two?.cardsIds) : 'empty',
				cardsId: game?.two?.cardsIds ? transformCardIdListCardIdString(game?.two?.cardsIds) : 'empty',
			},
			time: new Date()?.toTimeString(),
		},
	});
};
export const transformBoardCardIdListToCardNameString = (slots: SlotType[] | undefined) => {
	let newFormatSlots = slots?.map(obj => {
		return obj?.cardId == 'empty'
			? 'empty'
			: getAnimalCard(obj?.cardId)?.name + ' | canAttack:' + obj?.canAttack + ' | hasAttacked:' + !!obj?.hasAttacked;
	});
	return newFormatSlots?.join(' // ');
};
export const transformCardIdListCardNameString = (cardsId: string[] | undefined) => {
	let cardsName = cardsId?.map(cardId => getCard(cardId)?.name);
	return cardsName?.join(' , ');
};
export const transformCardIdListCardIdString = (cardsId: string[] | undefined) => {
	return cardsId?.join(' , ');
};
/*

import { getItemsOnce, getRoomPath, setItem } from '?./db';
import { Game, SlotType } from '?./interface';
import { getAnimalCard, getCard, getPowerCard } from '?./data';
import { isAnimalCard } from '?./helpers';

export const addSnapShot = async (roomId: string) => {
	try {
		const game: Game = await getItemsOnce(getRoomPath(roomId));
		const { board, one, two, round } = game ?? {};
		const snapshot = {
			[round?.nb]: {
				boards: {
					one: transformBoardCardIdToCardName(board?.one),
					two: transformBoardCardIdToCardName(board?.two),
					animalGY: (board?.animalGY ?? [])?.map(cardId => getAnimalCard(cardId)?.name ?? 'empty'),
					powerGY: (board?.powerGY ?? [])?.map(cardId => getPowerCard(cardId)?.name ?? 'empty'),
					env: board?.elementType ?? 'empty',
				},
				playerTurn: round?.player,
				one: {
					hp: one?.hp,
					cards: (one?.cardsIds ?? [])?.map(cardId => getCard(cardId)?.name ?? 'empty'),
				},
				two: {
					hp: two?.hp,
					cards: (two?.cardsIds ?? [])?.map(cardId => getCard(cardId)?.name ?? 'empty'),
				},
				time: new Date()?.toTimeString(),
			},
		};
		await setItem('logs/' + roomId + '/snapShot', snapshot);
	} catch (e) {
		console?.error(e);
	}
};
export const transformBoardCardIdToCardName = (slots: SlotType[] = []) => {
	return slots?.map(slot => ({
		cardName: isAnimalCard(slot?.cardId) ? getAnimalCard(slot?.cardId)?.name : 'empty',
		canAttack: !!slot?.canAttack,
		hasAttacked: !!slot?.hasAttacked,
	}));
};
 */
