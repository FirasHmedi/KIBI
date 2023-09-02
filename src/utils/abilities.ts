import _ from 'lodash';
import { activateJokerAbility, drawCardFromMainDeck, setEnvLoad } from './actions';
import { ClanName, EMPTY, NEUTRAL } from './data';
import { getBoardPath, getItemsOnce, getRoomPath, setItem } from './db';
import { getOpponentIdFromCurrentId, isAnimalCard } from './helpers';
import { PlayerType, SlotType } from './interface';
import {
	addAnimalToBoard,
	addAnimalToGraveYard,
	addCardsToPlayerDeck,
	addHpToPlayer,
	changeCanAttackVar,
	changeEnvUnitAction,
	changePLayerCards,
	changePLayerHealth,
	changeUsingPowerCardsVar,
	deleteAnimalCardFromGraveYardById,
	deleteAnimalCardsFromGraveYardByIds,
	deletePowerCardFromGraveYardById,
	getPLayerCards,
	getPLayerHealth,
	removeHpFromPlayer,
	removePlayerAnimalFromBoard,
} from './unitActions';

export const cancelAttacks = async (roomId: string, playerType: PlayerType) => {
	await changeCanAttackVar(roomId, playerType, false);
};

export const reviveLastPower = async (roomId: string, playerType: PlayerType) => {
	const powerGY: string[] = await getItemsOnce(getBoardPath(roomId) + 'powerGY');
	if (!_.isEmpty(powerGY)) {
		const lastPowerCardId = powerGY[powerGY.length - 1];
		await deletePowerCardFromGraveYardById(roomId, lastPowerCardId);
		await addCardsToPlayerDeck(roomId, playerType, [lastPowerCardId]);
	}
};

export const sacrifice2HpToReviveAnyAnimal = async (
	roomId: string,
	playerType: PlayerType,
	animalId?: string,
	slotNb?: number,
) => {
	if (!isAnimalCard(animalId) || _.isNil(slotNb)) return;
	await removeHpFromPlayer(roomId, playerType, 2);
	await deleteAnimalCardFromGraveYardById(roomId, animalId!);
	await addAnimalToBoard(roomId, playerType, slotNb, animalId!, true);
};

export const sacrifice3HpToSteal = async (
	roomId: string,
	playerType: PlayerType,
	animalId: string,
	oppSlotNb: number,
	mySlotNb: number,
) => {
	if (!animalId || _.isNil(mySlotNb) || _.isNil(oppSlotNb)) return;
	await removeHpFromPlayer(roomId, playerType, 3);
	await removePlayerAnimalFromBoard(roomId, getOpponentIdFromCurrentId(playerType), oppSlotNb);
	await addAnimalToBoard(roomId, playerType, mySlotNb, animalId, true);
	await activateJokerAbility(roomId, animalId, playerType);
};

export const sacrifice1HpToReviveLastAnimal = async (roomId: string, playerType: PlayerType, slotNb?: number) => {
	if (_.isNil(slotNb) || !playerType) return;
	await removeHpFromPlayer(roomId, playerType, 1);

	const animalGY = await getItemsOnce(getBoardPath(roomId) + 'animalGY');
	if (!_.isEmpty(animalGY)) {
		const lastAnimalCardId = animalGY[animalGY.length - 1];
		await deleteAnimalCardFromGraveYardById(roomId, lastAnimalCardId);
		await addAnimalToBoard(roomId, playerType, slotNb, lastAnimalCardId, true);
	}
};

export const switchHealth = async (roomId: string) => {
	const oneHp = await getPLayerHealth(roomId, 'one');
	const twoHp = await getPLayerHealth(roomId, 'two');
	await changePLayerHealth(roomId, 'one', twoHp);
	await changePLayerHealth(roomId, 'two', oneHp);
};

export const switchDeck = async (roomId: string) => {
	const oneCards = await getPLayerCards(roomId, 'one');
	const twoCards = await getPLayerCards(roomId, 'two');
	await changePLayerCards(roomId, 'one', twoCards);
	await changePLayerCards(roomId, 'two', oneCards);
};

export const changeEnv = async (roomId: string, envType: ClanName, playerType?: PlayerType) => {
	await changeEnvUnitAction(roomId, envType);
	if (playerType) {
		setEnvLoad(roomId, playerType, 0);
	}
};

export const sacrificeAnimalToGet3Hp = async (
	roomId: string,
	playerType: PlayerType,
	animalId?: string,
	slotNb?: number,
) => {
	if (!animalId || _.isNil(slotNb)) return;
	const isRemoved = await removePlayerAnimalFromBoard(roomId, playerType, slotNb);
	if (isRemoved) {
		await addAnimalToGraveYard(roomId, animalId);
		await addHpToPlayer(roomId, playerType, 3);
	}
};

export const shieldOwnerPlus2Hp = async (roomId: string, playerType: PlayerType) => {
	await addHpToPlayer(roomId, playerType, 2);
};

export const shieldOwnerPlus3Hp = async (roomId: string, playerType: PlayerType) => {
	await addHpToPlayer(roomId, playerType, 3);
};

export const draw2Cards = async (roomId: string, playerType: PlayerType) => {
	await drawCardFromMainDeck(roomId, playerType);
	await drawCardFromMainDeck(roomId, playerType);
};

export const sacrifice1HpToAdd2animalsFromGYToDeck = async (
	roomId: string,
	playerType: PlayerType,
	animalsIds: string[] = [],
) => {
	if (animalsIds.length != 2 && animalsIds.length != 1) return;
	await removeHpFromPlayer(roomId, playerType, 1);
	await deleteAnimalCardsFromGraveYardByIds(roomId, animalsIds);
	await addCardsToPlayerDeck(roomId, playerType, animalsIds);
};

export const cancelUsingPowerCards = async (roomId: string, playerType: PlayerType) => {
	await changeUsingPowerCardsVar(roomId, playerType, false);
};

export const returnOneAnimalFromGYToDeck = async (roomId: string, playerType: PlayerType, animalId?: string) => {
	if (!animalId) return;
	await deleteAnimalCardFromGraveYardById(roomId, animalId);
	await addCardsToPlayerDeck(roomId, playerType, [animalId]);
};

export const resetBoard = async (
	roomId: string,
	playerType: PlayerType,
	currentPSlots: SlotType[],
	opponentPSlots: SlotType[],
) => {
	for (let i = 0; i < 3; i++) {
		await removePlayerAnimalFromBoard(roomId, playerType, i);
		if (!_.isEmpty(currentPSlots[i].cardId) && currentPSlots[i].cardId !== EMPTY) {
			await addCardsToPlayerDeck(roomId, playerType, [currentPSlots[i].cardId]);
		}
	}
	for (let i = 0; i < 3; i++) {
		await removePlayerAnimalFromBoard(roomId, getOpponentIdFromCurrentId(playerType), i);
		if (!_.isEmpty(opponentPSlots[i].cardId) && opponentPSlots[i].cardId !== EMPTY) {
			await addCardsToPlayerDeck(roomId, getOpponentIdFromCurrentId(playerType), [opponentPSlots[i].cardId]);
		}
	}
	await changeEnv(roomId, NEUTRAL);
};

export const handleKingAbility = async (roomId: string, playerType: PlayerType, isDoubleAP: boolean) => {
	await setItem(getRoomPath(roomId) + playerType, { isDoubleAP });
};
