import { isEmpty, isNil } from "lodash";
import { cancelAttacks, cancelUsingPowerCards, doubleTankAP, draw2Cards, resetBoard, return2animalsFromGYToDeck, reviveAnyPowerFor1hp, reviveLastPower, sacrifice1HpToReviveAnyAnimal, sacrifice3HpToSteal, sacrificeAnimalToGet3Hp, switch2RandomCards, switchDeck } from "../backend/abilities";
import { setElementLoad, setPowerCardAsActive } from "../backend/actions";
import { add2Hp, minus1Hp } from "../backend/animalsAbilities";
import { addPowerToGraveYard } from "../backend/unitActions";
import { EMPTY} from "../utils/data";
import { getOriginalCardId, getPowerCard, isAnimalCard, isTank } from "../utils/helpers";
import { PlayerType, SlotType } from "../utils/interface";
import { getBotDeck, getBotSlots, getElementfromDb, getPlayerDeck, getPlayerSlots } from "./datafromDB";
import { canPlayChargeTheElementCard, canPlayDoubleApTankCard, canPlayPlaceKingCard, canPlayPlaceTwoAnimalsCard, canPlayResetBoardCard, canPlayReviveAnimalCard, canPlayReviveAnyPowerCard, canPlayReviveLastPowerCard, canPlaySacrificeAnimalCard, canPlayStealAnimalCard, canPlaySwitchDeckCard } from "./powerCardCherkers";
import { getBoardPath, getItemsOnce } from "../backend/db";


const getFirstEmptySlotIndex = (botSlots : SlotType[]) => {
    const emptySlotIndex = botSlots.findIndex(slot => !slot || !slot.cardId);

    return emptySlotIndex;
};

const getFirstNonEmptySlotIndex = (playerSlots:SlotType[]) => {
    const nonEmptySlotIndex = playerSlots.findIndex(slot => slot && slot.cardId);

    return nonEmptySlotIndex;
};

const getFirstNonEmptySlotAndAnimalId = (playerSlots : SlotType[]) => {
    const nonEmptySlotIndex = playerSlots.findIndex(slot => slot && slot.cardId);

    if (nonEmptySlotIndex === -1) {
        return [-1, ""]; 
    }

    return [nonEmptySlotIndex, playerSlots[nonEmptySlotIndex].cardId];
};




const getRandomPowerCardFromGraveyard = (powerGraveyard: string[]) => {
    if (powerGraveyard.length === 0) {
        return null; // Retourner null si le cimetière est vide
    }

    const randomIndex = Math.floor(Math.random() * powerGraveyard.length);
    return powerGraveyard[randomIndex];
};

const isPowerCardPlayable = async (cardId: string,gameId:string) => {
    const botDeck = await getBotDeck(gameId);
    const playerDeck = await getPlayerDeck(gameId);
    const animalGY: string[] = await getItemsOnce(getBoardPath(gameId) + 'animalGY');
    const powerGY: string[] = await getItemsOnce(getBoardPath(gameId) + 'powerGY');

    switch (getOriginalCardId(cardId!)) {
        case 'rev-any-anim-1hp':
            const slotNbForRevive = getCurrSlotNb();
            if (isNil(slotNbForRevive) || isEmpty(animalGY)) return false;
            break;
        case 'steal-anim-3hp':
            const slotNbForSteal = getCurrSlotNb();
            if (
                isNil(slotNbForSteal) ||
                selectedOppSlotsNbs?.length != 1 ||
                !idsInOppPSlots[0] ||
                idsInOppPSlots[0] === EMPTY
            )
                return false;
            break;
        case 'sacrif-anim-3hp':
            if (isNil(selectedCurrPSlotNb) || idInCurrPSlot === EMPTY) return false;
            break;
        case '2-anim-gy':
            if (selectedGYAnimals?.length != 2) return false;
            break;
        case 'rev-any-pow-1hp':
            if (isEmpty(selectedGYPower) || selectedGYPower.length != 1) return false;
            break;
        case 'place-2-anim-1-hp':
            const currPAnimals = botDeck.filter((id: any) => isAnimalCard(id));
            if (currPAnimals.length < 2) return false;
            break;
        case 'switch-2-randoms':
            if (botDeck.length < 2 || playerDeck.length < 2) return false;
            break;
        case 'double-tank-ap':
            if (!isTank(idInCurrPSlot)) return false;
            break;
        case 'rev-last-pow':
            if (isEmpty(powerGY)) return false;
            break;
    }
    return true;
};

const playPowerCard = async (cardId: string,gameId:string) => {
    if (!isPowerCardPlayable(cardId,gameId)) {
        return false;
    }
    const botSlots = await getBotSlots(gameId);
    const playerSlots = await getPlayerSlots(gameId);
    const animalGY: string[] = await getItemsOnce(getBoardPath(gameId) + 'animalGY');
    const powerGY: string[] = await getItemsOnce(getBoardPath(gameId) + 'powerGY');

    const { name } = getPowerCard(cardId)!;

    await setPowerCardAsActive(gameId, PlayerType.TWO, cardId!, name!);
    console.log('executing power card');
    switch (getOriginalCardId(cardId!)) {
        case 'block-att':
            await cancelAttacks(gameId, PlayerType.ONE);
            break;
        case 'rev-last-pow':
            await reviveLastPower(gameId, PlayerType.TWO);
           // setNbCardsToPlay(nbCardsToPlay => nbCardsToPlay + 1);
            break;
        case 'rev-any-pow-1hp':
            await reviveAnyPowerFor1hp(gameId, PlayerType.TWO, powerGY[0]);
            //setNbCardsToPlay(nbCardsToPlay => nbCardsToPlay + 1);
            break;
        case 'rev-any-anim-1hp':
            const slotNbForRevive = getFirstEmptySlotIndex(botSlots);
            await sacrifice1HpToReviveAnyAnimal(gameId, PlayerType.TWO, animalGY![0], slotNbForRevive!);
            break;
        case 'steal-anim-3hp':
            const slotNbForSteal = getFirstNonEmptySlotIndex(playerSlots);
            await sacrifice3HpToSteal(gameId, PlayerType.TWO, idsInOppPSlots[0], selectedOppSlotsNbs[0]!, slotNbForSteal!);
            break;
        case 'switch-decks':
            await minus1Hp(gameId,PlayerType.TWO);
            await switchDeck(gameId);
            break;
        case 'switch-2-randoms':
            await switch2RandomCards(gameId);
            break;
        case 'sacrif-anim-3hp':
            const [selectedCurrPSlotNb,idInCurrPSlot] = getFirstNonEmptySlotAndAnimalId(botSlots)
            await sacrificeAnimalToGet3Hp(gameId, PlayerType.TWO, idInCurrPSlot, selectedCurrPSlotNb, await getElementfromDb(gameId));
            break;
        case '2hp':
            await add2Hp(gameId, PlayerType.TWO);
            break;
        case 'draw-2':
            await draw2Cards(gameId, PlayerType.TWO);
            break;
        case '2-anim-gy':
            await return2animalsFromGYToDeck(gameId, PlayerType.TWO, [animalGY[0],animalGY[1]]);
            break;
        case 'block-pow':
            await cancelUsingPowerCards(gameId, PlayerType.ONE);
            break;
        case 'reset-board':
            await minus1Hp(gameId, PlayerType.TWO);
            await resetBoard(gameId, PlayerType.TWO, await getBotSlots(gameId), await getPlayerSlots(gameId));
            break;
        case 'place-king':
            setCanPlaceKingWithoutSacrifice(true);
            setNbCardsToPlay(nbCardsToPlay => nbCardsToPlay + 1);
            break;
        case 'double-tank-ap':
            await doubleTankAP(gameId,PlayerType.TWO, idInCurrPSlot);
            break;
        case 'charge-element':
            await setElementLoad(gameId, PlayerType.TWO, 3);
            break;
        case 'place-2-anim-1-hp':
            await minus1Hp(gameId, PlayerType.TWO);
            setNbCardsToPlay(nbCardsToPlay => (nbCardsToPlay ?? 0) + 2);
            setTwoAnimalsToPlace(2);
            break;
    }

    await addPowerToGraveYard(gameId, cardId!);
};
const getBotPowerCards = async (gameId:string) => {
    const powerIds = [
        "rev-last-pow", "rev-any-pow-1hp", "2hp", "block-att", "block-pow", 
        "draw-2", "charge-element", "2-anim-gy", "rev-any-anim-1hp", 
        "place-2-anim-1-hp", "steal-anim-3hp", "double-tank-ap", 
        "switch-2-randoms", "switch-decks", "sacrif-anim-3hp", 
        "reset-board", "place-king"
    ];

    const botDeck = await getBotDeck(gameId);
    const botPowerCards = botDeck.filter((card: { id: string; }) => powerIds.includes(card.id)); // Filtrer les cartes en utilisant les IDs

    return botPowerCards;
};

const orderPowerCards = (powerCards:string[]) => {
    const powerIds = [
        "rev-last-pow", "rev-any-pow-1hp", "2hp", "block-att", "block-pow",
        "draw-2", "charge-element", "2-anim-gy", "rev-any-anim-1hp",
        "place-2-anim-1-hp", "steal-anim-3hp", "double-tank-ap",
        "switch-2-randoms", "switch-decks", "sacrif-anim-3hp",
        "reset-board", "place-king"
    ];

    // Créer un ensemble des identifiants des cartes dans powerCards
    const powerCardIdsSet = new Set(powerCards);

    // Filtrer powerIds pour garder seulement ceux qui sont présents dans powerCards
    const filteredPowerIds = powerIds.filter(id => powerCardIdsSet.has(id));

    return filteredPowerIds;
};


const playPowerCardForBot = async (gameId: any) => {
    const powerCards = await getBotPowerCards(gameId); // Récupérer les power cards du bot

    // Classer les cartes de power cards dans l'ordre spécifié
    const orderedPowerCards = orderPowerCards(powerCards);
    await playPowerCardslogic (gameId,orderedPowerCards)

    // Vérifier et jouer la première carte valide
    
};

const playPowerCardslogic=async (gameId : string, PowerCards : string[]) => {
    const cardWithoutChecker = ["2hp","block-att","block-pow","draw-2","2-anim-gy","switch-2-randoms"]
    if (!PowerCards || PowerCards.length===0){console.log ("the gamebot has no powerCards to play");}
    else{
    for (const cardId of PowerCards) {
        if (cardWithoutChecker.includes(cardId)) {
            // La carte n'a pas besoin de passer par un checker
        } else {

    switch (cardId) {
        

        case "rev-last-pow" :
            if (await canPlayReviveLastPowerCard(gameId)){
                await playPowerCard(cardId,gameId);
                return true;
            }
        case "rev-any-pow-1hp":
            if (await canPlayReviveAnyPowerCard(gameId)){
                await playPowerCard(cardId,gameId);
                return true;
            }
        case "charge-element" :
            if (await canPlayChargeTheElementCard(gameId)){
                await playPowerCard(cardId,gameId);
                return true;
            }
        case "rev-any-anim-1hp":
            if (await canPlayReviveAnimalCard(gameId)) {
                await playPowerCard(cardId,gameId);
                return true;
            }
        case "place-2-anim-1-hp" : 
            if (await canPlayPlaceTwoAnimalsCard(gameId)){
                await playPowerCard(cardId,gameId);
                return true;
            }
        case "steal-anim-3hp" :
            if (await canPlayStealAnimalCard(gameId)) {
                await playPowerCard(cardId,gameId);
                return true;
            }
        case "double-tank-ap" :
            if (await canPlayDoubleApTankCard(gameId)) {
                await playPowerCard(cardId,gameId);
                return true;
            }
        case "switch-decks" :
            if (await canPlaySwitchDeckCard(gameId)){
                await playPowerCard(cardId,gameId);
                return true;
            }
        case "sacrif-anim-3hp" :
            if (await canPlaySacrificeAnimalCard(gameId)) {
                await playPowerCard(cardId,gameId);
                return true;
            }
        case "reset-board" :
            if (await canPlayResetBoardCard(gameId)) {
                await playPowerCard(cardId,gameId);
                return true;
            }
        case "place-king" :
            if (await canPlayPlaceKingCard(gameId)) {
                await playPowerCard(cardId,gameId);
                return true;
            }
        
        default :return false;

    }
   
    

}
    }
}}