import { getItemsOnce, getRoomPath, setItem } from './db';
import { Game, SlotType } from './interface';
import { getAnimalCard, getCard, getPowerCard } from './data';

export const addSnapShot = async (roomId: string) => {
	let game: Game = await getItemsOnce(getRoomPath(roomId));
	await setItem('logs/' + roomId + '/SnapShot', {
		[game.round.nb]: {
			boards: {
				one: game.board.one ? transformBoardCardIdToCardName(game.board.one) : [],
				two: game.board.two ? transformBoardCardIdToCardName(game.board.two) : [],
				animalGY: game.board.animalGY ? game.board.animalGY.map(cardId => getAnimalCard(cardId)?.name) : [],
				powerGY: game.board.powerGY ? game.board.powerGY.map(cardId => getPowerCard(cardId)?.name) : [],
				env: game.board.envType ? game.board.envType : 'empty',
			},
			playerTurn: game.round.player,
			one: {
				hp: game.one.hp,
				cards: game.one.cardsIds ? game.one.cardsIds.map(cardId => getCard(cardId)?.name) : [],
			},
			two: {
				hp: game.two.hp,
				cards: game.two.cardsIds ? game.two.cardsIds.map(cardId => getCard(cardId)?.name) : [],
			},
			time: new Date().toTimeString(),
		},
	});
};
export const transformBoardCardIdToCardName = (slots: SlotType[] | undefined) => {
	return slots?.map(obj => {
		return {
			cardName: obj.cardId == 'empty' ? obj.cardId : getAnimalCard(obj.cardId)?.name,
			canAttack: obj.canAttack,
			hasAttacked: !!obj.hasAttacked,
		};
	});
};
