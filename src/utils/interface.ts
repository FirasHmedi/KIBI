import { ClanName, RoleName } from './data';

export interface Round {
  nb: number;
  player: PlayerType;
}
export interface Card {
  id: string;
  ability?: string;
  description?: string;
  name?: string;
}

export interface AnimalCard extends Card {
  clan: ClanName;
  role: RoleName;
}

export interface EnvCard {
  id: string;
  ability: ClanName;
  description?: string;
  name: string;
}

export const DefaultBoard = {
  mainDeck: [],
  currentPSlots: [],
  opponentPSlots: [],
  animalGY: [],
  powerGY: [],
  envType: 'neutral' as ClanName,
  activeCardId: undefined,
};

export enum PlayerType {
  ONE = 'one',
  TWO = 'two',
}

export interface Player {
  playerType?: PlayerType;
  cardsIds: string[];
  hp: number;
  status: string;
  playerName?: string;
  canPlayPowers: boolean;
  canAttack: boolean;
}

export interface Game {
  board: Board;
  status: string;
  one: Player;
  two: Player;
  round: Round;
}

export interface Board {
  mainDeck: string[];
  currentPSlots: SlotType[];
  opponentPSlots: SlotType[];
  one?: SlotType[];
  two?: SlotType[];
  animalGY: string[];
  powerGY: string[];
  envType?: ClanName;
  activeCardId?: string;
}

export interface SlotType {
  cardId: string;
  canAttack: boolean;
}

export type AllCards = AnimalCard | Card;
