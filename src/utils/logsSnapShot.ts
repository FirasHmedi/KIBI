import { getItemsOnce, getRoomPath, setItem } from './db';
import { Game, SlotType } from './interface';
import { getAnimalCard, getCard, getPowerCard } from './data';
import { isAnimalCard } from './helpers';

export const addSnapShot = async (roomId: string) => {
	try {
		const game: Game = await getItemsOnce(getRoomPath(roomId));
		const { board, one, two, round } = game ?? {};
		await setItem('logs/' + roomId + '/snapShot', {
			[round?.nb]: {
				boards: {
					one: transformBoardCardIdToCardName(board?.one),
					two: transformBoardCardIdToCardName(board?.two),
					animalGY: (board?.animalGY ?? []).map(cardId => getAnimalCard(cardId)?.name),
					powerGY: (board?.powerGY ?? []).map(cardId => getPowerCard(cardId)?.name),
					env: board?.envType ?? 'empty',
				},
				playerTurn: round?.player,
				one: {
					hp: one?.hp,
					cards: (one?.cardsIds ?? []).map(cardId => getCard(cardId)?.name),
				},
				two: {
					hp: two?.hp,
					cards: (two?.cardsIds ?? []).map(cardId => getCard(cardId)?.name),
				},
				time: new Date().toTimeString(),
			},
		});
	} catch (e) {
		console.error(e);
	}
};
export const transformBoardCardIdToCardName = (slots: SlotType[] = []) => {
	return slots?.map(slot => ({
		cardName: isAnimalCard(slot.cardId) ? getAnimalCard(slot.cardId)?.name : 'empty',
		canAttack: slot?.canAttack,
		hasAttacked: !!slot?.hasAttacked,
	}));
};
