import { isEmpty, isNil, shuffle } from 'lodash';
import { changeElement } from '../backend/abilities';
import { attackAnimal, attackOwner, placeAnimalOnBoard, placeKingOnBoard } from '../backend/actions';
import { getItemsOnce } from '../backend/db';
import { ANIMALS_POINTS, ATTACKER, JOKER, KING, TANK } from '../utils/data';
import { getAnimalCard, getOriginalCardId, isAnimalCard } from '../utils/helpers';
import { PlayerType, SlotType } from '../utils/interface';
import { getBotDeck, getBotSlots, getElementfromDb, getPlayerSlots, getRoundNb } from './datafromDB';
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
	const elementType = await getElementfromDb(gameId);

	if (roundNb === 2) {
		//round 2 the bot have no choice except placing three animals on board
		for (let i = 0; i < 3; i++) {
			if (isAnimalCard(selectedCards[i])) {
				console.log(`Placing card ${selectedCards[i]} at slot ${i}`);
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
			// Try to find an empty slot for the current card.
			for (let j = 0; j < 3 && !cardPlaced; j++) {
				if (botSlots[j].cardId === 'empty' && isAnimalCard(selectedCards[i])) {
					console.log(`Placing card ${selectedCards[i]} at slot ${j}`);
					await placeAnimalOnBoard(gameId, PlayerType.TWO, j, selectedCards[i], elementType);
					await delay(1000);
					cardPlaced = true;
					botSlots = await getBotSlots(gameId);
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
const canPlayKing = async (botSlots: SlotType[], cardIds: string[]) => {
	const isKingOnBoard = botSlots.some((slot: SlotType) => isKing(slot?.cardId));
	if (isKingOnBoard) {
		return false;
	}

	const kingCards = cardIds.filter(cardId => isKing(cardId));
	if (kingCards.length === 0) return false;

	// Check if there's an animal on the board with the same clan as any of the kings
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

	const botSlots = await getBotSlots(gameId) ?? [];
	const playerDeck = await getBotDeck(gameId) ?? [];
	const canplayking = await canPlayKing(botSlots, playerDeck);
	if (!canplayking) {
		console.log("Bot couldn't play any king cards this turn.");
		return false;
	}

	const kingCards = playerDeck.filter(isKing);
	// Iterate over all king cards to find a match on the board
	for (const kingCard of kingCards) {
		const kingClan = getAnimalCard(kingCard)?.clan;
		// Search for a board slot with an animal of the same clan as the king
		const filteredBotSlots = botSlots.filter((slot: SlotType) => slot && !isEmpty(slot?.cardId));

		const slotIndexToSacrifice = filteredBotSlots.findIndex((slot: SlotType) => {
			const animal = getAnimalCard(slot?.cardId);
			return animal && animal.clan === kingClan;
		});
		// Logic to sacrifice the animal and play the king goes here
		if(slotIndexToSacrifice!== -1)
		{
			await placeKingOnBoard(
				gameId,
				PlayerType.TWO,
				kingCard,
				botSlots[slotIndexToSacrifice]?.cardId,
				slotIndexToSacrifice,
			);
			return true; // King was successfully played
		}
		
	}
	return false;
};

const getDefendingAnimalIdAndSlot = async (
	gameId: string,cardId : string
): Promise<{ animalDId: string; slotDNumber: number } | null> => {
	const attacker = getAnimalCard(cardId);
	console.log(attacker);
	if(!attacker)
	{return null;}
	const attackerAP = ANIMALS_POINTS[attacker.role].ap;

	// Define the priority for the roles
	const rolePriority = [KING, ATTACKER, JOKER, TANK];
	const slots = await getPlayerSlots(gameId);
	// Convert slots to a list of slots with their index
	const indexedSlots = slots.map((slot: any, index: any) => ({
		...slot,
		index,
	}));

	// Find the first slot that has an animal card and matches the role priority
	for (const role of rolePriority) {
		const foundSlot = indexedSlots.find((slot: SlotType) => {
            const defendingAnimal = getAnimalCard(slot?.cardId);
            return defendingAnimal && defendingAnimal.role === role && ANIMALS_POINTS[defendingAnimal.role].hp <= attackerAP;
        });

		if (foundSlot) {
			return { animalDId: foundSlot?.cardId, slotDNumber: foundSlot.index };
		}
	}

	// Return null if no valid defending animal is found
	return null;
};



const botAttack = async (gameId: string) => {
	const roundNB = (await getRoundNb(gameId)) ?? 0;
	if (roundNB < 2) {
		console.log("the bot can't attack");
		return;
	}
	
	const slots = await getPlayerSlots(gameId);
	const ownerHasNoAnimals = slots.every((slot: SlotType) => !isAnimalCard(slot?.cardId));
	const player = await getItemsOnce('/games/' + gameId + '/two');
	console.log(player.canAttack);
	if (!player.canAttack || ownerHasNoAnimals) {
		console.log("bot can't attack");
		return;
	}
	const BotSlots = (await getBotSlots(gameId)) ?? [];

const kings: number[] = [];
const attackers: number[] = [];
const jokers: number[] = [];

// Parcourir chaque slot et classer les animaux
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
            // Ajoutez des cas supplémentaires ici si nécessaire
        }
    }
});

// Fusionner les tableaux dans l'ordre [KING, ATTACKER, ATTACKER, JOKER]
const animalsThatCanAttack = [...kings, ...attackers, ...jokers];

	if (isEmpty(animalsThatCanAttack)) {
		console.log("the bot haven't animals to attack with")
		return;
	}

	// Attack with the highest priority animal
	const slotIndexToAttackWith = animalsThatCanAttack[0];
	const animalToAttackWith = BotSlots[slotIndexToAttackWith];
	const target = await getDefendingAnimalIdAndSlot(gameId,animalToAttackWith.cardId);
	const animal = getAnimalCard(animalToAttackWith?.cardId);

	if (!target || !animal) {
		return;
	}

	const envLoadNb = await getItemsOnce('/games/' + gameId + '/two/envLoadNb');
	let currentElement = await getElementfromDb(gameId);
	if (envLoadNb === 3 && animal?.clan !== currentElement) {
		changeElement(gameId, animal.clan, PlayerType.TWO);
		currentElement = animal.clan;
	}

	await attackAnimal(gameId, PlayerType.TWO, animalToAttackWith?.cardId, target.animalDId, target.slotDNumber);
	// If the attacking animal is a king and it's in its element, attempt to attack a second animal
	if (animal?.role !== KING || currentElement !== animal.clan) {
		return;
	}
	// Find a second target for the king to attack
	const secondTarget = await getDefendingAnimalIdAndSlot(gameId,animalToAttackWith.cardId);
	if (!secondTarget) {
		return;
	}
	await attackAnimal(
		gameId,
		PlayerType.TWO,
		animalToAttackWith?.cardId,
		secondTarget.animalDId,
		secondTarget.slotDNumber,
	);
};

const attemptAttackplayer = async (gameId: string) => {
	//declare variable
	const botSlots = (await getBotSlots(gameId)) ?? [];
	const playerSlots = (await getPlayerSlots(gameId)) ?? [];
	const elementType = await getElementfromDb(gameId);
	// Check if the owner has less than 3 animals or no animals at all
	const ownerHasFewerThanThreeAnimals = playerSlots.filter((slot: SlotType) => isAnimalCard(slot?.cardId)).length < 3;
	const ownerHasNoAnimals = playerSlots.every((slot: SlotType) => !isAnimalCard(slot?.cardId));
	if (ownerHasNoAnimals) {
		const rolePriority = [KING, ATTACKER, TANK, JOKER];
		// Find the first animal that can attack based on the defined priority
		const attackerIndex = rolePriority
			.map(role =>
				botSlots.findIndex((slot: SlotType) => {
					const animalCard = getAnimalCard(slot?.cardId);
					return animalCard && animalCard.role === role && slot.canAttack;
				}),
			)
			.find(index => index !== -1);

		// If there's an attacker, perform attack on owner
		if (!isNil(attackerIndex)) {
			const attackerSlot = botSlots[attackerIndex];
			if (attackerSlot.canAttack) {
				await attackOwner(gameId, PlayerType.ONE, attackerSlot?.cardId);
				return true;
			}
		} else return false;
	}
	// If the attacker in element can attack the owner, perform the attack
	else if (ownerHasFewerThanThreeAnimals) {
		// Find an attacker in element
		const attackerInElementIndex = botSlots.findIndex((slot: SlotType) => {
			const animal = getAnimalCard(slot?.cardId);
			return animal && animal.role === ATTACKER && animal.clan === elementType;
		});
		if (attackerInElementIndex === -1) {
			return false;
		}
		const attackerSlot = botSlots[attackerInElementIndex];
		// Perform attack on owner
		console.log(`Attacker ${attackerSlot?.cardId} is attacking the owner`);
		await attackOwner(gameId, PlayerType.ONE, attackerSlot?.cardId!);
		return true;
	} else {
		console.log("the bot can't attack the player 1");
		return false;
	}
};

//this function can be used for next
export const setElementForBot = async (gameId: string): Promise<boolean> => {
	const rolePriority = [KING, JOKER, ATTACKER, TANK];
	const botSlots = await getBotSlots(gameId);

	// Find the first animal on board that matches the priority and has a different element than the current one
	for (const role of rolePriority) {
		const slotIndex = botSlots.findIndex((slot: SlotType) => {
			const animal = getAnimalCard(slot?.cardId);
			return animal && animal.role === role;
		});

		if (slotIndex === -1) {
			continue;
		}

		const animal = getAnimalCard(botSlots[slotIndex]?.cardId);
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
	return false;
};

export const executeBotTurn = async (gameId: string): Promise<void> => {
	const roundNB = await getRoundNb(gameId);
	const bot = await getItemsOnce('/games/' + gameId + '/two');
	const kingPlayed = await playKingForBot(gameId);
	let cardsToPick = roundNB > 2 ? 2 : 3;
	console.log(kingPlayed);
	if (kingPlayed) cardsToPick--;

	if (roundNB > 2 && bot.canPlayPowers === true) {
		const isPowerCardPlayed = await playPowerCardForBot(gameId);
		if (isPowerCardPlayed) {
			cardsToPick--;
		}
	}
	console.log('cardsToPick: ', cardsToPick);

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

	const validCards = (bot?.cardsIds ?? []).filter((cardId: string) => allowedAnimalsCardIds.includes(cardId));

	if (!isEmpty(validCards)) {
		const selectedCards: string[] = shuffle(validCards).slice(0, cardsToPick) ?? [];
		await playAnimalCardForBot(selectedCards, gameId);
	}

	if (bot?.canAttack) {
		const attempt = await attemptAttackplayer(gameId);
		if (!attempt) {
			await botAttack(gameId);
		}
	}
};
