import { sha256 } from 'js-sha256';
import { isEmpty, shuffle } from 'lodash';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getGamePath, getItemsOnce, getUserById, setItem } from '../backend/db';
import {
	ANIMALS_CARDS,
	ANIMALS_POINTS,
	ANIMAL_CARDS_OBJECT,
	ATTACKER,
	ClanName,
	FINISHED,
	JOKER,
	KING,
	PLAYER_HASH_KEY,
	PLAYER_ID_KEY,
	POWERS_CARDS_IDS,
	POWER_CARDS_OBJECT,
	PREPARE,
	RUNNING,
	RoleName,
	TANK,
} from './data';
import { AnimalCard, Card, PlayerType, SlotType, User } from './interface';

export const isNotEmpty = (input: string | Array<any>, minLength = 0) =>
	!!input && input?.length > minLength;

export const waitFor = (delay: number) => new Promise(resolve => setTimeout(resolve, delay));

export const getCurrentPathName = () => {
	const location = useLocation();
	return location.pathname;
};

export const isAnimalCard = (cardId?: string): boolean =>
	!!cardId && ANIMAL_CARDS_OBJECT.hasOwnProperty(cardId);

export const isPowerCard = (cardId: string = ''): boolean =>
	POWER_CARDS_OBJECT.hasOwnProperty(new String(cardId).substring(4));

export const isCard = (cardId: string = ''): boolean => isAnimalCard(cardId) || isPowerCard(cardId);

export const isGameRunning = (status?: string): boolean => !!status && status === RUNNING;
export const isGameFinished = (status?: string): boolean => !!status && status === FINISHED;
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
export const isTankInElement = (cardId?: string, elementType?: ClanName) =>
	getAnimalCard(cardId)?.role === TANK && getAnimalCard(cardId)?.clan === elementType;

export const isAttacker = (cardId?: string) => getAnimalCard(cardId)?.role === ATTACKER;
export const isTank = (cardId?: string) => getAnimalCard(cardId)?.role === TANK;
export const isAnimalInEnv = (cardId?: string, elementType?: ClanName) =>
	elementType === getAnimalCard(cardId)?.clan;

export const getAnimalHP = (role: RoleName) => ANIMALS_POINTS[role].hp;
export const getAnimalAP = (role: RoleName, isDoubleAP = false) =>
	isDoubleAP ? ANIMALS_POINTS[role].ap * 2 : ANIMALS_POINTS[role].ap;

export const canAnimalAKillAnimalD = (aID?: string, dID?: string, isDoubleAP: boolean = false) => {
	if (isDoubleAP) {
		return true;
	}
	const animalA = getAnimalCard(aID);
	const animalD = getAnimalCard(dID);
	if (!animalA || !animalD) return false;

	const animalAAP = getAnimalAP(animalA.role);
	const animalDHP = getAnimalHP(animalD.role);

	if (animalAAP < animalDHP) {
		toast.warn('Not enough AP to attack', {
			position: toast.POSITION.TOP_RIGHT,
			autoClose: 1000,
		});
		return false;
	}
	return true;
};

export const getISlotsAllEmpty = (slots: SlotType[] = []) =>
	!isAnimalCard(slots[0]?.cardId) &&
	!isAnimalCard(slots[1]?.cardId) &&
	!isAnimalCard(slots[2]?.cardId);

export const getIsSlotsAllFilled = (slots: SlotType[] = []) =>
	isAnimalCard(slots[0]?.cardId) &&
	isAnimalCard(slots[1]?.cardId) &&
	isAnimalCard(slots[2]?.cardId);

export const hasAttackerInElement = (slots: SlotType[] = [], elementType?: ClanName) => {
	return (
		isAttackerInElement(slots[0]?.cardId, elementType) ||
		isAttackerInElement(slots[1]?.cardId, elementType) ||
		isAttackerInElement(slots[2]?.cardId, elementType)
	);
};

export const submitRandomSelection = async (gameId: string, powerCards: string[] = []) => {
	const oneCardsIds: string[] = [];
	const twoCardsIds: string[] = [];
	let i = 0,
		j = 0,
		k = 0,
		l = 0,
		m = 0,
		n = 0,
		o = 0,
		p = 0;
	shuffle(ANIMALS_CARDS)
		.filter(({ role, id }) => {
			if (role === KING) {
				if (i < 2) {
					oneCardsIds.push(id);
					i++;
				} else if (j < 2) {
					twoCardsIds.push(id);
					j++;
				}
				return false;
			}
			return true;
		})
		.filter(({ role, id }) => {
			if (role === JOKER) {
				if (k < 2) {
					oneCardsIds.push(id);
					k++;
				} else if (l < 2) {
					twoCardsIds.push(id);
					l++;
				}
				return false;
			}
			return true;
		})
		.filter(({ role, id }) => {
			if (role === TANK) {
				if (m < 2) {
					oneCardsIds.push(id);
					m++;
				} else if (n < 2) {
					twoCardsIds.push(id);
					n++;
				}
				return false;
			}
			return true;
		})
		.filter(({ role, id }) => {
			if (role === ATTACKER) {
				if (o < 2) {
					oneCardsIds.push(id);
					o++;
				} else if (p < 2) {
					twoCardsIds.push(id);
					p++;
				}
				return false;
			}
			return true;
		});

	oneCardsIds.push(...(powerCards ?? []).filter((_: any, index: number) => index < 2));
	twoCardsIds.push(...(powerCards ?? []).filter((_: any, index: number) => index >= 2));

	await setItem(getGamePath(gameId) + 'tmp/', {
		oneCardsIds,
		twoCardsIds,
	});

	await setItem(getGamePath(gameId), {
		playerToSelect: PlayerType.ONE,
	});
};

export const submitRandomSelectionforBot = async (gameId: string, powerCards: string[] = []) => {
	const oneCardsIds: string[] = [];
	const twoCardsIds: string[] = [];
	let i = 0,
		j = 0,
		k = 0,
		l = 0,
		m = 0,
		n = 0,
		o = 0,
		p = 0;
	shuffle(ANIMALS_CARDS)
		.filter(({ role, id }) => {
			if (role === KING) {
				if (i < 2) {
					oneCardsIds.push(id);
					i++;
				} else if (j < 2) {
					twoCardsIds.push(id);
					j++;
				}
				return false;
			}
			return true;
		})
		.filter(({ role, id }) => {
			if (role === JOKER) {
				if (k < 2) {
					oneCardsIds.push(id);
					k++;
				} else if (l < 2) {
					twoCardsIds.push(id);
					l++;
				}
				return false;
			}
			return true;
		})
		.filter(({ role, id }) => {
			if (role === TANK) {
				if (m < 2) {
					oneCardsIds.push(id);
					m++;
				} else if (n < 2) {
					twoCardsIds.push(id);
					n++;
				}
				return false;
			}
			return true;
		})
		.filter(({ role, id }) => {
			if (role === ATTACKER) {
				if (o < 2) {
					oneCardsIds.push(id);
					o++;
				} else if (p < 2) {
					twoCardsIds.push(id);
					p++;
				}
				return false;
			}
			return true;
		});

	oneCardsIds.push(...(powerCards ?? []).filter((_: any, index: number) => index < 2));
	twoCardsIds.push(...(powerCards ?? []).filter((_: any, index: number) => index >= 2));

	await setItem(getGamePath(gameId) + 'tmp/', {
		oneCardsIds,
		twoCardsIds,
	});

	await setItem(getGamePath(gameId), {
		playerToSelect: PlayerType.ONE,
	});
};

export const distributeCards = async (gameId: string) => {
	const playersCards = await getItemsOnce(getGamePath(gameId) + 'tmp/');
	const oneCardsIds: string[] = playersCards.oneCardsIds ?? [];
	const twoCardsIds: string[] = playersCards.twoCardsIds ?? [];

	let playerOneCards: string[] = [];
	let playerTwoCards: string[] = [];

	for (let i = 0; i < 10; i += 2) {
		playerOneCards.push(...oneCardsIds.slice(i, i + 2));
		await setItem(getGamePath(gameId) + PlayerType.ONE, {
			cardsIds: playerOneCards,
		});

		playerTwoCards.push(...twoCardsIds.slice(i, i + 2));
		await setItem(getGamePath(gameId) + PlayerType.TWO, {
			cardsIds: playerTwoCards,
		});

		await waitFor(800);
	}
};

export const isAnimalInSlots = (slots: SlotType[] = [], cardId?: string): boolean => {
	if (isEmpty(cardId) || !isAnimalCard(cardId)) {
		return false;
	}
	return slots.some(slot => slot?.cardId === cardId);
};

export const showToast = (msg: string, time = 1000) => {
	toast.warning(msg, {
		position: toast.POSITION.TOP_RIGHT,
		autoClose: time,
	});
};

export const isPowerCardPlayable = (cardId: string, elements: any) => {
	const { currPlayer, animalGY, powerGY, oppPlayer, currPSlots, isOppSlotsEmpty } = elements;
	const hp = currPlayer.hp;
	switch (getOriginalCardId(cardId!)) {
		case 'block-att':
			if (hp < 2) {
				showToast('Not enough hp to block enemy attacks');
				return false;
			}
			break;
		case 'block-pow':
			if (hp < 2) {
				showToast('Not enough HP to block enemy powers');
				return false;
			}
			break;
		case 'reset-board':
			if (hp < 2) {
				showToast('Not enough HP to reset board');
				return false;
			}
			break;
		case 'rev-any-anim-1hp':
			if (isEmpty(animalGY)) {
				showToast('No animals to revive');
				return false;
			}
			if (hp < 2) {
				showToast('Not enough hp to revive animal');
				return false;
			}
			break;
		case 'steal-anim-3hp':
			if (hp < 4) {
				showToast('Not enough HP to steal animal');
				return false;
			}
			if (isOppSlotsEmpty) {
				showToast('No animal to steal');
				return false;
			}
			break;
		case 'sacrif-anim-3hp':
			if (
				!isAnimalCard(currPSlots[0].cardId) &&
				!isAnimalCard(currPSlots[1].cardId) &&
				!isAnimalCard(currPSlots[2].cardId)
			) {
				showToast('No animals to sacrifice');
				return false;
			}
			break;
		case '2-anim-gy':
			if (isEmpty(animalGY) || animalGY?.length < 2) {
				showToast('Not enough Animals to return');
				return false;
			}
			break;
		case 'rev-any-pow-1hp':
			if (isEmpty(powerGY)) {
				showToast('No Power Cards to revive');
				return false;
			}
			if (hp < 2) {
				showToast('Not enough HP to revive powers');
				return false;
			}
			break;
		case 'switch-2-cards':
			if (currPlayer.cardsIds.length < 3 || oppPlayer.cardsIds.length < 2) {
				showToast('Not enough cards to switch');
				return false;
			}
			break;
		case 'rev-last-pow':
			if (isEmpty(powerGY)) {
				showToast('No power card to revive');
				return false;
			}
			const lastPow = powerGY[powerGY.length - 1];
			if (
				getOriginalCardId(lastPow) === 'rev-last-pow' ||
				getOriginalCardId(lastPow) === 'rev-any-pow-1hp'
			) {
				showToast("Can't revive Power Card twice");
				return false;
			}
			break;
		case 'steal-card-1hp':
			if (hp < 2) {
				showToast('Not enough HP');
				return false;
			}
			if (isEmpty(oppPlayer.cardsIds)) {
				return false;
			}
			break;
	}
	return true;
};

export const isUserConnected = async (): Promise<User> => {
	const playerId = localStorage.getItem(PLAYER_ID_KEY);
	const playerHash = localStorage.getItem(PLAYER_HASH_KEY);

	if (isEmpty(playerId) || isEmpty(playerHash)) {
		return {} as User;
	}
	const user = await getUserById(playerId!);

	if (isEmpty(user) || user.hash !== playerHash) {
		return {} as User;
	}

	return user;
};

export const getHash = (input: string = '') => {
	return sha256(input);
};
