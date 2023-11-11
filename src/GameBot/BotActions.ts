import {
  attackAnimal,
  attackOwner,
  placeAnimalOnBoard,
  placeKingOnBoard,
} from "../backend/actions";
import { ClanName } from "../utils/data";
import {
  Player,
  PlayerType,
  SlotType,
} from "../utils/interface";
import { shuffle } from "lodash";
import { getAnimalCard } from "../utils/helpers";
import { changeElement } from "../backend/abilities";
import { child, get, ref } from "firebase/database";
import { db } from "../firebase";

const isKing = (cardId: string): boolean => {
  const KingIds = ["9-a", "13-a", "1-a", "5-a"];
  return KingIds.includes(cardId);
};

const playAnimalCardForBot = async (
  selectedCards: string[],
  gameId: string,
  elementType: ClanName | undefined,
  opponentPSlots: SlotType[],
  roundNb: Number
) => {
  if (roundNb === 1) {
    //round 1 the bot have no choice except placing three animals on board
    for (let i = 0; i < 3; i++) {
      if (selectedCards[i] !== undefined) {
        console.log(`Placing card ${selectedCards[i]} at slot ${i}`);
        await placeAnimalOnBoard(
          gameId,
          PlayerType.TWO,
          i,
          selectedCards[i],
          elementType
        );
      }
    }
  } else if (selectedCards.length) {
    const cardsToPlay = roundNb === 1 ? 3 : 2;
    let emptySlots = [];
    emptySlots = opponentPSlots
      .map((slot, index) => ({ slot, index }))
      .filter(({ slot }) => slot.cardId === "empty")
      .map(({ index }) => index);
    for (let i = 0; i < Math.min(cardsToPlay, emptySlots.length); i++) {
      let cardPlaced = false;
      // Try to find an empty slot for the current card.
      for (let j = 0; j < 3 && !cardPlaced; j++) {
        if (opponentPSlots[j].cardId == "empty") {
          console.log(`Placing card ${selectedCards[i]} at slot ${j}`);
          await placeAnimalOnBoard(
            gameId,
            PlayerType.TWO,
            j,
            selectedCards[i],
            elementType
          );
          cardPlaced = true;
        } else {
          console.log("this slot is occupied");
        }
      }

      // If no slot was found for the current card, break out of the loop.
      if (!cardPlaced) {
        console.log(`No empty slot found for card ${selectedCards[i]}`);
        break;
      }
    }
  }
};

//King checker
const canPlayKing = (opponentPSlots: SlotType[], cardIds: string[]) => {
  const isKingOnBoard = opponentPSlots.some((slot) => isKing(slot.cardId));

  if (isKingOnBoard) {
    console.log("A king is already on the board.");
    return false; // King already present, do not play another
  }

  // Find all king cards in the bot's hand
  const kingCards = cardIds.filter((cardId) => {
    const card = getAnimalCard(cardId);
    return card && card.role === "king";
  });

  // Check if there is at least one king card
  if (kingCards.length === 0 || opponentPSlots.length === 0) return false;

  // Check if there's an animal on the board with the same clan as any of the kings
  return opponentPSlots.some((slot) => {
    if (slot.cardId === "empty") return false;

    const slotCard = getAnimalCard(slot.cardId);
    return (
      slotCard &&
      kingCards.some((kingCardId) => {
        const kingCard = getAnimalCard(kingCardId);
        return kingCard && kingCard.clan === slotCard.clan;
      })
    );
  });
};








const playKingForBot = async (
  player: Player,
  opponentPSlots: SlotType[],
  gameId: string,
  elementType: ClanName | undefined
) => {
  if (!canPlayKing(opponentPSlots, player.cardsIds)) return false;
  // Find all king cards in the bot's hand
  const kingCards = player.cardsIds.filter(isKing);

  // Iterate over all king cards to find a match on the board
  for (const kingCard of kingCards) {
    const kingClan = getAnimalCard(kingCard)?.clan;
    // Search for a board slot with an animal of the same clan as the king
    const slotIndexToSacrifice = opponentPSlots.findIndex((slot) => {
      const animal = getAnimalCard(slot.cardId);
      return animal && animal.clan === kingClan;
    });
    // If found, play the king by sacrificing the matched animal
    if (slotIndexToSacrifice !== -1) {
      // Logic to sacrifice the animal and play the king goes here
      await placeKingOnBoard(
        gameId,
        PlayerType.TWO,
        kingCard,
        opponentPSlots[slotIndexToSacrifice].cardId,
        slotIndexToSacrifice,
        elementType
      );
      return true; // King was successfully played
    }
  }

  console.log("Bot couldn't play any king cards this turn.");
  return false; // No king was played
};







const getSlotsAsArray = async (gameId: string): Promise<SlotType[]> => {
  const slotsSnapshot = await get(child(ref(db), `/games/${gameId}/board/one`));
  
  // Assuming each slot is stored as a property in the snapshot's data
  if (slotsSnapshot.exists()) {
    const slotsData = slotsSnapshot.val();
    // Convert the object to an array of SlotType
    return Object.values(slotsData) as SlotType[];
  } else {
    // Handle the case where there are no slots
    return [];
  }
};







const getDefendingAnimalIdAndSlot = async (
  gameId:string
): Promise<{ animalDId: string; slotDNumber: number } | null> => {
  // Define the priority for the roles
  const rolePriority = ["king", "attacker", "joker", "tank"];
  const slots = await getSlotsAsArray(gameId);
  // Convert slots to a list of slots with their index
  const indexedSlots = slots.map((slot, index) => ({ ...slot, index }));

  // Find the first slot that has an animal card and matches the role priority
  for (const role of rolePriority) {
    const foundSlot = indexedSlots.find((slot) => {
      const animalCard = getAnimalCard(slot.cardId);
      return animalCard && animalCard.role === role && slot.canAttack;
    });

    if (foundSlot) {
      return { animalDId: foundSlot.cardId, slotDNumber: foundSlot.index };
    }
  }

  // Return null if no valid defending animal is found
  return null;
};







const botAttack = async (
  Player: Player,
  BotSlots: SlotType[],
  opponentPSlots: SlotType[],
  roundNB: number,
  gameId: string,
  elementType: ClanName | undefined
) => {
  if (roundNB > 1) {
    // Assuming the bot can't attack in the first round
    const ownerHasNoAnimals = opponentPSlots.every(
      (slot) => slot.cardId === "empty"
    );

    if (Player.canAttack && !ownerHasNoAnimals) {
      // Create an array to store animals that can attack
      const animalsThatCanAttack: any[] = [];

      // Add animals to the array based on priority
      BotSlots.forEach((slot, index) => {
        const animalCard = getAnimalCard(slot.cardId);
        if (animalCard && slot.canAttack) {
          if (animalCard.role === "king") {
            animalsThatCanAttack.unshift(index); // King gets the highest priority
          } else {
            animalsThatCanAttack.push(index); // Other animals get lower priority
          }
        }
      });
      // Attack with the highest priority animal
      if (animalsThatCanAttack.length > 0) {
        const slotIndexToAttackWith = animalsThatCanAttack[0];
        const animalToAttackWith = BotSlots[slotIndexToAttackWith];
        const target = await getDefendingAnimalIdAndSlot(gameId);
        const animal = getAnimalCard(animalToAttackWith.cardId);

        if (target && animal) {
                  changeElement(gameId, animal.clan);

          await attackAnimal(
            gameId,
            PlayerType.TWO,
            animalToAttackWith.cardId,
            target.animalDId,
            target.slotDNumber
          );
          // If the attacking animal is a king and it's in its element, attempt to attack a second animal
          if (animal?.role === "king" && (elementType === animal.clan )) {
            // Find a second target for the king to attack
            const secondTarget = await getDefendingAnimalIdAndSlot(gameId);
            if (secondTarget) {
              await attackAnimal(
                gameId,
                PlayerType.TWO,
                animalToAttackWith.cardId,
                secondTarget.animalDId,
                secondTarget.slotDNumber
              );
            }
          }
        }
      }
    }
  } else console.log("the bot can't attack");
};





export const attemptAttackOnOwner = async (
  gameId: string,
  botSlots: SlotType[],
  ownerSlots: SlotType[],
  elementType: ClanName | undefined
): Promise<void> => {
  // Check if the owner has less than 3 animals or no animals at all
  const ownerHasFewerThanThreeAnimals =
    ownerSlots.filter((slot) => slot.cardId !== "empty").length < 3;
  const ownerHasNoAnimals = ownerSlots.every((slot) => slot.cardId === "empty");

  // Find an attacker in element
  const attackerInElementIndex = botSlots.findIndex((slot) => {
    const animal = getAnimalCard(slot.cardId);
    return animal && animal.role === "attacker" && animal.clan === elementType;
  });

  if (ownerHasNoAnimals) {
    // Find any animal that can attack
    const anyAttackerIndex = botSlots.findIndex(
      (slot) => getAnimalCard(slot.cardId) && slot.canAttack
    );
    if (anyAttackerIndex !== -1 && ownerHasNoAnimals) {
      const attackerSlot = botSlots[anyAttackerIndex];
      if (attackerSlot && attackerSlot.canAttack) {
        // Perform attack on owner
        await attackOwner(gameId, PlayerType.ONE, attackerSlot.cardId);
      }
    }
  }

  // If the attacker in element can attack the owner, perform the attack
  else if (ownerHasFewerThanThreeAnimals && attackerInElementIndex !== -1) {
    const attackerSlot = botSlots[attackerInElementIndex];
    if (attackerSlot && attackerSlot.canAttack) {
      // Perform attack on owner
      console.log(`Attacker ${attackerSlot.cardId} is attacking the owner`);
      await attackOwner(gameId, PlayerType.ONE, attackerSlot.cardId);
    } else {
      console.log("the bot can't attack the player 1");
    }
  }
};





//this function can be used for next 
export const setElementForBot = async (
  gameId: string,
  botSlots: SlotType[]
): Promise<boolean> => {
  // Define a priority list based on the roles
  const rolePriority = ["king", "joker", "attacker", "tank"];

  // Find the first animal on board that matches the priority and has a different element than the current one
  for (const role of rolePriority) {
    const slotIndex = botSlots.findIndex((slot) => {
      const animal = getAnimalCard(slot.cardId);
      return animal && animal.role === role;
    });

    if (slotIndex !== -1) {
      const animal = getAnimalCard(botSlots[slotIndex].cardId);
      if (animal) {
        // Change the element to the one that matches the first found priority animal
        console.log(`Changing element to ${animal.clan} based on the ${role}`);
        await changeElement(gameId, animal.clan);
        return true; // Return true to indicate that the element was changed
      }
    }
  }

  // If none of the priority animals are on board, no element change occurs
  return false;
};






export const BotV0 = async (
  player: Player,
  gameId: string,
  elementType: ClanName | undefined,
  opponentPSlots: SlotType[],
  roundNB: number,
  ownerSlots: SlotType[]
): Promise<void> => {
  const kingPlayed = await playKingForBot(
    player,
    opponentPSlots,
    gameId,
    elementType
  );
  const cardsToPick = roundNB === 1 ? 3 : kingPlayed ? 1 : 2;
  const allowedCardIds = ["10-a","11-a","12-a","14-a","15-a","16-a","2-a","3-a","4-a","6-a","7-a","8-a" ];
  const validCards = player.cardsIds.filter((cardId) =>
    allowedCardIds.includes(cardId)
  );
  if (validCards.length ) {
    let selectedCards: string[] = [];
    const shuffledValidCards = shuffle(validCards);
    selectedCards = shuffledValidCards.slice(0, cardsToPick);
    await playAnimalCardForBot(
      selectedCards,
      gameId,
      elementType,
      opponentPSlots,
      roundNB
    );
      }
  await attemptAttackOnOwner(gameId, opponentPSlots, ownerSlots, elementType);
  await botAttack(
    player,
    opponentPSlots,
    ownerSlots,
    roundNB,
    gameId,
    elementType
  );
};
