import { useLocation } from 'react-router-dom';
import {
	ANIMALS_POINTS,
	ANIMAL_CARDS_OBJECT,
	ATTACKER,
	ClanName,
	JOKER,
	KING,
	POWERS_CARDS_IDS,
	POWER_CARDS_OBJECT,
	PREPARE,
	RUNNING,
	RoleName,
	TANK,
} from './data';
import { AnimalCard, Card, PlayerType, SlotType } from './interface';

export const isNotEmpty = (input: string | Array<any>, minLength = 0) => input.length > minLength;

export const waitFor = (delay: number) => new Promise(resolve => setTimeout(resolve, delay));

export const getCurrentPathName = () => {
	const location = useLocation();
	return location.pathname;
};

export const isAnimalCard = (cardId?: string): boolean =>
	!!cardId && ANIMAL_CARDS_OBJECT.hasOwnProperty(cardId);

export const isPowerCard = (cardId: string = ''): boolean =>
	POWER_CARDS_OBJECT.hasOwnProperty(new String(cardId).substring(4));

export const isGameRunning = (status?: string): boolean => !!status && status === RUNNING;
export const isGameInPreparation = (status?: string): boolean => !!status && status === PREPARE;

export const getOpponentIdFromCurrentId = (currentId: PlayerType): PlayerType =>
	currentId === PlayerType.ONE ? PlayerType.TWO : PlayerType.ONE;

export const isDev = () => {
	return process.env.NODE_ENV === 'development';
};

export const getPowerCard = (cardId?: string): Card | undefined => {
	if (!cardId || cardId.length < 4) return;
	return POWER_CARDS_OBJECT[getOriginalCardId(cardId)];
};
export const getCard = (cardId?: string): Card | undefined => {
	if (!cardId) return;
	if (cardId.slice(-2) == '-a') {
		return ANIMAL_CARDS_OBJECT[cardId];
	} else {
		return POWER_CARDS_OBJECT[getOriginalCardId(cardId)];
	}
};
export const getOriginalCardId = (cardId: string = '') => new String(cardId).substring(4);

export const getSortedMainDeck = () => [
	...POWERS_CARDS_IDS.map(id => 'one-' + id),
	...POWERS_CARDS_IDS.map(id => 'two-' + id),
];

export const getMainDeckFirstHalf = () => [...POWERS_CARDS_IDS.map(id => 'one-' + id)];
export const getMainDeckSecondHalf = () => [...POWERS_CARDS_IDS.map(id => 'two-' + id)];

export const getAnimalCard = (cardId?: string): AnimalCard | undefined => {
	if (!cardId || cardId?.length === 0) return;
	return ANIMAL_CARDS_OBJECT[cardId];
};

export const isKing = (cardId?: string) => getAnimalCard(cardId)?.role === KING;
export const isJoker = (cardId?: string) => getAnimalCard(cardId)?.role === JOKER;

export const isJokerInElement = (cardId?: string, elementType?: ClanName) =>
	getAnimalCard(cardId)?.role === JOKER && getAnimalCard(cardId)?.clan === elementType;
export const isKingInElement = (cardId?: string, elementType?: ClanName) =>
	getAnimalCard(cardId)?.role === KING && getAnimalCard(cardId)?.clan === elementType;
export const isAttackerInElement = (cardId?: string, elementType?: ClanName) =>
	getAnimalCard(cardId)?.role === ATTACKER && getAnimalCard(cardId)?.clan === elementType;

export const isAttacker = (cardId?: string) => getAnimalCard(cardId)?.role === ATTACKER;
export const isTank = (cardId?: string) => getAnimalCard(cardId)?.role === TANK;
export const isAnimalInEnv = (cardId?: string, elementType?: ClanName) =>
	elementType === getAnimalCard(cardId)?.clan;

export const getAnimalHP = (role: RoleName) => ANIMALS_POINTS[role].hp;
export const getAnimalAP = (role: RoleName, doubleAP = false) =>
	doubleAP ? ANIMALS_POINTS[role].ap * 2 : ANIMALS_POINTS[role].ap;

export const canAnimalAKillAnimalD = (
	aID?: string,
	dID?: string,
	tanksWithDoubleAP: boolean = false,
) => {
	const animalA = getAnimalCard(aID);
	const animalD = getAnimalCard(dID);
	if (!animalA || !animalD) return false;

	const doubleAP = animalA.role === TANK && tanksWithDoubleAP;
	const animalAAP = getAnimalAP(animalA.role, doubleAP);
	const animalDHP = getAnimalHP(animalD.role);

	if (animalAAP < animalDHP) {
		return false;
	}
	return true;
};

export const getIsOppSlotsEmpty = (slots: SlotType[] = []) =>
	!isAnimalCard(slots[0]?.cardId) &&
	!isAnimalCard(slots[1]?.cardId) &&
	!isAnimalCard(slots[2]?.cardId);

export const getIsOppSlotsAllFilled = (slots: SlotType[] = []) =>
	isAnimalCard(slots[0]?.cardId) &&
	isAnimalCard(slots[1]?.cardId) &&
	isAnimalCard(slots[2]?.cardId);
