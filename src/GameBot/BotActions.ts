import { isEmpty, isNil, shuffle } from 'lodash';
import {
	attackOppAnimal,
	attackOwner,
	placeAnimalOnBoard,
	placeKingOnBoard,
} from '../backend/actions';
import { getItemsOnce } from '../backend/db';
import { changeElement } from '../backend/powers';
import { ANIMALS_POINTS, ATTACKER, EMPTY, JOKER, KING, TANK } from '../utils/data';
import { getAnimalCard, isAnimalCard } from '../utils/helpers';
import { PlayerType, SlotType } from '../utils/interface';
import {
	getBotDeck,
	getBotSlots,
	getElementFromDb,
	getPlayerSlots,
	getRoundNb,
} from './datafromDB';
import { playPowerCardForBot } from './playpowerCards';

export const isKing = (cardId: string): boolean => {
	const KingIds = ['9-a', '13-a', '1-a', '5-a'];
	return KingIds.includes(cardId);
};
function delay(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export const playAnimalCardForBot = async (selectedCards: string[], gameId: string) => {
	const roundNb = await getRoundNb(gameId);
	const elementType = await getElementFromDb(gameId);

	if (roundNb === 2) {
		for (let i = 0; i < 3; i++) {
			if (isAnimalCard(selectedCards[i])) {
				await placeAnimalOnBoard(gameId, PlayerType.TWO, i, selectedCards[i], elementType);
			}
		}
		return;
	}

	if (!isEmpty(selectedCards)) {
		const nbCardsToPlay = 2;
		let botSlots = ((await getBotSlots(gameId)) ?? []) as SlotType[];
		const emptySlots = botSlots.filter((slot: SlotType) => !isAnimalCard(slot?.cardId));

		for (let i = 0; i < Math.min(nbCardsToPlay, emptySlots.length); i++) {
			let cardPlaced = false;
			for (let j = 0; j < 3 && !cardPlaced; j++) {
				if (botSlots[j].cardId === EMPTY && isAnimalCard(selectedCards[i])) {
					await placeAnimalOnBoard(gameId, PlayerType.TWO, j, selectedCards[i], elementType);
					await delay(1000);
					cardPlaced = true;
					botSlots = await getBotSlots(gameId);
				}
			}
			if (!cardPlaced) {
				break;
			}
		}
	}
};

const canPlayKing = async (botSlots: SlotType[], cardIds: string[]) => {
	const isKingOnBoard = botSlots.some((slot: SlotType) => isKing(slot?.cardId));
	if (isKingOnBoard) {
		return false;
	}

	const kingCards = cardIds.filter(cardId => isKing(cardId));
	if (kingCards.length === 0) return false;

	return botSlots.some((slot: SlotType) => {
		if (!isAnimalCard(slot?.cardId)) return false;
		const slotCard = getAnimalCard(slot?.cardId);
		return (
			slotCard &&
			kingCards.some(kingCardId => {
				const kingCard = getAnimalCard(kingCardId);
				return kingCard && kingCard.clan === slotCard.clan;
			})
		);
	});
};

const playKingForBot = async (gameId: string) => {
	const roundNB = await getRoundNb(gameId);
	if (!roundNB || roundNB <= 2) {
		return false;
	}

	const botSlots = (await getBotSlots(gameId)) ?? [];
	const playerDeck = (await getBotDeck(gameId)) ?? [];
	const canplayKing = await canPlayKing(botSlots, playerDeck);
	if (!canplayKing) {
		return false;
	}

	const kingCards = playerDeck.filter(isKing);
	for (const kingCard of kingCards) {
		const kingClan = getAnimalCard(kingCard)?.clan;
		const filteredBotSlots = botSlots.filter((slot: SlotType) => slot && !isEmpty(slot?.cardId));
		const slotIndexToSacrifice = filteredBotSlots.findIndex((slot: SlotType) => {
			const animal = getAnimalCard(slot?.cardId);
			return animal && animal.clan === kingClan;
		});
		if (slotIndexToSacrifice !== -1) {
			await placeKingOnBoard(
				gameId,
				PlayerType.TWO,
				kingCard,
				botSlots[slotIndexToSacrifice]?.cardId,
				slotIndexToSacrifice,
			);
			return true;
		}
	}
	return false;
};

const getDefendingAnimalIdAndSlot = async (
	gameId: string,
	cardId: string,
): Promise<{ animalDId: string; slotDNumber: number } | null> => {
	const attacker = getAnimalCard(cardId);
	if (!attacker) {
		return null;
	}
	const attackerAP = ANIMALS_POINTS[attacker.role].ap;
	const rolePriority = [KING, ATTACKER, JOKER, TANK];
	const slots = await getPlayerSlots(gameId);
	const indexedSlots = slots.map((slot: any, index: any) => ({
		...slot,
		index,
	}));

	for (const role of rolePriority) {
		const foundSlot = indexedSlots.find((slot: SlotType) => {
			const defendingAnimal = getAnimalCard(slot?.cardId);
			return (
				defendingAnimal &&
				defendingAnimal.role === role &&
				ANIMALS_POINTS[defendingAnimal.role].hp <= attackerAP
			);
		});

		if (foundSlot) {
			return { animalDId: foundSlot?.cardId, slotDNumber: foundSlot.index };
		}
	}
	return null;
};

const botAttack = async (gameId: string) => {
	const roundNB = (await getRoundNb(gameId)) ?? 0;
	if (roundNB < 2) {
		return;
	}

	const slots = await getPlayerSlots(gameId);
	const ownerHasNoAnimals = slots?.every((slot: SlotType) => !isAnimalCard(slot?.cardId));
	const player = await getItemsOnce('/games/' + gameId + '/two');
	if (!player.canAttack || ownerHasNoAnimals) {
		return;
	}
	const BotSlots = (await getBotSlots(gameId)) ?? [];

	const kings: number[] = [];
	const attackers: number[] = [];
	const jokers: number[] = [];
	const tanks: number[] = [];

	BotSlots.forEach((slot: SlotType, index: number) => {
		const animalCard = getAnimalCard(slot?.cardId);
		if (animalCard && slot.canAttack) {
			switch (animalCard.role) {
				case KING:
					kings.push(index);
					break;
				case ATTACKER:
					attackers.push(index);
					break;
				case JOKER:
					jokers.push(index);
					break;
				case TANK:
					tanks.push(index);
			}
		}
	});

	const animalsThatCanAttack = [...kings, ...attackers, ...tanks, ...jokers];

	if (isEmpty(animalsThatCanAttack)) {
		return;
	}

	const slotIndexToAttackWith = animalsThatCanAttack[0];
	const animalToAttackWith = BotSlots[slotIndexToAttackWith];
	const target = await getDefendingAnimalIdAndSlot(gameId, animalToAttackWith.cardId);
	const animal = getAnimalCard(animalToAttackWith?.cardId);

	if (!target || !animal) {
		return;
	}

	const envLoadNb = await getItemsOnce('/games/' + gameId + '/two/envLoadNb');
	let currentElement = await getElementFromDb(gameId);
	if (envLoadNb === 1 && animal?.clan !== currentElement) {
		await changeElement(gameId, animal.clan, PlayerType.TWO);
		currentElement = animal.clan;
	}

	await attackOppAnimal(
		gameId,
		PlayerType.TWO,
		animalToAttackWith?.cardId,
		target.animalDId,
		target.slotDNumber,
	);
	if (animal?.role !== KING || currentElement !== animal.clan) {
		return;
	}
	const secondTarget = await getDefendingAnimalIdAndSlot(gameId, animalToAttackWith.cardId);
	if (!secondTarget) {
		return;
	}
	await attackOppAnimal(
		gameId,
		PlayerType.TWO,
		animalToAttackWith?.cardId,
		secondTarget.animalDId,
		secondTarget.slotDNumber,
	);
};

const attemptAttackPlayer = async (gameId: string) => {
	const botSlots = (await getBotSlots(gameId)) ?? [];
	const playerSlots = (await getPlayerSlots(gameId)) ?? [];
	const elementType = await getElementFromDb(gameId);
	const ownerHasFewerThanThreeAnimals =
		playerSlots.filter((slot: SlotType) => isAnimalCard(slot?.cardId)).length < 3;
	const ownerHasNoAnimals = playerSlots.every((slot: SlotType) => !isAnimalCard(slot?.cardId));
	if (ownerHasNoAnimals) {
		const rolePriority = [KING, ATTACKER, TANK, JOKER];
		const attackerIndex = rolePriority
			.map(role =>
				botSlots.findIndex((slot: SlotType) => {
					const animalCard = getAnimalCard(slot?.cardId);
					return animalCard && animalCard.role === role && slot.canAttack;
				}),
			)
			.find(index => index !== -1);

		if (!isNil(attackerIndex)) {
			const attackerSlot = botSlots[attackerIndex];
			if (attackerSlot.canAttack) {
				await attackOwner(gameId, PlayerType.ONE, attackerSlot?.cardId);
				return true;
			}
		} else return false;
	} else if (ownerHasFewerThanThreeAnimals) {
		const attackerInElementIndex = botSlots.findIndex((slot: SlotType) => {
			const animal = getAnimalCard(slot?.cardId);
			return animal && animal.role === ATTACKER && animal.clan === elementType;
		});
		if (attackerInElementIndex === -1) {
			return false;
		}
		const attackerSlot = botSlots[attackerInElementIndex];
		await attackOwner(gameId, PlayerType.ONE, attackerSlot?.cardId!);
		return true;
	} else {
		return false;
	}
};

export const executeBotTurn = async (gameId: string): Promise<void> => {
	const roundNB = await getRoundNb(gameId);
	let bot = await getItemsOnce('/games/' + gameId + '/two');
	const kingPlayed = await playKingForBot(gameId);
	let cardsToPick = roundNB > 2 ? 2 : 3;
	if (kingPlayed) cardsToPick--;

	if (roundNB > 2 && bot.canPlayPowers === true) {
		const isPowerCardPlayed = await playPowerCardForBot(gameId);
		if (isPowerCardPlayed) {
			cardsToPick--;
		}
	}

	bot = await getItemsOnce('/games/' + gameId + '/two');
	const allowedAnimalsCardIds = [
		'10-a',
		'11-a',
		'12-a',
		'14-a',
		'15-a',
		'16-a',
		'2-a',
		'3-a',
		'4-a',
		'6-a',
		'7-a',
		'8-a',
	];

	const validCards = (bot?.cardsIds ?? []).filter((cardId: string) =>
		allowedAnimalsCardIds.includes(cardId),
	);
	if (!isEmpty(validCards)) {
		const selectedCards: string[] = shuffle(validCards).slice(0, cardsToPick) ?? [];
		await playAnimalCardForBot(selectedCards, gameId);
	}

	if (bot?.canAttack) {
		const attempt = await attemptAttackPlayer(gameId);
		if (!attempt) {
			await botAttack(gameId);
		}
	}
};
