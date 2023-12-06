import { EMPTY } from '../utils/data';
import { getAnimalCard, getCard } from '../utils/helpers';
import { Game, SlotType } from '../utils/interface';
import { getGamePath, getItemsOnce, setItem } from './db';

export const addSnapShot = async (gameId: string) => {
	let game: Game = await getItemsOnce(getGamePath(gameId));
	await setItem('logs/' + gameId + '/SnapShot', {
		[game?.round?.nb]: {
			boards: {
				one: game?.board?.one ? transformBoardCardIdListToCardNameString(game?.board?.one) : EMPTY,
				two: game?.board?.two ? transformBoardCardIdListToCardNameString(game?.board?.two) : EMPTY,
				animalsGYId: game?.board?.animalGY
					? transformCardIdListCardIdString(game?.board?.animalGY)
					: EMPTY,
				animalsGYName: game?.board?.animalGY
					? transformCardIdListCardNameString(game?.board?.animalGY)
					: EMPTY,
				powersGYId: game?.board?.powerGY
					? transformCardIdListCardIdString(game?.board?.powerGY)
					: EMPTY,
				powersGYName: game?.board?.powerGY
					? transformCardIdListCardNameString(game?.board?.powerGY)
					: EMPTY,
				env: game?.board?.elementType ? game?.board?.elementType : EMPTY,
			},
			playerTurn: game?.round?.player,
			one: {
				hp: game?.one?.hp,
				cardsName: game?.one?.cardsIds
					? transformCardIdListCardNameString(game?.one?.cardsIds)
					: EMPTY,
				cardsId: game?.one?.cardsIds ? transformCardIdListCardIdString(game?.one?.cardsIds) : EMPTY,
			},
			two: {
				hp: game?.two?.hp,
				cardsName: game?.two?.cardsIds
					? transformCardIdListCardNameString(game?.two?.cardsIds)
					: EMPTY,
				cardsId: game?.two?.cardsIds ? transformCardIdListCardIdString(game?.two?.cardsIds) : EMPTY,
			},
			time: new Date()?.toTimeString(),
		},
	});
};
export const transformBoardCardIdListToCardNameString = (slots: SlotType[] | undefined) => {
	let newFormatSlots = slots?.map(obj => {
		return obj?.cardId == EMPTY
			? EMPTY
			: getAnimalCard(obj?.cardId)?.name +
					' | canAttack:' +
					obj?.canAttack +
					' | hasAttacked:' +
					!!obj?.hasAttacked;
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
