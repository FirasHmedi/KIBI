import { getItemsOnce, getRoomPath, setItem } from './db';
import { Game, SlotType } from './interface';
import { getAnimalCard, getCard, getPowerCard } from './data';
import { isAnimalCard } from './helpers';

export const addSnapShot = async (roomId: string) => {
	try {
		const game: Game = await getItemsOnce(getRoomPath(roomId));
		const { board, one, two, round } = game ?? {};
		const snapshot = {
			[round?.nb]: {
				boards: {
					one: transformBoardCardIdToCardName(board?.one),
					two: transformBoardCardIdToCardName(board?.two),
					animalGY: (board?.animalGY ?? []).map(cardId => getAnimalCard(cardId)?.name ?? 'empty'),
					powerGY: (board?.powerGY ?? []).map(cardId => getPowerCard(cardId)?.name ?? 'empty'),
					env: board?.elementType ?? 'empty',
				},
				playerTurn: round?.player,
				one: {
					hp: one?.hp,
					cards: (one?.cardsIds ?? []).map(cardId => getCard(cardId)?.name ?? 'empty'),
				},
				two: {
					hp: two?.hp,
					cards: (two?.cardsIds ?? []).map(cardId => getCard(cardId)?.name ?? 'empty'),
				},
				time: new Date().toTimeString(),
			},
		};
		await setItem('logs/' + roomId + '/snapShot', snapshot);
	} catch (e) {
		console.error(e);
	}
};
export const transformBoardCardIdToCardName = (slots: SlotType[] = []) => {
	return slots?.map(slot => ({
		cardName: isAnimalCard(slot.cardId) ? getAnimalCard(slot.cardId)?.name : 'empty',
		canAttack: !!slot?.canAttack,
		hasAttacked: !!slot?.hasAttacked,
	}));
};
