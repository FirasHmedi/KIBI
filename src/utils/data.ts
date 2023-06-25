import { airColor, earthColor, fireColor, waterColor } from '../styles/Style';

export interface Card {
  id: string;
  content: string;
}

export const SINGUP_PATH = '/signup';
export const SIGNIN_PATH = '/signin';
export const HOME_PATH = '/';
export const GAME_PATH = '/game/:id';

export enum PlayerType {
  ONE = 'one',
  TWO = 'two',
}

export const ClansNames = ['water', 'earth', 'fire', 'air'];

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
};

export interface Card {
  id: string;
  ability?: string;
  description: string;
  name?: string;
}

export interface AnimalCard extends Card {
  clan: string;
  role: string;
}

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
