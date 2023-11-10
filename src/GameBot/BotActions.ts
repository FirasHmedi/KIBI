import { placeAnimalOnBoard, placeKingOnBoard } from "../backend/actions";
import { ClanName } from "../utils/data";
import { AnimalCard, Card, Player, PlayerType, SlotType } from "../utils/interface";
import { shuffle } from 'lodash';
import { getAnimalCard } from '../utils/helpers';


const isKing = (cardId: string): boolean => {
  const KingIds = ["9-a","13-a","1-a","5-a"]
  return KingIds.includes(cardId);
};



const playAnimalCardForBot = async (selectedCards: string[], gameId: string, elementType: ClanName | undefined, opponentPSlots: SlotType[], roundNb: Number) => {
if (roundNb===1)
{ //round 1 the bot have no choice except placing three animals on board
  for (let i = 0; i < 3; i++) {
    if (selectedCards[i] !== undefined) {
      console.log(`Placing card ${selectedCards[i]} at slot ${i}`);
      await placeAnimalOnBoard(gameId, PlayerType.TWO, i, selectedCards[i], elementType);
    }
  }
}
  else if (selectedCards.length){
    const cardsToPlay = roundNb === 1 ? 3 : 2;
    let emptySlots = [];
    emptySlots = opponentPSlots.map((slot, index) => ({ slot, index })).filter(({ slot }) => slot.cardId === 'empty').map(({ index }) => index);
        for (let i = 0; i < Math.min(cardsToPlay,emptySlots.length); i++) {
          
        let cardPlaced = false;
        // Try to find an empty slot for the current card.
        for (let j = 0; j < 3 && !cardPlaced; j++) {
                if(opponentPSlots[j].cardId == "empty"){
                  console.log(`Placing card ${selectedCards[i]} at slot ${j}`);
                  await placeAnimalOnBoard(gameId, PlayerType.TWO, j, selectedCards[i], elementType);
                  cardPlaced = true;
                }
                else {console.log("this slot is occupied")}              
        }
  
        // If no slot was found for the current card, break out of the loop.
        if (!cardPlaced) {
            console.log(`No empty slot found for card ${selectedCards[i]}`);
            break;
        }
    }
  }
}





//King checker
const canPlayKing = (opponentPSlots: SlotType[], cardIds: string[]) => {
const isKingOnBoard = opponentPSlots.some(slot => isKing(slot.cardId));

  if (isKingOnBoard) {
    console.log("A king is already on the board.");
    return false; // King already present, do not play another
  }

  // Find all king cards in the bot's hand
  const kingCards = cardIds.filter(cardId => {
    const card = getAnimalCard(cardId);
    return card && card.role === 'king';
  });

  // Check if there is at least one king card
  if (kingCards.length === 0 || opponentPSlots.length === 0) return false;

  // Check if there's an animal on the board with the same clan as any of the kings
  return opponentPSlots.some(slot => {
    if (slot.cardId === 'empty') return false;

    const slotCard = getAnimalCard(slot.cardId);
    return slotCard && kingCards.some(kingCardId => {
      const kingCard = getAnimalCard(kingCardId);
      return kingCard && kingCard.clan === slotCard.clan;
    });
  });
};





const playKingForBot = async (player: Player, opponentPSlots: SlotType[], gameId: string, elementType : ClanName | undefined ) => {
  if (!canPlayKing(opponentPSlots,player.cardsIds)) return false ;
  // Find all king cards in the bot's hand
  const kingCards = player.cardsIds.filter(isKing);

  // Iterate over all king cards to find a match on the board
  for (const kingCard of kingCards) {
    const kingClan = getAnimalCard(kingCard)?.clan;
    // Search for a board slot with an animal of the same clan as the king
    const slotIndexToSacrifice = opponentPSlots.findIndex(slot => {
      const animal = getAnimalCard(slot.cardId);
      return animal && animal.clan === kingClan;
    });
    // If found, play the king by sacrificing the matched animal
    if (slotIndexToSacrifice !== -1) {
      // Logic to sacrifice the animal and play the king goes here
      await placeKingOnBoard(gameId, PlayerType.TWO, kingCard, opponentPSlots[slotIndexToSacrifice].cardId,slotIndexToSacrifice, elementType );
      return true; // King was successfully played
    }
  }

  console.log("Bot couldn't play any king cards this turn.");
  return false; // No king was played
};









export const BotV0 = async (player: Player,gameId: string, elementType : ClanName | undefined ,opponentPSlots: SlotType[], roundNB:Number): Promise<void> => {
    const kingPlayed = await playKingForBot(player, opponentPSlots, gameId, elementType);
    console.log(kingPlayed);
    const cardsToPick = roundNB === 1 ? 3 : (kingPlayed ? 1 : 2);
    console.log("passed from here");
    const allowedCardIds = ['10-a', '11-a', '12-a', '14-a', '15-a', '16-a', '2-a', '3-a', '4-a', '6-a', '7-a', '8-a'];
    const validCards = player.cardsIds.filter(cardId => allowedCardIds.includes(cardId));
     if (validCards.length === 0) {
        console.log("No valid animal cards to play for the bot.");
        return;
      }
    let selectedCards: string[] = [];
    const shuffledValidCards = shuffle(validCards);
    selectedCards = shuffledValidCards.slice(0, cardsToPick);
    await playAnimalCardForBot(selectedCards, gameId,elementType,opponentPSlots,roundNB);


  };