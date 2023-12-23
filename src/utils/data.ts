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

export const INITIAL_HP = 9;

export const ENV_MAX_LOAD = 1;

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

import eagle from '/src/assets/icons/eagle.svg';
import lion from '/src/assets/icons/lion.svg';
import monkey from '/src/assets/icons/monkey.svg';
import whale from '/src/assets/icons/whale.svg';

export const animalsPics = {
	eagle: eagle,
	whale: whale,
	lion: lion,
	monkey: monkey,
};

import { getOriginalCardId } from './helpers';
import twoAnimals from '/src/assets/icons/2-animals.svg';
import blockAttacks from '/src/assets/icons/block-attacks.svg';
import blockPowers from '/src/assets/icons/block-pow.svg';
import drawTwo from '/src/assets/icons/draw-2.svg';
import hpGain from '/src/assets/icons/hp-gain.svg';
import resetBoard from '/src/assets/icons/reset.svg';
import revAnyAnimal from '/src/assets/icons/rev-any-animal.svg';
import revAnyPower from '/src/assets/icons/rev-any-power.svg';
import revLastPower from '/src/assets/icons/rev-last-pow.svg';
import sacrificeAnimal from '/src/assets/icons/sacrifice-animal.svg';
import stealAnimal from '/src/assets/icons/steal-animal.svg';
import switch2Cards from '/src/assets/icons/switch-2-cards.svg';
import switchCards from '/src/assets/icons/switch.svg';

export const powersPics = {
	blockAttacks,
	blockPowers,
	twoAnimals,
	drawTwo,
	hpGain,
	resetBoard,
	switchCards,
	switch2Cards,
	sacrificeAnimal,
	revLastPower,
	revAnyAnimal,
	revAnyPower,
	stealAnimal,
};

export const getPowerCardIcon = (id: string) => {
	let h = '2.4rem',
		w = '2.4rem';
	switch (getOriginalCardId(id)) {
		case 'block-att':
			return { src: blockAttacks, h, w };
		case 'rev-last-pow':
			return { src: revLastPower, h: '2.6rem', w: '2.6rem' };
		case 'rev-any-pow-1hp':
			return { src: revAnyPower, h: '3rem', w: '3rem' };
		case 'rev-any-anim-1hp':
			return { src: revAnyAnimal, h, w };
		case 'steal-anim-3hp':
			return { src: stealAnimal, h: '2.6rem', w: '2.6rem' };
		case 'switch-decks':
			return { src: switchCards, h: '2.6rem', w: '2.6rem' };
		case 'switch-2-cards':
			return { src: switch2Cards, h: '2.8rem', w: '2.8rem' };
		case 'sacrif-anim-3hp':
			return { src: sacrificeAnimal, h, w };
		case '2hp':
			return { src: hpGain, h, w };
		case 'draw-2':
			return { src: drawTwo, h, w };
		case '2-anim-gy':
			return { src: twoAnimals, h, w };
		case 'block-pow':
			return { src: blockPowers, h, w };
		case 'reset-board':
			return { src: resetBoard, h, w };
	}
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

export const EMPTY_SLOT = { cardId: EMPTY, canAttack: false };

export const POWER_CARDS_WITH_2_SELECTS = ['2-anim-gy', 'switch-2-cards'];
