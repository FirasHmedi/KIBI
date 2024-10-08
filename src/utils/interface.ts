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
	gain?: number;
	loss?: number;
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
	currPSlots: [],
	oppPSlots: [],
	animalGY: [],
	powerGY: [],
	elementType: 'neutral' as ClanName,
	activeCardId: undefined,
};

export enum PlayerType {
	ONE = 'one',
	TWO = 'two',
}

export interface User {
	id: string;
	userName: string;
	hash: string;
	score: number;
	wins: number;
	losses: number;
}

export interface Player {
	playerType?: PlayerType;
	cardsIds: string[];
	hp: number;
	status: string;
	playerName?: string;
	canPlayPowers: boolean;
	canAttack: boolean;
	isDoubleAP?: boolean;
	envLoadNb: number;
}

export interface Game {
	board: Board;
	status: string;
	one: Player;
	two: Player;
	round: Round;
	playerToSelect?: PlayerType;
	initialPowers?: string[];
	tmp?: any;
	winner?: PlayerType;
}

export interface Board {
	mainDeck: string[];
	currPSlots: SlotType[];
	oppPSlots: SlotType[];
	one?: SlotType[];
	two?: SlotType[];
	animalGY: string[];
	powerGY: string[];
	elementType?: ClanName;
	activeCardId?: string;
}

export interface SlotType {
	cardId: string;
	canAttack: boolean;
	hasAttacked?: boolean;
}

export type AllCards = AnimalCard | Card;
