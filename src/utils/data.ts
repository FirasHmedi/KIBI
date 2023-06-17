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
    color: '#2980b9',
  },
  fire: {
    color: '#c0392b',
  },
  earth: {
    color: '#f39c12',
  },
  air: {
    color: '#2ecc71',
  },
};
