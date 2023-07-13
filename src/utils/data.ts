// @ts-ignore
import _ from 'lodash';
import animalsCardsJson from '../assets/animal-cards.json';
import powerCardsJson from '../assets/power-cards.json';
import { AllCards } from '../components/Slots';
import { airColor, earthColor, fireColor, neutralColor, waterColor } from '../styles/Style';

export const SINGUP_PATH = '/signup';
export const SIGNIN_PATH = '/signin';
export const HOME_PATH = '/';
export const GAME_PATH = '/game/:id';

export const RUNNING = 'running';
export const READY = 'ready';
export const PREPARE = 'prepare';
export const ROOMS_PATH = 'rooms/';

export interface Card {
  id: string;
  ability?: string;
  description?: string;
  name?: string;
}

export interface AnimalCard extends Card {
  clan: ClanName;
  role: string;
}

export const NeutralEnvCard: Card = {
  id: '0',
  name: 'Neutral',
  ability: 'neutral',
};

export const DefaultBoard = {
  mainDeck: [],
  currentPSlots: [],
  opponentPSlots: [],
  animalsGY: [],
  powersGY: [],
  envCard: NeutralEnvCard,
  activeCardId: null,
};

export enum PlayerType {
  ONE = 'one',
  TWO = 'two',
}

export interface Player {
  playerType: PlayerType;
  cardsIds: string[];
  hp: number;
  status: string;
  playerName?: string;
  canPlayPowers: boolean;
  canPlayAnimals: boolean;
}

export const ClansNames = ['water', 'earth', 'fire', 'air', 'neutral'];

export type ClanName = 'air' | 'earth' | 'fire' | 'water' | 'neutral';

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

export const TestDeck = [
  {
    id: '1',
  },
  {
    id: '2',
  },
  {
    id: '3',
  },
  {
    id: '4',
  },
  {
    id: '5',
  },
  {
    id: '6',
  },
  {
    id: '7',
  },
  {
    id: '8',
  },
];
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
export const GeneralTestData = {
  roomId: 'test',
  playerName: 'test',
  playerType: 'one',
  playerId: 'testId',
};
export const AnimalsGY = [];
export const PowersGY = [];

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

export const getAnimalCard = (cardId: string): AnimalCard | undefined => {
  if (!cardId || cardId.length < 4) return;
  return ANIMAL_CARDS_OBJECT[cardId.toString().substring(4)];
};

export const POWER_CARDS_OBJECT: Record<string, Card> = JSON.parse(JSON.stringify(powerCardsJson));
export const POWER_CARDS: Card[] = getArrayFromJson(powerCardsJson);
export const getPowerCard = (cardId: string): Card | undefined => {
  if (!cardId || cardId.length < 4) return;
  return POWER_CARDS_OBJECT[cardId.toString().substring(4)];
};

export const getRandomMainDeck = () =>
  _.shuffle([
    ...POWERS_CARDS_IDS.map(id => 'one-' + id),
    ...POWERS_CARDS_IDS.map(id => 'two-' + id),
  ]);
