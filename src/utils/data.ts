import animalsCardsJson from '../assets/animal-cards.json';
import powerCardsJson from '../assets/power-cards.json';
import { airColor, earthColor, fireColor, neutralColor, waterColor } from '../styles/Style';
import { AllCards, AnimalCard, Card } from './interface';

export const SINGUP_PATH = '/signup';
export const SIGNIN_PATH = '/signin';
export const HOME_PATH = '/';
export const GAME_PATH = '/game/:id';

export const RUNNING = 'running';
export const READY = 'ready';
export const PREPARE = 'prepare';
export const ROOMS_PATH = 'rooms/';

export const INITIAL_HP = 8;

export const ENV_MAX_LOAD = 3; // each turn get 1

export const EMPTY = 'empty';

export const WATER = 'water';
export const AIR = 'air';
export const FIRE = 'fire';
export const EARTH = 'earth';
export const NEUTRAL = 'neutral';

export const ClansNames = ['water', 'earth', 'fire', 'air', 'neutral'];

export const KING = 'king';
export const ATTACKER = 'attacker';
export const TANK = 'tank';
export const JOKER = 'joker';

export type ClanName = 'air' | 'earth' | 'fire' | 'water' | 'neutral';
export type RoleName = 'tank' | 'attacker' | 'king' | 'joker';

export const CLANS = {
	water: {
		color: waterColor,
	},
	fire: {
		color: fireColor,
	},
	earth: {
		color: earthColor,
	},
	air: {
		color: airColor,
	},
	neutral: {
		color: neutralColor,
	},
};

export const envCardsIds = ['env-4', 'env-1', 'env-2', 'env-3'];
export const ANIMALS_POINTS = {
	king: {
		ap: 2,
		hp: 2,
	},
	tank: {
		ap: 1,
		hp: 2,
	},
	attacker: {
		ap: 2,
		hp: 1,
	},
	joker: {
		ap: 1,
		hp: 1,
	},
};

import attackerIcon from '/src/assets/icons/attacker.png';
import jokerIcon from '/src/assets/icons/joker.png';
import kingIcon from '/src/assets/icons/king.png';
import tankIcon from '/src/assets/icons/tank.png';

export const rolesIcons = {
	tank: tankIcon,
	joker: jokerIcon,
	king: kingIcon,
	attacker: attackerIcon,
};

import elephant from '/src/assets/animals/elephant.png';
import lion from '/src/assets/animals/lion.png';
import crow from '/src/assets/animals/crow.png';
import orca from '/src/assets/animals/orca.png';
import ostrich from '/src/assets/animals/ostrich.png';
import shark from '/src/assets/animals/shark.png';
import snake from '/src/assets/animals/snake.png';
import eagle from '/src/assets/animals/eagle.png';
import jellyfish from '/src/assets/animals/jellyfish.png';
import dragon from '/src/assets/animals/dragon.png';
import bear from '/src/assets/animals/bear.png';
import badger from '/src/assets/animals/badger.png';
import bee from '/src/assets/animals/bee.png';
import fox from '/src/assets/animals/fox.png';
import phoenix from '/src/assets/animals/phoenix.png';

export const animalsPics = {
	elephant: elephant,
	bear: bear,
	ostrich: ostrich,
	lion: lion,
	eagle: eagle,
	orca: orca,
	dragon: dragon,
	phoenix: phoenix,
	badger: badger,
	shark: shark,
	bee: bee,
	snake: snake,
	crow: crow,
	jellyfish: jellyfish,
	fox: fox,
};

export const isKing = (cardId?: string) => getAnimalCard(cardId)?.role === KING;
export const isJoker = (cardId?: string) => getAnimalCard(cardId)?.role === JOKER;
export const isAttacker = (cardId?: string) => getAnimalCard(cardId)?.role === ATTACKER;
export const isTank = (cardId?: string) => getAnimalCard(cardId)?.role === TANK;
export const isAnimalInEnv = (cardId?: string, elementType?: ClanName) => elementType === getAnimalCard(cardId)?.clan;

const getArrayFromJson = (file: any) => {
	const object = JSON.parse(JSON.stringify(file));
	return Object.keys(object).map(id => ({ id, ...object[id] }));
};

const getKeysArrayFromJson = (file: any) => Object.keys(JSON.parse(JSON.stringify(file)));

export const ALL_CARDS_OBJECT: Record<string, AllCards> = {
	...JSON.parse(JSON.stringify(animalsCardsJson)),
	...JSON.parse(JSON.stringify(powerCardsJson)),
};

export const ANIMALS_CARDS_IDS: string[] = getKeysArrayFromJson(animalsCardsJson);
export const POWERS_CARDS_IDS: string[] = getKeysArrayFromJson(powerCardsJson);

export const ANIMALS_CARDS: AnimalCard[] = getArrayFromJson(animalsCardsJson);
export const ANIMAL_CARDS_OBJECT: Record<string, AnimalCard> = JSON.parse(JSON.stringify(animalsCardsJson));

export const getAnimalCard = (cardId?: string): AnimalCard | undefined => {
	if (!cardId || cardId?.length === 0) return;
	return ANIMAL_CARDS_OBJECT[cardId];
};

export const POWER_CARDS_OBJECT: Record<string, Card> = JSON.parse(JSON.stringify(powerCardsJson));
export const POWER_CARDS: Card[] = getArrayFromJson(powerCardsJson);

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

/*
  "6-p": {
    "ability": "Switch health with opponent",
    "description": "Switch health with opponent",
    "name": "Switch health of players"
  },
*/

/*
  "reset-board": {
    "ability": "Reset Board (animals, env)",
    "description": "Reset Board (animals, env)",
    "name": "Reset Board (animals, env)"
  }
*/
