import animalsCardsJson from '../assets/animal-cards.json';
import powerCardsJson from '../assets/power-cards.json';
import { AllCards } from '../components/Slots';
import { airColor, earthColor, fireColor, neutralColor, waterColor } from '../styles/Style';

export const SINGUP_PATH = '/signup';
export const SIGNIN_PATH = '/signin';
export const HOME_PATH = '/';
export const GAME_PATH = '/game/:id';

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

export enum PlayerType {
  ONE = 'one',
  TWO = 'two',
}

export interface Player {
  playerType: PlayerType;
  deckCardsIds: string[];
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

export const GeneralTestData = { roomId: 'test', playerName: 'test', playerType: 'one', playerId: 'testId' };
export const AnimalsGY = [];
export const PowersGY = [];

const getArrayFromJson = (file: any) => {
  const object = JSON.parse(JSON.stringify(file));
  return Object.keys(object).map(id => ({ id, ...object[id] }));
};

export const ALL_CARDS_OBJECT: Record<string, AllCards> = {
  ...JSON.parse(JSON.stringify(animalsCardsJson)),
  ...JSON.parse(JSON.stringify(powerCardsJson)),
};
export const ANIMALS_CARDS: AnimalCard[] = getArrayFromJson(animalsCardsJson);
export const ANIMAL_CARDS_OBJECT: Record<string, AnimalCard> = JSON.parse(JSON.stringify(animalsCardsJson));
export const POWER_CARDS_OBJECT: Record<string, Card> = JSON.parse(JSON.stringify(animalsCardsJson));
export const POWER_CARDS: Card[] = getArrayFromJson(powerCardsJson);
