import { isEmpty, shuffle } from 'lodash';
import { changeElement } from '../backend/abilities';
import { attackAnimal, attackOwner, placeAnimalOnBoard, placeKingOnBoard } from '../backend/actions';
import { getItemsOnce } from '../backend/db';
import { getAnimalCard } from '../utils/helpers';
import { PlayerType } from '../utils/interface';
import { getBotDeck, getBotSlots, getElementfromDb, getPlayerSlots, getRoundNb } from './datafromDB';

const isKing = (cardId: string): boolean => {
	const KingIds = ['9-a', '13-a', '1-a', '5-a'];
	return KingIds.includes(cardId);
};

const playAnimalCardForBot = async (selectedCards: string[], gameId: string) => {
	const roundNb = await getRoundNb(gameId);
	const elementType = await getElementfromDb(gameId);
	if (roundNb === 2) {
		//round 2 the bot have no choice except placing three animals on board
		for (let i = 0; i < 3; i++) {
			if (selectedCards[i] !== undefined) {
				console.log(`Placing card ${selectedCards[i]} at slot ${i}`);
				await placeAnimalOnBoard(gameId, PlayerType.TWO, i, selectedCards[i], elementType);
			}
		}
	} else if (!isEmpty(selectedCards)) {
		const cardsToPlay = roundNb === 1 ? 3 : 2;
		const botSlots = await getBotSlots(gameId);
		let emptySlots = [];
		emptySlots = botSlots
			.map((slot: { cardId: string | undefined; canAttack: any }, index: number) => ({ slot, index }))
			.filter(({ slot }: any) => slot.cardId === 'empty')
			.map(({ index }: any) => index);
		for (let i = 0; i < Math.min(cardsToPlay, emptySlots.length); i++) {
			let cardPlaced = false;
			// Try to find an empty slot for the current card.
			for (let j = 0; j < 3 && !cardPlaced; j++) {
				if (botSlots[j].cardId == 'empty') {
					console.log(`Placing card ${selectedCards[i]} at slot ${j}`);
					await placeAnimalOnBoard(gameId, PlayerType.TWO, j, selectedCards[i], elementType);
					cardPlaced = true;
				} else {
					console.log('this slot is occupied');
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
const canPlayKing = async (gameId: string, botSlots: any, cardIds: string[]) => {
	const roundNB = await getRoundNb(gameId);
	if (roundNB > 2) {
		const isKingOnBoard = botSlots.some((slot: { cardId: string }) => isKing(slot.cardId));
		if (isKingOnBoard) {
			console.log('A king is already on the board.');
			return false; // King already present, do not play another
		}

		// Find all king cards in the bot's hand
		const kingCards = cardIds.filter(cardId => {
			return isKing(cardId);
		});
		// Check if there is at least one king card
		if (kingCards.length === 0) return false;

		// Check if there's an animal on the board with the same clan as any of the kings
		return botSlots.some((slot: { cardId: string | undefined }) => {
			if (slot.cardId === 'empty') return false;

			const slotCard = getAnimalCard(slot.cardId);
			return (
				slotCard &&
				kingCards.some(kingCardId => {
					const kingCard = getAnimalCard(kingCardId);
					return kingCard && kingCard.clan === slotCard.clan;
				})
			);
		});
	}
};

const playKingForBot = async (gameId: string) => {
	const roundNB = await getRoundNb(gameId);
	if (roundNB > 2) {
		const botSlots = await getBotSlots(gameId);
		const playerDeck = await getBotDeck(gameId);
		const canplayking = await canPlayKing(gameId, botSlots, playerDeck);
		if (!canplayking) {
			console.log("Bot couldn't play any king cards this turn.");
			return false;
		} else if (canplayking) {
			// Find all king cards in the bot's hand
			const kingCards = playerDeck.filter(isKing);
			// Iterate over all king cards to find a match on the board
			for (const kingCard of kingCards) {
				const kingClan = getAnimalCard(kingCard)?.clan;
				// Search for a board slot with an animal of the same clan as the king
				const filteredBotSlots = botSlots.filter(
					(slot: { cardId: string }) => slot !== undefined && slot.cardId !== undefined,
				);

				const slotIndexToSacrifice = filteredBotSlots.findIndex((slot: { cardId: string; canAttack: any }) => {
					const animal = getAnimalCard(slot.cardId);
					return animal && animal.clan === kingClan;
				});
				// Logic to sacrifice the animal and play the king goes here
				const elementType = await getElementfromDb(gameId);
				await placeKingOnBoard(
					gameId,
					PlayerType.TWO,
					kingCard,
					botSlots[slotIndexToSacrifice].cardId,
					slotIndexToSacrifice,
					elementType,
				);
				return true; // King was successfully played}
			}
		}
	}
};

const getDefendingAnimalIdAndSlot = async (
	gameId: string,
): Promise<{ animalDId: string; slotDNumber: number } | null> => {
	// Define the priority for the roles
	const rolePriority = ['king', 'attacker', 'joker', 'tank'];
	const slots = await getPlayerSlots(gameId);
	// Convert slots to a list of slots with their index
	const indexedSlots = slots.map((slot: any, index: any) => ({
		...slot,
		index,
	}));

	// Find the first slot that has an animal card and matches the role priority
	for (const role of rolePriority) {
		const foundSlot = indexedSlots.find((slot: { cardId: string | undefined; canAttack: any }) => {
			const animalCard = getAnimalCard(slot.cardId);
			return animalCard && animalCard.role === role;
		});

		if (foundSlot) {
			return { animalDId: foundSlot.cardId, slotDNumber: foundSlot.index };
		}
	}

	// Return null if no valid defending animal is found
	return null;
};

const botAttack = async (gameId: string) => {
	const roundNB = await getRoundNb(gameId);
	const elementType = await getElementfromDb(gameId);
	const BotSlots = await getBotSlots(gameId);
	if (roundNB > 2) {
		const slots = await getPlayerSlots(gameId);
		const ownerHasNoAnimals = slots.every((slot: { cardId: string }) => slot.cardId === 'empty');

		const player = await getItemsOnce('/games/' + gameId + '/two');
		if (player.canAttack && !ownerHasNoAnimals) {
			// Create an array to store animals that can attack
			const animalsThatCanAttack: any[] = [];
			// Add animals to the array based on priority
			BotSlots.forEach((slot: { cardId: string | undefined; canAttack: any }, index: any) => {
				const animalCard = getAnimalCard(slot.cardId);
				if (animalCard && slot.canAttack) {
					if (animalCard.role === 'king') {
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
					const envLoadNb = await getItemsOnce('/games/' + gameId + '/two/envLoadNb');
					const currentElement = await getElementfromDb(gameId);
					if (envLoadNb === 3 && animal?.clan !== currentElement) {
						changeElement(gameId, animal.clan, PlayerType.TWO);
					}
					await attackAnimal(gameId, PlayerType.TWO, animalToAttackWith.cardId, target.animalDId, target.slotDNumber);
					// If the attacking animal is a king and it's in its element, attempt to attack a second animal
					if (animal?.role === 'king' && elementType === animal.clan) {
						// Find a second target for the king to attack
						const secondTarget = await getDefendingAnimalIdAndSlot(gameId);
						if (secondTarget) {
							await attackAnimal(
								gameId,
								PlayerType.TWO,
								animalToAttackWith.cardId,
								secondTarget.animalDId,
								secondTarget.slotDNumber,
							);
						}
					}
				}
			}
		}
	} else console.log("the bot can't attack");
};

const attemptAttackplayer = async (gameId: string) => {
	//declare variable
	const botSlots = await getBotSlots(gameId);
	const playerSlots = await getPlayerSlots(gameId);
	const elementType = await getElementfromDb(gameId);
	// Check if the owner has less than 3 animals or no animals at all
	const ownerHasFewerThanThreeAnimals =
		playerSlots.filter((slot: { cardId: string | undefined; canAttack: any }) => slot.cardId !== 'empty').length < 3;
	const ownerHasNoAnimals = playerSlots.every(
		(slot: { cardId: string | undefined; canAttack: any }) => slot.cardId === 'empty',
	);
	if (ownerHasNoAnimals) {
		// Define the priority for the roles when the owner has no animals
		const rolePriority = ['king', 'attacker', 'tank', 'joker'];

		// Find the first animal that can attack based on the defined priority
		const attackerIndex = rolePriority
			.map(role =>
				botSlots.findIndex((slot: { cardId: string | undefined; canAttack: any }) => {
					const animalCard = getAnimalCard(slot.cardId);
					return animalCard && animalCard.role === role && slot.canAttack;
				}),
			)
			.find(index => index !== -1); // Find the first index that is not -1

		// If there's an attacker, perform attack on owner
		if (attackerIndex !== undefined) {
			const attackerSlot = botSlots[attackerIndex];
			if (attackerSlot.canAttack) {
				// Perform attack on owner
				await attackOwner(gameId, PlayerType.ONE, attackerSlot.cardId);
				return true;
			}
		} else return false;
	}
	// If the attacker in element can attack the owner, perform the attack
	else if (ownerHasFewerThanThreeAnimals) {
		// Find an attacker in element
		const attackerInElementIndex = botSlots.findIndex((slot: { cardId: string | undefined; canAttack: any }) => {
			const animal = getAnimalCard(slot.cardId);
			return animal && animal.role === 'attacker' && animal.clan === elementType;
		});
		if (attackerInElementIndex !== -1) {
			const attackerSlot = botSlots[attackerInElementIndex];

			// Perform attack on owner
			console.log(`Attacker ${attackerSlot.cardId} is attacking the owner`);
			await attackOwner(gameId, PlayerType.ONE, attackerSlot.cardId!);
			return true;
		} else return false;
	} else {
		console.log("the bot can't attack the player 1");
		return false;
	}
};

//this function can be used for next
export const setElementForBot = async (gameId: string): Promise<boolean> => {
	const rolePriority = ['king', 'joker', 'attacker', 'tank'];
	const botSlots = await getBotSlots(gameId);

	// Find the first animal on board that matches the priority and has a different element than the current one
	for (const role of rolePriority) {
		const slotIndex = botSlots.findIndex((slot: { cardId: string | undefined }) => {
			const animal = getAnimalCard(slot.cardId);
			return animal && animal.role === role;
		});

		if (slotIndex !== -1) {
			const animal = getAnimalCard(botSlots[slotIndex].cardId);
			// Change the element to the one that matches the first found priority animal
			console.log(`Changing element to ${animal!.clan} based on the ${role}`);
			const envLoadNb = await getItemsOnce('/games/' + gameId + '/two/envLoadNb');
			const currenntElement = await getElementfromDb(gameId);
			if (envLoadNb === 3 && animal?.clan !== currenntElement) {
				await changeElement(gameId, animal!.clan, PlayerType.TWO);
				return true;
			} else {
				return false;
			}
		}
	}
	return false;
};

export const executeBotTurn = async (gameId: string): Promise<void> => {
	const roundNB = await getRoundNb(gameId);
	const bot = await getItemsOnce('/games/' + gameId + '/two');
	const kingPlayed = await playKingForBot(gameId);
	const cardsToPick = roundNB === 2 ? 3 : kingPlayed ? 1 : 2;
	const allowedCardIds = ['10-a', '11-a', '12-a', '14-a', '15-a', '16-a', '2-a', '3-a', '4-a', '6-a', '7-a', '8-a'];

	const validCards = bot.cardsIds.filter((cardId: string) => allowedCardIds.includes(cardId));
	if (validCards.length) {
		let selectedCards: string[] = [];
		const shuffledValidCards = shuffle(validCards);
		selectedCards = shuffledValidCards.slice(0, cardsToPick);
		await playAnimalCardForBot(selectedCards, gameId);
	}
	if (bot.canAttack) {
		// await setElementForBot(gameId);
		const attempt = await attemptAttackplayer(gameId);
		if (!attempt) {
			await botAttack(gameId);
		}
	}
};
