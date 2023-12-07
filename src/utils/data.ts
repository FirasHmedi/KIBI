import animalsCardsJson from '../assets/animal-cards.json';
import powerCardsJson from '../assets/power-cards.json';
import { airColor, earthColor, fireColor, neutralColor, waterColor } from '../styles/Style';
import { AllCards, AnimalCard, Card } from './interface';

export const SINGUP_PATH = '/signup';
export const SIGNIN_PATH = '/signin';
export const HOME_PATH = '/';
export const GAME_PATH = '/game/:id';
export const PROFILE_PATH = '/profile';
export const WALKTHROUGH_PATH = '/walkthrough';
export const CARDS_PATH = '/cards';

export const RUNNING = 'running';
export const READY = 'ready';
export const PREPARE = 'prepare';
export const GAMES_PATH = 'games/';

export const ROUND_DURATION = 80; //60

export const INITIAL_HP = 7;

export const ENV_MAX_LOAD = 3; // each turn get 1

export const INITIAL_DECK_COUNT = 10;

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

export const BOT = 'bot';

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

import airIcon from '/elements/white/air.png';
import earthIcon from '/elements/white/earth.png';
import fireIcon from '/elements/white/fire.png';
import waterIcon from '/elements/white/water.png';
export const elementsIcons = {
	air: airIcon,
	fire: fireIcon,
	water: waterIcon,
	earth: earthIcon,
};

import badger from '/animals/badger.png';
import bear from '/animals/bear.png';
import bee from '/animals/bee.png';
import crow from '/animals/crow.png';
import dragon from '/animals/dragon.png';
import eagle from '/animals/eagle.png';
import fox from '/animals/fox.png';
import jellyfish from '/animals/jellyfish.png';
import orca from '/animals/orca.png';
import ostrich from '/animals/ostrich.png';
import phoenix from '/animals/phoenix.png';
import shark from '/animals/shark.png';
import snake from '/animals/snake.png';
import whale from '/animals/whale.png';
import bull from '/src/assets/icons/bull.svg';
import elephant1 from '/src/assets/icons/elephant.svg';
import lion1 from '/src/assets/icons/lion.svg';
import monkey from '/src/assets/icons/monkey.svg';

export const animalsPics = {
	elephant: elephant1,
	bear: bear,
	ostrich: ostrich,
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
	whale: whale,
	monkey: monkey,
	bull: bull,
	lion: lion1,
};

export const ALL_CARDS_OBJECT: Record<string, AllCards> = {
	...JSON.parse(JSON.stringify(animalsCardsJson)),
	...JSON.parse(JSON.stringify(powerCardsJson)),
};

export const getKeysArrayFromJson = (file: any) => Object.keys(JSON.parse(JSON.stringify(file)));
export const getArrayFromJson = (file: any) => {
	const object = JSON.parse(JSON.stringify(file));
	return Object.keys(object).map(id => ({ id, ...object[id] }));
};

export const ANIMALS_CARDS_IDS: string[] = getKeysArrayFromJson(animalsCardsJson);
export const POWERS_CARDS_IDS: string[] = getKeysArrayFromJson(powerCardsJson);

export const ANIMALS_CARDS: AnimalCard[] = getArrayFromJson(animalsCardsJson);
export const ANIMAL_CARDS_OBJECT: Record<string, AnimalCard> = JSON.parse(
	JSON.stringify(animalsCardsJson),
);

export const POWER_CARDS_OBJECT: Record<string, Card> = JSON.parse(JSON.stringify(powerCardsJson));
export const POWER_CARDS: Card[] = getArrayFromJson(powerCardsJson);
