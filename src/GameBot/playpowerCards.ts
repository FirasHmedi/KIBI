import { isEmpty } from 'lodash';
import { setElementLoad, setPowerCardAsActive } from '../backend/actions';
import { add2Hp, minus1Hp, minus2Hp } from '../backend/animalsAbilities';
import { getBoardPath, getItemsOnce } from '../backend/db';
import {
	cancelAttacks,
	cancelUsingPowerCards,
	doubleTanksAP,
	draw2Cards,
	resetBoard,
	return2animalsFromGYToDeck,
	reviveAnyPowerFor1hp,
	reviveLastPower,
	sacrifice1HpToReviveAnyAnimal,
	sacrifice3HpToSteal,
	sacrificeAnimalToGet3Hp,
	switch2RandomCards,
	switchDeck,
} from '../backend/powers';
import { addPowerToGraveYard } from '../backend/unitActions';
import { EMPTY } from '../utils/data';
import { getOriginalCardId, getPowerCard, isKing, isTank } from '../utils/helpers';
import { PlayerType, SlotType } from '../utils/interface';
import { placeKingWithoutSacrifice } from './../backend/actions';
import {
	getBotDeck,
	getBotSlots,
	getElementFromDb,
	getPlayerDeck,
	getPlayerSlots,
} from './datafromDB';
import {
	canPlayChargeTheElementCard,
	canPlayDoubleApTankCard,
	canPlayPlaceKingCard,
	canPlayPlaceTwoAnimalsCard,
	canPlayResetBoardCard,
	canPlayReviveAnimalCard,
	canPlayReviveAnyPowerCard,
	canPlayReviveLastPowerCard,
	canPlaySacrificeAnimalCard,
	canPlayStealAnimalCard,
	canPlaySwitchDeckCard,
} from './powerCardCheckers';

const getFirstTankId = (botSlots: SlotType[]) => {
	const tankSlot = botSlots.find(slot => slot && slot.cardId && isTank(slot.cardId));

	return tankSlot ? tankSlot.cardId : '';
};

const getFirstEmptySlotIndex = (botSlots: SlotType[]) => {
	return botSlots.findIndex(slot => isEmpty(slot) || slot.cardId === EMPTY);
};

const getFirstNonEmptySlotIndex = (playerSlots: SlotType[]) => {
	return playerSlots.findIndex(slot => !isEmpty(slot) && slot.cardId !== EMPTY);
};

const isPowerCardPlayable = async (cardId: string, gameId: string) => {
	const botDeck = (await getBotDeck(gameId)) ?? [];
	const playerDeck = (await getPlayerDeck(gameId)) ?? [];
	const powerGY: string[] = (await getItemsOnce(getBoardPath(gameId) + 'powerGY')) ?? [];
	const animalGY: string[] = (await getItemsOnce(getBoardPath(gameId) + 'animalGY')) ?? [];
	const bot = await getItemsOnce('/games/' + gameId + '/two');
	const botSlots = (await getBotSlots(gameId)) ?? [];

	switch (getOriginalCardId(cardId!)) {
		case 'reset-board':
			if (bot.hp < 3) return false;
			break;
		case 'place-king':
			if (!botDeck.some((cardId: any) => isKing(cardId))) return false;
			break;
		case 'rev-any-anim-1hp':
			if (isEmpty(animalGY) || bot.hp < 2) return false;
			break;
		case '2-anim-gy':
			if (isEmpty(animalGY) || animalGY.length < 2) return false;
			break;
		case 'rev-last-pow':
			if (isEmpty(powerGY)) return false;
			break;
		case 'rev-any-pow-1hp':
			if (isEmpty(powerGY) || bot.hp < 2) return false;
			break;
		case 'steal-anim-3hp':
			const emptyBotSlots = getFirstEmptySlotIndex(botSlots);
			if (bot.hp < 4 && emptyBotSlots !== -1) return false;
			break;
		case 'switch-2-cards':
			if (botDeck.length < 2 || playerDeck.length < 2) return false;
			break;
		case 'switch-decks':
			if (bot.hp < 2 || playerDeck.length < 1) return false;
			break;
		case 'sacrif-anim-3hp':
			if (isEmpty(botSlots)) return false;
			break;
	}
	return true;
};

const getFirstKingIdInDeck = (botDeck: string[]) => {
	return botDeck.find(cardId => isKing(cardId));
};
const stealAnimalCardForBot = async (
	gameId: string,
	playerSlots: SlotType[],
	botSlots: SlotType[],
) => {
	const slotNbForSteal = getFirstNonEmptySlotIndex(playerSlots);
	const slotNbForPlacing = getFirstEmptySlotIndex(botSlots);
	const cardToSteal = playerSlots[slotNbForSteal].cardId;
	await sacrifice3HpToSteal(gameId, PlayerType.TWO, cardToSteal, slotNbForSteal, slotNbForPlacing);
};

const playPowerCard = async (cardId: string, gameId: string) => {
	const botDeck = (await getBotDeck(gameId)) ?? [];
	const botSlots = (await getBotSlots(gameId)) ?? [];
	const playerSlots = (await getPlayerSlots(gameId)) ?? [];
	const animalGY: string[] = (await getItemsOnce(getBoardPath(gameId) + 'animalGY')) ?? [];
	const powerGY: string[] = (await getItemsOnce(getBoardPath(gameId) + 'powerGY')) ?? [];

	const { name } = getPowerCard(cardId)!;
	await setPowerCardAsActive(gameId, PlayerType.TWO, cardId!, name!);
	switch (getOriginalCardId(cardId!)) {
		case 'block-att':
			await cancelAttacks(gameId, PlayerType.ONE);
			break;
		case 'rev-last-pow':
			await reviveLastPower(gameId, PlayerType.TWO);
			break;
		case 'rev-any-pow-1hp':
			await reviveAnyPowerFor1hp(gameId, PlayerType.TWO, powerGY[0]);
			break;
		case 'rev-any-anim-1hp':
			const slotNbForRevive = getFirstEmptySlotIndex(botSlots);
			await sacrifice1HpToReviveAnyAnimal(gameId, PlayerType.TWO, animalGY[0], slotNbForRevive!);
			break;
		case 'steal-anim-3hp':
			await stealAnimalCardForBot(gameId, playerSlots, botSlots);
			break;
		case 'switch-decks':
			await minus1Hp(gameId, PlayerType.TWO);
			await switchDeck(gameId);
			break;
		case 'switch-2-cards':
			await switch2RandomCards(gameId);
			break;
		case 'sacrif-anim-3hp':
			const selectedCurrPSlotNb = getFirstNonEmptySlotIndex(botSlots);

			const element = await getElementFromDb(gameId);
			await sacrificeAnimalToGet3Hp(
				gameId,
				PlayerType.TWO,
				botSlots[selectedCurrPSlotNb][1],
				selectedCurrPSlotNb,
				element,
			);
			break;
		case '2hp':
			await add2Hp(gameId, PlayerType.TWO);
			break;
		case 'draw-2':
			await draw2Cards(gameId, PlayerType.TWO);
			break;
		case '2-anim-gy':
			await return2animalsFromGYToDeck(gameId, PlayerType.TWO, [animalGY[0], animalGY[1]]);
			break;
		case 'block-pow':
			await cancelUsingPowerCards(gameId, PlayerType.ONE);
			break;
		case 'reset-board':
			await minus2Hp(gameId, PlayerType.TWO);
			await resetBoard(gameId, PlayerType.TWO, botSlots, playerSlots);
			break;
		case 'place-king':
			const king = getFirstKingIdInDeck(botDeck);
			const slot = getFirstEmptySlotIndex(botSlots);
			await placeKingWithoutSacrifice(gameId, PlayerType.TWO, king!, slot);
			break;
		case 'double-tanks-ap':
			await doubleTanksAP(gameId, PlayerType.TWO);
			break;
		case 'charge-element':
			await setElementLoad(gameId, PlayerType.TWO, 1);
			break;
	}

	await addPowerToGraveYard(gameId, cardId!);
};

const getBotPowerCards = async (gameId: string) => {
	const powerIds = [
		'one-rev-last-pow',
		'one-rev-any-pow-1hp',
		'one-2hp',
		'one-block-att',
		'one-block-pow',
		'one-draw-2',
		'one-charge-element',
		'one-2-anim-gy',
		'one-rev-any-anim-1hp',
		'one-steal-anim-3hp',
		'one-double-tanks-ap',
		'one-switch-2-cards',
		'one-switch-decks',
		'one-sacrif-anim-3hp',
		'one-reset-board',
		'one-place-king',
		'two-rev-last-pow',
		'two-rev-any-pow-1hp',
		'two-2hp',
		'two-block-att',
		'two-block-pow',
		'two-draw-2',
		'two-charge-element',
		'two-2-anim-gy',
		'two-rev-any-anim-1hp',
		'two-steal-anim-3hp',
		'two-double-tanks-ap',
		'two-switch-2-cards',
		'two-switch-decks',
		'two-sacrif-anim-3hp',
		'two-reset-board',
		'two-place-king',
	];

	const botDeck = await getBotDeck(gameId);
	return botDeck.filter((card: string) => powerIds.includes(card));
};

const orderPowerCards = (powerCards: string[]) => {
	const powerIds = [
		'one-rev-last-pow',
		'one-rev-any-pow-1hp',
		'one-2hp',
		'one-block-att',
		'one-block-pow',
		'one-draw-2',
		'one-charge-element',
		'one-2-anim-gy',
		'one-rev-any-anim-1hp',
		'one-double-tanks-ap',
		'one-switch-2-cards',
		'one-switch-decks',
		'one-sacrif-anim-3hp',
		'one-reset-board',
		'one-place-king',
		'two-rev-last-pow',
		'two-rev-any-pow-1hp',
		'two-2hp',
		'two-block-att',
		'two-block-pow',
		'two-draw-2',
		'two-charge-element',
		'two-2-anim-gy',
		'two-rev-any-anim-1hp',
		'two-place-2-anim-1-hp',
		'two-steal-anim-3hp',
		'two-steal-anim-3hp',
		'two-double-tanks-ap',
		'two-switch-2-cards',
		'two-switch-decks',
		'two-sacrif-anim-3hp',
		'two-reset-board',
		'two-place-king',
	];

	const powerCardIdsSet = new Set(powerCards);

	return powerIds.filter(id => powerCardIdsSet.has(id));
};

export const playPowerCardForBot = async (gameId: any) => {
	const powerCards = await getBotPowerCards(gameId);
	if (isEmpty(powerCards)) {
		return false;
	}
	const orderedPowerCards = orderPowerCards(powerCards);
	return await playPowerCardLogic(gameId, orderedPowerCards);
};

const playPowerCardLogic = async (gameId: string, powerCards: string[]) => {
	const cardWithoutChecker = [
		'one-2hp',
		'one-block-att',
		'one-block-pow',
		'one-draw-2',
		'two-2hp',
		'two-block-att',
		'two-block-pow',
		'two-draw-2',
	];

	for (const cardId of powerCards) {
		const isPowerCardPlayableVar = await isPowerCardPlayable(cardId, gameId);

		if (!isPowerCardPlayableVar) {
			continue;
		}

		if (cardWithoutChecker.includes(cardId)) {
			await playPowerCard(cardId, gameId);
			return true;
		}

		switch (getOriginalCardId(cardId)) {
			case 'rev-last-pow':
				if (await canPlayReviveLastPowerCard(gameId)) {
					await playPowerCard(cardId, gameId);
					return false;
				}
				break;
			case 'rev-any-pow-1hp':
				if (await canPlayReviveAnyPowerCard(gameId)) {
					await playPowerCard(cardId, gameId);
					return true;
				}
				break;
			case 'charge-element':
				if (await canPlayChargeTheElementCard(gameId)) {
					await playPowerCard(cardId, gameId);
					return true;
				}
				break;
			case 'rev-any-anim-1hp':
				if (await canPlayReviveAnimalCard(gameId)) {
					await playPowerCard(cardId, gameId);
					return false;
				}
				break;
			case 'place-2-anim-1-hp':
				if (await canPlayPlaceTwoAnimalsCard(gameId)) {
					await playPowerCard(cardId, gameId);
					return false;
				}
				break;
			case 'steal-anim-3hp':
				if (await canPlayStealAnimalCard(gameId)) {
					await playPowerCard(cardId, gameId);
					return true;
				}
				break;
			case 'double-tanks-ap':
				if (await canPlayDoubleApTankCard(gameId)) {
					await playPowerCard(cardId, gameId);
					return true;
				}
				break;
			case 'switch-decks':
				if (await canPlaySwitchDeckCard(gameId)) {
					await playPowerCard(cardId, gameId);
					return true;
				}
				break;
			case 'sacrif-anim-3hp':
				if (await canPlaySacrificeAnimalCard(gameId)) {
					await playPowerCard(cardId, gameId);
					return true;
				}
				break;
			case 'reset-board':
				if (await canPlayResetBoardCard(gameId)) {
					await playPowerCard(cardId, gameId);
					return true;
				}
				break;
			case 'place-king':
				if (await canPlayPlaceKingCard(gameId)) {
					await playPowerCard(cardId, gameId);
					return true;
				}
				break;
			case '2-anim-gy':
				await playPowerCard(cardId, gameId);
				return true;
			case 'switch-2-cards':
				await playPowerCard(cardId, gameId);
				return true;
		}
	}
	return false;
};
