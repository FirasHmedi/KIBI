// @ts-ignore
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

export const envCardsIds = ['8-p', '14-p', '15-p', '16-p'];
export const cardsWithSlotSelection = ['3-p', '4-p', '5-p'];

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

import attackerIcon from '../assets/icons/attacker.png';
import jokerIcon from '../assets/icons/joker.png';
import kingIcon from '../assets/icons/king.png';
import tankIcon from '../assets/icons/tank.png';

export const rolesIcons = {
  tank: tankIcon,
  joker: jokerIcon,
  king: kingIcon,
  attacker: attackerIcon,
};

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
export const ANIMAL_CARDS_OBJECT: Record<string, AnimalCard> = JSON.parse(
  JSON.stringify(animalsCardsJson),
);

export const getAnimalCard = (cardId?: string): AnimalCard | undefined => {
  if (!cardId || cardId.length < 4) return;
  return ANIMAL_CARDS_OBJECT[getOriginalCardId(cardId)];
};

export const POWER_CARDS_OBJECT: Record<string, Card> = JSON.parse(JSON.stringify(powerCardsJson));
export const POWER_CARDS: Card[] = getArrayFromJson(powerCardsJson);

export const getPowerCard = (cardId?: string): Card | undefined => {
  if (!cardId || cardId.length < 4) return;
  return POWER_CARDS_OBJECT[getOriginalCardId(cardId)];
};

export const getOriginalCardId = (cardId: string = '') => new String(cardId).substring(4);

export const getSortedMainDeck = () => [
  ...POWERS_CARDS_IDS.map(id => 'one-' + id),
  ...POWERS_CARDS_IDS.map(id => 'two-' + id),
];

/*
  "6-p": {
    "ability": "Switch health with opponent",
    "description": "Switch health with opponent",
    "name": "Switch health of players"
  },
*/
