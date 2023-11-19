import { isEmpty } from "lodash";
import { getBoardPath, getItemsOnce } from "../backend/db";
import { getAnimalCard, isAnimalCard, isAttacker, isKing } from "../utils/helpers";
import { getBotDeck, getBotSlots, getElementfromDb, getPlayerSlots } from "./datafromDB";


export const canAttackOwner = async (gameId:string) => {
    const playerSlots = await getPlayerSlots(gameId);
    const botSlots = await getBotSlots(gameId);
    const currentElement = await getElementfromDb(gameId);

    const playerBoardCondition = playerSlots.filter((slot: { cardId: string | undefined; }) => isAnimalCard(slot?.cardId)).length < 3;

    const botHasAttackerInElement = botSlots.some((slot: { cardId: string | undefined; }) => {
        const card = getAnimalCard(slot?.cardId);
        return card && card.role === 'attacker' && card.clan === currentElement;
    });

    return playerBoardCondition && botHasAttackerInElement;
};


export const canPlayResetBoardCard = async (gameId:string) => {
    const botSlots = await getBotSlots(gameId);
    const opponentSlots = await getPlayerSlots(gameId);

    const botHasNoAnimalsOnBoard = botSlots.every((slot: { cardId: string; }) => !isAnimalCard(slot?.cardId));

    const opponentHasAnimalsOnBoard = opponentSlots.some((slot: { cardId: string | undefined; }) => isAnimalCard(slot?.cardId));

    return botHasNoAnimalsOnBoard && opponentHasAnimalsOnBoard;
};

export const canPlayPlaceKingCard = async (gameId:string) => {
    const botSlots = await getBotSlots(gameId);
    const botDeck = await getBotDeck(gameId);

    const hasEmptySlot = botSlots.some((slot: { cardId: string | undefined; }) => !isAnimalCard(slot?.cardId));

    const hasKingInDeck = botDeck.some(isKing);

    const hasNoKingOnBoard = !botSlots.some((slot: { cardId: string | undefined; }) => isKing(slot?.cardId));

    return hasEmptySlot && hasKingInDeck && hasNoKingOnBoard;
};


export const canPlayReviveAnimalCard = async (gameId:string) => {
    const botSlots = await getBotSlots(gameId);
    const botDeck = await getBotDeck(gameId);
    const botGY = await getItemsOnce('/games/' + gameId + '/board/powerGY'); 
    const currentElement = await getElementfromDb(gameId);
    if(  !botGY || botGY === undefined||botGY.length === 0) return false;

    const hasEmptySlot = botSlots.some((slot: { cardId: string | undefined; }) => !isAnimalCard(slot?.cardId));

    const canReviveKing = hasEmptySlot && !botSlots.some((slot: { cardId: string | undefined; }) => isKing(slot?.cardId)) &&
                         botGY.some((card: string | undefined) => isKing(card) && getAnimalCard(card)?.clan === currentElement);

    const canReviveAttacker = hasEmptySlot && await canAttackOwner(gameId) &&
                              botGY.some((card: string | undefined) => isAttacker(card) && getAnimalCard(card)?.clan === currentElement);

    return (botSlots.every((slot: { cardId: string | undefined; }) => !isAnimalCard(slot?.cardId)) && botDeck.every((card: string | undefined) => !isAnimalCard(card)) && canReviveKing) ||
           canReviveKing || canReviveAttacker;
};


export const canPlayReviveLastPowerCard = async (gameId:string) => {
    const powerGY: string[] = await getItemsOnce(getBoardPath(gameId) + 'powerGY');
    if (powerGY === undefined)
    {return false;}
    console.log("in canPlayReviveLastPowerCard")
    console.log(powerGY);
	const lastPowerCard = powerGY[powerGY.length - 1];

    const eligiblePowerCards = ["one-2hp","one-block-pow","one-block-att","one-place-king","one-rev-any-anim-1hp","one-2-anim-gy", "one-draw-2","two-2hp","two-block-pow","two-block-att","two-place-king","two-rev-any-anim-1hp","two-2-anim-gy", "two-draw-2"];

    return eligiblePowerCards.includes(lastPowerCard) && !isEmpty(powerGY);
};

export const canPlayReviveAnyPowerCard = async (gameId:string) => {
    const powerCards = await getItemsOnce('/games/' + gameId + '/board/powerGY');
    const botSlots = await getBotSlots(gameId); 
    if (!powerCards) return false
    return powerCards.some((card: { type: any; hp: number; }) => {
        switch (card.type) {
            case 'one-steal-anim-3hp':
                return card.hp >= 7;
            case 'one-rev-any-anim-1hp':
                return card.hp >= 5;
            case 'one-2hp':
                return card.hp >= 2;
            case 'one-sacrif-anim-3hp':
                return card.hp >= 2 && botSlots.filter((slot: { cardId: string | undefined; }) => isAnimalCard(slot.cardId)).length >= 2;
            case 'one-block-att':
            case 'one-block-pow':
            case 'one-2-anim-gy':
            case 'draw-2':
                return true;
            default:
                return false;
        }
    });
};

export const canPlayStealAnimalCard = async (gameId:string) => {
    const botHP = await getItemsOnce('/games/' + gameId + '/board/two/hp'); 
    const botSlots = await getBotSlots(gameId);
    const opponentSlots = await getPlayerSlots(gameId);

    if (botHP < 6) {
        return false;
    }

    if (botSlots.some((slot: { cardId: string | undefined; }) => isKing(slot?.cardId))) {
        return false;
    }

    const opponentHasKing = opponentSlots.some((slot: { cardId: string | undefined; }) => isKing(slot?.cardId));

    const botHasNoAttacker = !botSlots.some((slot: { cardId: string | undefined; }) => isAttacker(slot?.cardId));
    const opponentHasAttacker = opponentSlots.some((slot: { cardId: string | undefined; }) => isAttacker(slot?.cardId));

    return opponentHasKing || (botHasNoAttacker && opponentHasAttacker);
};


export const canPlayPlaceTwoAnimalsCard = async (gameId: string) => {
    const botSlots = await getBotSlots(gameId);
    const botHP = await getItemsOnce('/games/' + gameId + '/board/two/hp'); 

    const hasTwoEmptySlots = botSlots.filter((slot: { cardId: string | undefined; }) => !isAnimalCard(slot?.cardId)).length >= 2;

    const hasMinimumHP = botHP >= 4;

    return hasTwoEmptySlots && hasMinimumHP;
};

const isTank = (cardId: string | undefined) => {
    const card = getAnimalCard(cardId);
    return card && card.role === 'tank';
};

export const canPlayDoubleApTankCard = async (gameId:string) => {
    const botSlots = await getBotSlots(gameId);
    const tankOnBoard = botSlots.some((slot: { cardId: string | undefined; }) => isTank(slot?.cardId));

    return tankOnBoard;
};

export const canPlaySwitchDeckCard = async (gameId:string) => {
    const botHP = await getItemsOnce('/games/' + gameId + '/board/two/hp'); 

    return botHP >= 4;
};

export const canPlaySacrificeAnimalCard = async (gameId:string) => {
    const botSlots = await getBotSlots(gameId);
    const botHP = await getItemsOnce('/games/' + gameId + '/board/two/hp');
    return botSlots !==undefined && botHP < 3
};

export const canPlayChargeTheElementCard = async (gameId:string) => {
    const currentElementValue = await getItemsOnce('/games/' + gameId + '/board/two/envLoadNb'); 
    return currentElementValue < 3;
};








