import _ from 'lodash';
import { add1Hp, drawOneCard, minus1Hp, returnAnimalToDeck, returnRandomPowerCardToDeck } from './animalsAbilities';
import { ANIMALS_POINTS, ClanName, JOKER, KING, getAnimalCard } from './data';
import { getBoardPath, getItemsOnce, getPlayerPath, setItem } from './db';
import { getOpponentIdFromCurrentId, isAnimalCard, waitFor } from './helpers';
import { PlayerType, SlotType } from './interface';
import {
	addAnimalToBoard,
	addAnimalToGraveYard,
	addCardsToPlayerDeck,
	addInfoToLog,
	changeCanAttackVarOfSlot,
	getCardFromMainDeck,
	removeCardFromMainDeck,
	removeCardFromPlayerDeck,
	removeHpFromPlayer,
	removePlayerAnimalFromBoard,
	setActivePowerCard,
} from './unitActions';

export const revertMainDeck = async (roomId: string) => {
	const powerGY = (await getItemsOnce('rooms/' + roomId + '/board/powerGY')) as string[];
	await setItem('rooms/' + roomId + '/board/', { mainDeck: _.shuffle(powerGY) });
	await setItem('rooms/' + roomId + '/board/', { powerGY: [] });
};

export const enableAttackingAndPlayingPowerCards = async (roomId: string, playerType: string) => {
	await setItem('rooms/' + roomId + '/' + playerType, { canAttack: true, canPlayPowers: true });
};

export const drawCardFromMainDeck = async (roomId: string, playerType: string) => {
	await addInfoToLog(roomId, 'player ' + playerType + ' draw a card');
	const powerCardId = await getCardFromMainDeck(roomId);
	await removeCardFromMainDeck(roomId);
	await addCardsToPlayerDeck(roomId, playerType, [powerCardId]);
};

export const placeAnimalOnBoard = async (roomId: string, playerType: string, slotNb: number, animalId: string) => {
	const animal = getAnimalCard(animalId);
	await addInfoToLog(roomId, 'player ' + playerType + ' placed a ' + animal?.name + ' in slot ' + slotNb);
	await removeCardFromPlayerDeck(roomId, playerType, animalId);
	await addAnimalToBoard(roomId, playerType, slotNb, animalId);
};

export const placeKingOnBoard = async (
	roomId: string,
	playerType: string,
	kingId: string,
	sacrificedAnimalId: string,
	slotNb: number,
) => {
	const king = getAnimalCard(kingId);
	const sacrificedAnimal = getAnimalCard(sacrificedAnimalId);
	await addInfoToLog(
		roomId,
		'player ' + playerType + ' sacrificed a ' + sacrificedAnimal?.name + ' to play ' + king?.name,
	);
	if (!king || !sacrificedAnimal || king.clan !== sacrificedAnimal.clan) return;
	const isRemoved = await removePlayerAnimalFromBoard(roomId, playerType, slotNb);
	if (isRemoved) {
		const elementType = await getElementType(roomId);
		if (elementType != sacrificedAnimal.clan) {
			await addAnimalToGraveYard(roomId, sacrificedAnimalId);
		} else {
			await returnAnimalToDeck(roomId, playerType, sacrificedAnimalId);
		}
		await removeCardFromPlayerDeck(roomId, playerType, kingId);
		await addAnimalToBoard(roomId, playerType, slotNb, kingId, true);
	}
};

export const attackAnimal = async (
	roomId: string,
	playerType: PlayerType,
	animalAId: string,
	animalDId: string,
	slotDNumber: number,
) => {
	const animalA = getAnimalCard(animalAId)!;
	const animalD = getAnimalCard(animalDId)!;
	const opponentId = getOpponentIdFromCurrentId(playerType);

	await addInfoToLog(roomId, animalA.name + ' killed ' + animalD.name + ' of ' + opponentId);
	await removePlayerAnimalFromBoard(roomId, opponentId, slotDNumber);

	await addAnimalToGraveYard(roomId, animalDId);
};

export const attackOwner = async (
	roomId: string,
	playerDType: PlayerType,
	animalId: string,
	double: boolean = false,
) => {
	if (!isAnimalCard(animalId)) return;
	const { name, role } = getAnimalCard(animalId)!;
	await addInfoToLog(roomId, name + ' has attacked ' + playerDType + ' directly');
	const ap = double && role === KING ? ANIMALS_POINTS[role].ap * 2 : ANIMALS_POINTS[role].ap;
	await removeHpFromPlayer(roomId, playerDType, ap);
};

export const activateJokerAbility = async (roomId: string, jokerId: string, playerType: PlayerType) => {
	const joker = getAnimalCard(jokerId);
	if (!joker || joker.role != JOKER) return;

	const elementType = await getElementType(roomId);
	if (elementType != joker.clan) return;

	await addInfoToLog(roomId, joker.name + ' has activated his ability');

	switch (joker.name) {
		case 'Crow':
			await minus1Hp(roomId, getOpponentIdFromCurrentId(playerType));
			break;
		case 'Fox':
			await returnRandomPowerCardToDeck(roomId, playerType);
			break;
		case 'Snake':
			await add1Hp(roomId, playerType);
			break;
		case 'Jellyfish':
			await drawOneCard(roomId, playerType);
			break;
	}
};

export const setPowerCardAsActive = async (roomId: string, playerType: PlayerType, cardId: string, name: string) => {
	await addInfoToLog(roomId, 'player ' + playerType + ' placed a ' + name);
	await removeCardFromPlayerDeck(roomId, playerType, cardId);
	await setActivePowerCard(roomId, cardId);
	await waitFor(2000);
	await setActivePowerCard(roomId, '');
};

export const enableAttackForOpponentAnimals = async (
	roomId: string,
	playerDType: PlayerType,
	oppSlots: SlotType[] = [],
) => {
	for (let i = 0; i < oppSlots.length; i++) {
		if (isAnimalCard(oppSlots[i].cardId)) {
			await changeCanAttackVarOfSlot(roomId, playerDType, i, true);
		}
	}
};

export const activateJokersAbilities = async (roomId: string, playerDType: PlayerType, oppSlots: SlotType[] = []) => {
	for (let i = 0; i < oppSlots.length; i++) {
		const cardId = oppSlots[i]?.cardId;
		if (!!cardId && isAnimalCard(cardId)) {
			await activateJokerAbility(roomId, cardId, playerDType);
		}
	}
};

export const getElementType = async (roomId: string): Promise<ClanName> => {
	return await getItemsOnce(getBoardPath(roomId) + 'elementType');
};

export const placeKingWithoutSacrifice = async (
	roomId: string,
	playerType: PlayerType,
	kingId: string,
	slotNb: number,
) => {
	await removeCardFromPlayerDeck(roomId, playerType, kingId);
	await addAnimalToBoard(roomId, playerType, slotNb, kingId, true);
};

export const changeHasAttacked = async (roomId: string, playerType: PlayerType, slotNb: number, value: boolean) => {
	const slots = (await getItemsOnce(getBoardPath(roomId) + playerType)) ?? [];
	const updatedSlots = [
		slots[0] ?? { cardId: 'empty', canAttack: false },
		slots[1] ?? { cardId: 'empty', canAttack: false },
		slots[2] ?? { cardId: 'empty', canAttack: false },
	];
	updatedSlots[slotNb] = { ...updatedSlots[slotNb], hasAttacked: value };
	await setItem(getBoardPath(roomId), { [`${playerType}`]: updatedSlots });
};

export const incrementEnvLoad = async (roomId: string, playerType: PlayerType) => {
	const envLoadNb = (await getItemsOnce(getPlayerPath(roomId, playerType))) ?? 0;
	if (envLoadNb === 3) {
		return;
	}
	await setItem(getPlayerPath(roomId, playerType), { envLoadNb: envLoadNb + 1 });
};

export const setElementLoad = async (roomId: string, playerType: PlayerType, val: number = 1) => {
	// 0 when he changed element, 3 for loading element with card
	if (val === 0 || val === 3) {
		await setItem(getPlayerPath(roomId, playerType), { envLoadNb: val });
		return;
	}
	const envLoadNb = (await getItemsOnce(getPlayerPath(roomId, playerType))).envLoadNb ?? 0;
	if (envLoadNb >= 3) {
		return;
	}
	await setItem(getPlayerPath(roomId, playerType), { envLoadNb: envLoadNb + 1 });
};
