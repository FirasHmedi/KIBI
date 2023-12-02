import {ATTACKER, JOKER, KING, TANK} from "../utils/data";
import {getBotSlots, getElementFromDb} from "./datafromDB";
import {PlayerType, SlotType} from "../utils/interface";
import {getAnimalCard} from "../utils/helpers";
import {getItemsOnce} from "../backend/db";
import {changeElement} from "../backend/powers";

export const setElementForBot = async (gameId: string): Promise<boolean> => {
    const rolePriority = [KING, JOKER, ATTACKER, TANK];
    const botSlots = await getBotSlots(gameId);

    for (const role of rolePriority) {
        const slotIndex = botSlots.findIndex((slot: SlotType) => {
            const animal = getAnimalCard(slot?.cardId);
            return animal && animal.role === role;
        });

        if (slotIndex === -1) {
            continue;
        }

        const animal = getAnimalCard(botSlots[slotIndex]?.cardId);
        const envLoadNb = await getItemsOnce('/games/' + gameId + '/two/envLoadNb');
        const currentElement = await getElementFromDb(gameId);
        if (envLoadNb === 3 && animal?.clan !== currentElement) {
            await changeElement(gameId, animal!.clan, PlayerType.TWO);
            return true;
        } else {
            return false;
        }
    }
    return false;
};
const getFirstNonEmptySlotAndAnimalId = async (playerSlots: SlotType[]) => {
    const nonEmptySlotIndex = playerSlots.findIndex(slot => slot && slot.cardId);

    if (nonEmptySlotIndex === -1) {
        return -1;
    }

    return nonEmptySlotIndex;
};