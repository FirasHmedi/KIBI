import { isEmpty } from 'lodash';
import shuffle from 'lodash/shuffle';
import { ANIMALS_POINTS, ClanName, EMPTY_SLOT, JOKER } from '../utils/data';
import {
	getAnimalCard,
	getOpponentIdFromCurrentId,
	isAnimalCard,
	isTankInElement,
	waitFor,
} from '../utils/helpers';
import { PlayerType, SlotType } from '../utils/interface';
import {
	add1Hp,
	drawOneCard,
	returnRandomAnimalCardToDeck,
	returnRandomPowerCardToDeck,
	sendRandomOpponentCardToGY,
} from './animalsAbilities';
import { getBoardPath, getItemsOnce, getPlayerPath, setItem } from './db';
import {
	addAnimalToBoard,
	addAnimalToGraveYard,
	addCardsToPlayerDeck,
	addInfoToLog,
	changeCanAttackVarOfSlot,
	getCardFromMainDeck,
	removeAnimalFromBoard,
	removeCardFromMainDeck,
	removeCardFromPlayerDeck,
	removeHpFromPlayer,
	setActivePowerCard,
} from './unitActions';

export const revertMainDeck = async (gameId: string) => {
	const powerGY = (await getItemsOnce('games/' + gameId + '/board/powerGY')) as string[];
	await setItem('games/' + gameId + '/board/', { mainDeck: shuffle(powerGY) });
	await setItem('games/' + gameId + '/board/', { powerGY: [] });
};

export const enableAttackingAndPlayingPowerCards = async (
	gameId: string,
	playerType: PlayerType,
) => {
	await setItem('games/' + gameId + '/' + playerType, { canAttack: true, canPlayPowers: true });
};

export const drawCardFromMainDeck = async (gameId: string, playerType: PlayerType) => {
	const powerCardId = await getCardFromMainDeck(gameId);
	if (isEmpty(powerCardId)) {
		return;
	}
	await removeCardFromMainDeck(gameId);
	await addCardsToPlayerDeck(gameId, playerType, [powerCardId!]);
	await addInfoToLog(gameId, playerType + ' draw a power card');
};

export const placeAnimalOnBoard = async (
	gameId: string,
	playerType: PlayerType,
	slotNb: number,
	animalId: string,
) => {
	const animal = getAnimalCard(animalId);
	await addInfoToLog(gameId, playerType + ' placed ' + animal?.name + ' in ' + slotNb);
	await removeCardFromPlayerDeck(gameId, playerType, animalId);
	await addAnimalToBoard(gameId, playerType, slotNb, animalId);
};

export const placeKingOnBoard = async (
	gameId: string,
	playerType: PlayerType,
	kingId: string,
	sacrificedAnimalId: string,
	slotNb: number,
) => {
	const king = getAnimalCard(kingId);
	const sacrificedAnimal = getAnimalCard(sacrificedAnimalId);
	await addInfoToLog(
		gameId,
		playerType + ' sacrificed a ' + sacrificedAnimal?.name + ' to play ' + king?.name,
	);
	if (!king || !sacrificedAnimal || king.clan !== sacrificedAnimal.clan) return;
	const isRemoved = await removeAnimalFromBoard(gameId, playerType, slotNb);
	if (isRemoved) {
		await addAnimalToGraveYard(gameId, sacrificedAnimalId);
		await removeCardFromPlayerDeck(gameId, playerType, kingId);
		await addAnimalToBoard(gameId, playerType, slotNb, kingId);
	}
};

export const attackOppAnimal = async (
	gameId: string,
	playerType: PlayerType,
	animalAId: string,
	animalDId: string,
	slotDNumber: number,
) => {
	const animalA = getAnimalCard(animalAId)!;
	const animalD = getAnimalCard(animalDId)!;
	if (!animalA || !animalD) return;

	const opponentId = getOpponentIdFromCurrentId(playerType);
	await addInfoToLog(gameId, animalA.name + ' killed ' + animalD.name + ' of ' + opponentId);

	await removeAnimalFromBoard(gameId, opponentId, slotDNumber);
	await addAnimalToGraveYard(gameId, animalDId);
};

export const activateTankAbility = async (
	gameId: string,
	playerType: PlayerType,
	slots: any[] = [],
	elementType?: ClanName,
) => {
	for (let i = 0; i < slots.length; i++) {
		if (isTankInElement(slots[i]?.cardId, elementType)) {
			await add1Hp(gameId, playerType);
			return;
		}
	}
};

export const attackOwner = async (
	gameId: string,
	playerDType: PlayerType,
	animalId: string,
	isDoubleAP: boolean = false,
) => {
	if (!isAnimalCard(animalId)) return;
	const { name, role } = getAnimalCard(animalId)!;
	await addInfoToLog(gameId, name + ' has attacked ' + playerDType);
	const ap = isDoubleAP ? ANIMALS_POINTS[role].ap * 2 : ANIMALS_POINTS[role].ap;
	await removeHpFromPlayer(gameId, playerDType, ap);
};

/* Not Used */
export const activateJokerAbility = async (
	gameId: string,
	jokerId: string,
	playerType: PlayerType,
) => {
	const joker = getAnimalCard(jokerId);
	if (!joker || joker.role != JOKER) return;

	const elementType = await getElementType(gameId);
	if (elementType != joker.clan) return;

	await addInfoToLog(gameId, joker.name + ' has activated his ability');

	switch (elementType) {
		case 'air':
			await returnRandomAnimalCardToDeck(gameId, playerType);
			break;
		case 'fire':
			await returnRandomPowerCardToDeck(gameId, playerType);
			break;
		case 'earth':
			await sendRandomOpponentCardToGY(gameId, playerType);
			break;
		case 'water':
			await drawOneCard(gameId, playerType);
			break;
	}
};

export const setPowerCardAsActive = async (
	gameId: string,
	playerType: PlayerType,
	cardId: string,
	name?: string,
) => {
	if (name) {
		await addInfoToLog(gameId, playerType + ' placed ' + name);
	}
	await removeCardFromPlayerDeck(gameId, playerType, cardId);
	await setActivePowerCard(gameId, cardId);
	await waitFor(300);
	await setActivePowerCard(gameId, '');
};

export const enableAttackForOpponentAnimals = async (
	gameId: string,
	playerDType: PlayerType,
	oppSlots: SlotType[] = [],
) => {
	for (let i = 0; i < oppSlots.length; i++) {
		if (isAnimalCard(oppSlots[i].cardId)) {
			await changeCanAttackVarOfSlot(gameId, playerDType, i, true);
		}
	}
};

/* Not Used */
export const activateJokersAbilities = async (
	gameId: string,
	playerDType: PlayerType,
	slots: SlotType[] = [],
) => {
	for (let i = 0; i < slots.length; i++) {
		const cardId = slots[i]?.cardId;
		if (isAnimalCard(cardId)) {
			await activateJokerAbility(gameId, cardId, playerDType);
		}
	}
};

export const getElementType = async (gameId: string): Promise<ClanName> => {
	return await getItemsOnce(getBoardPath(gameId) + 'elementType');
};

export const placeKingWithoutSacrifice = async (
	gameId: string,
	playerType: PlayerType,
	kingId: string,
	slotNb: number,
) => {
	await removeCardFromPlayerDeck(gameId, playerType, kingId);
	await addAnimalToBoard(gameId, playerType, slotNb, kingId);
};

export const changeHasAttacked = async (
	gameId: string,
	playerType: PlayerType,
	slotNb: number,
	value: boolean,
) => {
	const slots = (await getItemsOnce(getBoardPath(gameId) + playerType)) ?? [];
	const updatedSlots = [slots[0] ?? EMPTY_SLOT, slots[1] ?? EMPTY_SLOT, slots[2] ?? EMPTY_SLOT];
	updatedSlots[slotNb] = { ...updatedSlots[slotNb], hasAttacked: value };
	await setItem(getBoardPath(gameId), { [`${playerType}`]: updatedSlots });
};

export const incrementEnvLoad = async (gameId: string, playerType: PlayerType) => {
	const envLoadNb = (await getItemsOnce(getPlayerPath(gameId, playerType))) ?? 0;
	if (envLoadNb === 3) {
		return;
	}
	await setItem(getPlayerPath(gameId, playerType), { envLoadNb: envLoadNb + 1 });
};

export const setElementLoad = async (gameId: string, playerType: PlayerType, val: number) => {
	await setItem(getPlayerPath(gameId, playerType), { envLoadNb: val });
	// 0 when he changed element, 3 for loading element with card
	/*
	if (val === 0 || val === 3) {
		await setItem(getPlayerPath(gameId, playerType), { envLoadNb: val });
		return;
	}
	const envLoadNb = (await getItemsOnce(getPlayerPath(gameId, playerType))).envLoadNb ?? 0;
	if (envLoadNb >= 3) {
		return;
	}
	await setItem(getPlayerPath(gameId, playerType), { envLoadNb: envLoadNb + 1 });
	*/
};
