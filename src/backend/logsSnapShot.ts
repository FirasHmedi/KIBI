import { getAnimalCard, getCard } from '../utils/helpers';
import { Game, SlotType } from '../utils/interface';
import { getGamePath, getItemsOnce, setItem } from './db';

export const addSnapShot = async (gameId: string) => {
	let game: Game = await getItemsOnce(getGamePath(gameId));
	await setItem('logs/' + gameId + '/SnapShot', {
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
