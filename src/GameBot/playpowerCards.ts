import { isEmpty, isNil } from "lodash";
import {
  cancelAttacks,
  cancelUsingPowerCards,
  doubleTankAP,
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
} from "../backend/abilities";
import { placeAnimalOnBoard, setElementLoad, setPowerCardAsActive } from "../backend/actions";
import { add2Hp, minus1Hp } from "../backend/animalsAbilities";
import { addPowerToGraveYard } from "../backend/unitActions";
import { EMPTY } from "../utils/data";
import {
  getOriginalCardId,
  getPowerCard,
  isAnimalCard,
  isKing,
  isTank,
} from "../utils/helpers";
import { PlayerType, SlotType } from "../utils/interface";
import {
  getBotDeck,
  getBotSlots,
  getElementfromDb,
  getPlayerDeck,
  getPlayerSlots,
} from "./datafromDB";
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
} from "./powerCardCheckers";
import { getBoardPath, getItemsOnce } from "../backend/db";
const getFirstTankId = (botSlots: SlotType[]) => {
  const tankSlot = botSlots.find(
    (slot) => slot && slot.cardId && isTank(slot.cardId)
  );

  return tankSlot ? tankSlot.cardId : "";
};

const getFirstEmptySlotIndex = (botSlots: SlotType[]) => {
  const emptySlotIndex = botSlots.findIndex((slot) => !slot || !slot.cardId);

  return emptySlotIndex;
};

const getFirstNonEmptySlotIndex = (playerSlots: SlotType[]) => {
  const nonEmptySlotIndex = playerSlots.findIndex(
    (slot) => slot && slot.cardId !== "empty"
  );
  console.log(nonEmptySlotIndex);

  return nonEmptySlotIndex;
};

const getFirstNonEmptySlotAndAnimalId = async (playerSlots: SlotType[]) => {
  const nonEmptySlotIndex = playerSlots.findIndex(
    (slot) => slot && slot.cardId
  );

  if (nonEmptySlotIndex === -1) {
    return -1;
  }

  return nonEmptySlotIndex;
};

const isPowerCardPlayable = async (cardId: string,gameId:string) => {
    const botDeck = await getBotDeck(gameId);
    const playerDeck = await getPlayerDeck(gameId);
    const powerGY: string[] = await getItemsOnce(getBoardPath(gameId) + 'powerGY');
    const bot = await getItemsOnce('/games/' + gameId + '/two');
    const botSlots = await getBotSlots(gameId);

    switch (getOriginalCardId(cardId!)) {
        case 'reset-board':
            if(bot.hp < 2 ) return false ;
            break;
        case 'place-king':
            if (!botDeck.some((cardId: any) => isKing(cardId)))return false;
            break;  
        case 'rev-any-anim-1hp':
            if (!powerGY||bot.hp < 2 || powerGY.length===0)return false;
            break;
        case "2-anim-gy":
            if (!powerGY || powerGY.length<2) return false;
            break;        
        case 'rev-last-pow':
            if (!powerGY || powerGY.length===0) return false;
            break;
        case 'rev-any-pow-1hp':
            if (!powerGY || powerGY.length===0 || bot.hp <2) return false;
            break;
        case 'steal-anim-3hp':
            if (bot.hp<4) return false;
            break;
        case 'place-2-anim-1-hp':
            const Animals = botDeck.filter((id: string) => isAnimalCard(id));
            if (Animals.length < 2 || !Animals) return false;
            break;
        case 'double-tank-ap':
            if (botSlots.find(
                (slot: { cardId: string | undefined; }) => slot && slot.cardId && isTank(slot.cardId)
              ))return false;
            break;
        case 'switch-2-randoms':
            if (!(botDeck.length >= 2 && playerDeck.length >= 2))return false;
            break;
        case "switch-decks":
            if (!(bot.hp >= 2 && playerDeck.length >= 1))return false;
            break;
        case 'sacrif-anim-3hp':
            if (botSlots.length===0 || !botSlots) return false;
            break;    
    }
    return true;
};

const getFirstKingIdInDeck = (botdeck: string []) => {
    // Trouver le premier "King" dans le deck
    const kingCard = botdeck.find(cardId => isKing(cardId));

    // Retourner l'ID du "King", ou null si aucun "King" n'est trouvé
    return kingCard ;
};

const playPowerCard = async (cardId: string, gameId: string) => {
  const botDeck = await getBotDeck(gameId);
  const botSlots = await getBotSlots(gameId);
  const playerSlots = await getPlayerSlots(gameId);
  const animalGY: string[] = await getItemsOnce(getBoardPath(gameId) + "animalGY");
  const powerGY: string[] = await getItemsOnce(getBoardPath(gameId) + "powerGY");
  const { name } = getPowerCard(cardId)!;

  await setPowerCardAsActive(gameId, PlayerType.TWO, cardId!, name!);
  console.log("executing power card");
  switch (getOriginalCardId(cardId!)) {
    case "block-att":
      await cancelAttacks(gameId, PlayerType.ONE);
      break;
    case "rev-last-pow":
      await reviveLastPower(gameId, PlayerType.TWO);
      // setNbCardsToPlay(nbCardsToPlay => nbCardsToPlay + 1);
      break;
    case "rev-any-pow-1hp":
      await reviveAnyPowerFor1hp(gameId, PlayerType.TWO, powerGY[0]);
      //setNbCardsToPlay(nbCardsToPlay => nbCardsToPlay + 1);
      break;
    case "rev-any-anim-1hp":
      const slotNbForRevive = getFirstEmptySlotIndex(botSlots);
      await sacrifice1HpToReviveAnyAnimal(
        gameId,
        PlayerType.TWO,
        animalGY[0],
        slotNbForRevive!
      );
      break;
    case "steal-anim-3hp":
      /*const slotNbForSteal = getFirstNonEmptySlotIndex(playerSlots);
      console.log(slotNbForSteal)
      console.log(playerSlots[slotNbForSteal][1])
      const slotNbforplacing = getFirstEmptySlotIndex(botSlots);
      console.log(slotNbforplacing)

      await sacrifice3HpToSteal(
        gameId,
        PlayerType.TWO,
        playerSlots[slotNbForSteal][1],
        slotNbForSteal,
        slotNbforplacing!
      );*/
      break;
    case "switch-decks":
      await minus1Hp(gameId, PlayerType.TWO);
      await switchDeck(gameId);
      break;
    case "switch-2-randoms":
      await switch2RandomCards(gameId);
      break;
    case "sacrif-anim-3hp":
      const selectedCurrPSlotNb = await getFirstNonEmptySlotAndAnimalId(botSlots);
      await sacrificeAnimalToGet3Hp(
        gameId,
        PlayerType.TWO,
        botSlots[selectedCurrPSlotNb][1],
        selectedCurrPSlotNb,
        await getElementfromDb(gameId)
      );
      break;
    case "2hp":
      await add2Hp(gameId, PlayerType.TWO);
      break;
    case "draw-2":
      await draw2Cards(gameId, PlayerType.TWO);
      break;
    case "2-anim-gy":
      await return2animalsFromGYToDeck(gameId, PlayerType.TWO, [
        animalGY[0],
        animalGY[1],
      ]);
      break;
    case "block-pow":
      await cancelUsingPowerCards(gameId, PlayerType.ONE);
      break;
    case "reset-board":
      await minus1Hp(gameId, PlayerType.TWO);
      await resetBoard(
        gameId,
        PlayerType.TWO,
        await getBotSlots(gameId),
        await getPlayerSlots(gameId)
      );
      break;
    case 'place-king':
        const king = getFirstKingIdInDeck(botDeck);
        const elementType = await getElementfromDb(gameId);
        await placeAnimalOnBoard(gameId, PlayerType.TWO, 0, king!, elementType);

           // setCanPlaceKingWithoutSacrifice(true);
            //setNbCardsToPlay(nbCardsToPlay => nbCardsToPlay + 1);
        break;
    case "double-tank-ap":
      const tankId = getFirstTankId(botSlots);
      await doubleTankAP(gameId, PlayerType.TWO, tankId);
      break;
    case "charge-element":
      await setElementLoad(gameId, PlayerType.TWO, 3);
      break;
    case "place-2-anim-1-hp":
      await minus1Hp(gameId, PlayerType.TWO);
      //problem
    
  }

  await addPowerToGraveYard(gameId, cardId!);
};
const getBotPowerCards = async (gameId: string) => {
  const powerIds = [
    "one-rev-last-pow",
    "one-rev-any-pow-1hp",
    "one-2hp",
    "one-block-att",
    "one-block-pow",
    "one-draw-2",
    "one-charge-element",
    "one-2-anim-gy",
    "one-rev-any-anim-1hp",
    "one-place-2-anim-1-hp",
    //"one-steal-anim-3hp",
    "one-double-tank-ap",
    "one-switch-2-randoms",
    "one-switch-decks",
    "one-sacrif-anim-3hp",
    "one-reset-board",
    "one-place-king",
    "two-rev-last-pow",
    "two-rev-any-pow-1hp",
    "two-2hp",
    "two-block-att",
    "two-block-pow",
    "two-draw-2",
    "two-charge-element",
    "two-2-anim-gy",
    "two-rev-any-anim-1hp",
    "two-place-2-anim-1-hp",
    //"two-steal-anim-3hp",
    "two-double-tank-ap",
    "two-switch-2-randoms",
    "two-switch-decks",
    "two-sacrif-anim-3hp",
    "two-reset-board",
    "two-place-king",
  ];

  const botDeck = await getBotDeck(gameId);
  const botPowerCards = botDeck.filter((card: string) =>
    powerIds.includes(card)
  );
  return botPowerCards;
};

const orderPowerCards = (powerCards: string[]) => {
  const powerIds = [
    "one-rev-last-pow",
    "one-rev-any-pow-1hp",
    "one-2hp",
    "one-block-att",
    "one-block-pow",
    "one-draw-2",
    "one-charge-element",
    "one-2-anim-gy",
    "one-rev-any-anim-1hp",
    "one-place-2-anim-1-hp",
    //"one-steal-anim-3hp",
    "one-double-tank-ap",
    "one-switch-2-randoms",
    "one-switch-decks",
    "one-sacrif-anim-3hp",
    "one-reset-board",
    "one-place-king",
    "two-rev-last-pow",
    "two-rev-any-pow-1hp",
    "two-2hp",
    "two-block-att",
    "two-block-pow",
    "two-draw-2",
    "two-charge-element",
    "two-2-anim-gy",
    "two-rev-any-anim-1hp",
    "two-place-2-anim-1-hp",
    //"two-steal-anim-3hp",
    "two-double-tank-ap",
    "two-switch-2-randoms",
    "two-switch-decks",
    "two-sacrif-anim-3hp",
    "two-reset-board",
    "two-place-king",
  ];

  const powerCardIdsSet = new Set(powerCards);

  const filteredPowerIds = powerIds.filter((id) => powerCardIdsSet.has(id));

  return filteredPowerIds;
};

export const playPowerCardForBot = async (gameId: any) => {
  const powerCards = await getBotPowerCards(gameId);
  const orderedPowerCards = orderPowerCards(powerCards);
  return await playPowerCardslogic(gameId, orderedPowerCards);
};

const playPowerCardslogic = async (gameId: string, PowerCards: string[]) => {
  const cardWithoutChecker = [
    "one-2hp",
    "one-block-att",
    "one-block-pow",
    "one-draw-2",
    "two-2hp",
    "two-block-att",
    "two-block-pow",
    "two-draw-2",
  ];
  if (!PowerCards || PowerCards.length === 0) {
    console.log("the gamebot has no powerCards to play");
    return false;
  } else {
    for (const cardId of PowerCards) {
      console.log(cardId);
      console.log(await isPowerCardPlayable(cardId,gameId));

      if (cardWithoutChecker.includes(cardId)) {
        playPowerCard(cardId, gameId);
        return true;
      } else {
        switch (getOriginalCardId(cardId)) {
          case "rev-last-pow":
            if (await canPlayReviveLastPowerCard(gameId) && await isPowerCardPlayable(cardId,gameId)) {
              await playPowerCard(cardId, gameId);
              return false;
            }
            break;
          case "rev-any-pow-1hp":
            if (await canPlayReviveAnyPowerCard(gameId) && await isPowerCardPlayable(cardId,gameId)) {
              await playPowerCard(cardId, gameId);
              return true;
            }
            break;
          case "charge-element":
            if (await canPlayChargeTheElementCard(gameId) && await isPowerCardPlayable(cardId,gameId)) {
              await playPowerCard(cardId, gameId);
              return true;
            }
            break;
          case "rev-any-anim-1hp":
            if (await canPlayReviveAnimalCard(gameId) && await isPowerCardPlayable(cardId,gameId)) {
              await playPowerCard(cardId, gameId);
              return false;
            }
            break;
          case "place-2-anim-1-hp":
            if (await canPlayPlaceTwoAnimalsCard(gameId) && await isPowerCardPlayable(cardId,gameId)) {
              await playPowerCard(cardId, gameId);
              return false;
              // a résoudre
            }
            break;
          case "steal-anim-3hp":
            if (await canPlayStealAnimalCard(gameId) && await isPowerCardPlayable(cardId,gameId)) {
              await playPowerCard(cardId, gameId);
              return true;
            }
            break;
          case "double-tank-ap":
            if (await canPlayDoubleApTankCard(gameId) && await isPowerCardPlayable(cardId,gameId)) {
              await playPowerCard(cardId, gameId);
              return true;
            }
            break;
          case "switch-decks":
            if (await canPlaySwitchDeckCard(gameId) && await isPowerCardPlayable(cardId,gameId)) {
              await playPowerCard(cardId, gameId);
              return true;
            }
            break;
          case "sacrif-anim-3hp":
            if (await canPlaySacrificeAnimalCard(gameId) && await isPowerCardPlayable(cardId,gameId)) {
              await playPowerCard(cardId, gameId);
              return true;
            }
            break;
          case "reset-board":
            if (await canPlayResetBoardCard(gameId) && await isPowerCardPlayable(cardId,gameId)) {
              await playPowerCard(cardId, gameId);
              return true;
            }
            break;
          case "place-king":
            if (await canPlayPlaceKingCard(gameId) && await isPowerCardPlayable(cardId,gameId)) {
              await playPowerCard(cardId, gameId);
              return false;
            }
            break;
          case "2-anim-gy":
            if (await isPowerCardPlayable(cardId,gameId))
             {await playPowerCard(cardId,gameId);
              return true;} 
            break;
          case "switch-2-randoms" : 
            if (await isPowerCardPlayable(cardId,gameId))
            { await playPowerCard(cardId,gameId);
              return true ;}
            break;
             
        }
      }
    }
    return false;
  }
};
