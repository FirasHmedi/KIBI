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
