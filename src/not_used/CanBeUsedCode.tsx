/* const canOtherAnimalsDefendKing = () => {
	const animal = getAnimalCard(idInCurrPSlot);
	if (animal?.role === ATTACKER && elementType === animal.clan) {
		return false;
	}
	const king = getAnimalCard(idInOppPSlot);
	if (!king || king?.role !== KING) {
		return false;
	}
	for (let i = 0; i < 3; i++) {
		const oppAnimal = getAnimalCard(oppPSlots[i]?.cardId);
		if (oppAnimal?.role !== king.role && king.clan === oppAnimal?.clan) {
			return true;
		}
	}
	return false;
}; */

/*
	"double-ap": {
		"description": "Double animals AP for 1 turn",
		"name": "Double animals AP for 1 turn"
	},
*/

/*
export const TestDeck = [
	{
		id: '1',
	},
	{
		id: '2',
	},
	{
		id: '3',
	},
];

export const GeneralTestData = {
	gameId: 'test',
	playerName: 'test',
	playerType: PlayerType.ONE,
	playerId: 'testId',
};
*/

/* export const activateTankAndAttackerAbilities = async (
	gameId: string,
	playerDType: PlayerType,
	slots: SlotType[] = [],
) => {
	const elementType = await getElementType(gameId);
	for (let i = 0; i < slots.length; i++) {
		const cardId = slots[i]?.cardId;
		if (!!cardId && isAnimalCard(cardId)) {
			const animal = getAnimalCard(cardId)!;
			if (animal?.role === TANK && animal?.clan === elementType) {
				await add1Hp(gameId, playerDType);
			}

			if (animal.role === ATTACKER && animal.clan === elementType) {
				await minus1Hp(gameId, getOpponentIdFromCurrentId(playerDType));
			}
		}
	}
}; */

/*
	const submitTestCards = async () => {
		if (myCards.length === 8) return;
		const cardsIds = (
			playerType === PlayerType.ONE
				? ANIMALS_CARDS.filter((_, index) => index >= 0 && index < 8)
				: ANIMALS_CARDS.filter((_, index) => index >= 8 && index < 16)
		).map(animal => animal.id);

		await setItem(getGamePath(gameId) + `${playerType}`, {
			cardsIds: cardsIds,
		});

		const playerToSelect = changePlayerToSelect ? playerType : getOpponentIdFromCurrentId(playerType);
		await setItem(getGamePath(gameId), {
			playerToSelect,
		});
	};

	<button
		style={{
			...buttonStyle,
			backgroundColor: playerToSelect !== playerType ? neutralColor : 'red',
			padding: 4,
			fontSize: 14,
		}}
		disabled={playerToSelect !== playerType}
		onClick={() => submitTestCards()}>
		TEST CHOOSE
	</button>
*/

/*
	"double-attacker-hp": {
		"description": "Double health points of an Attacker",
		"name": "Double HP of an Attacker"
	}

	export const doubleAttackerHP = async (gameId: string, playerType: PlayerType, attackerIdWithDoubleHP: string) => {
	await setItem(getGamePath(gameId) + playerType, { attackerIdWithDoubleHP });
};
*/

/*
<button
	style={{
		fontWeight: 'bold',
		color: !isAttackOwnerEnabled ? 'grey' : violet,
		...centerStyle,
	}}
	disabled={!isAttackOwnerEnabled}
	onClick={() => attackOppHp()}>
	<img
		src={SwordIcon}
		style={{
			width: 28,
			filter: !isAttackOwnerEnabled
				? 'invert(50%) sepia(0%) saturate(1120%) hue-rotate(152deg) brightness(101%) contrast(86%)'
				: undefined,
		}}></img>
	<PersonIcon style={{ width: '2vw', height: 'auto', color: !isAttackOwnerEnabled ? 'grey' : violet }} />
</button>
*/

/*

	"place-2-anim-1-hp": {
		"description": "Place 2 animals for 1hp",
		"name": "Place 2 animals for 1hp"
	},

	case 'place-2-anim-1-hp':
	await minus1Hp(gameId, playerType);
	setNbCardsToPlay(nbCardsToPlay => (nbCardsToPlay ?? 0) + 2);
	setTwoAnimalsToPlace(2);
	break;

	case 'place-2-anim-1-hp':
	const currPAnimals = currentPlayer.cardsIds.filter(id => isAnimalCard(id));
	if (currPAnimals.length < 2) return false;
	break;

	"steal-pow-2hp": {
	"description": "Sacrifice 2hp to steal power card from opponent deck, activate directly",
	"name": "Steal power card for 2hp"
	},

	if (isTank(slot.cardId)) {
		const tankId = await getItemsOnce(getGamePath(gameId) + playerType + '/tanksWithDoubleAP');
		if (tankId === slot.cardId) {
			await setItem(getGamePath(gameId) + playerType, { tanksWithDoubleAP: null });
		}
	}

	<SharedSelection
	playerType={playerType}
	gameId={gameId}
	oneCards={game?.one?.cardsIds ?? []}
	twoCards={game?.two?.cardsIds ?? []}
	playerToSelect={game?.playerToSelect}
	powerCards={game?.initialPowers}
	/>

	<button
		style={{
			fontWeight: 'bold',
			color: !isAttackEnabled ? 'grey' : violet,
			...centerStyle,
		}}
		id={tooltipId}
		disabled={!isAttackEnabled}
		onClick={() => attack()}>
		<FaPaw
			style={{ width: '2vw', height: 'auto', color: !isAttackEnabled ? 'grey' : violet }}
		/>
	</button>

	<div
		style={{
			...flexColumnStyle,
			justifyContent: 'center',
			position: 'absolute',
			right: '27vw',
			bottom: '34vh',
			gap: 40,
			width: '10vw',
		}}>
		{!isAttackEnabled && <Tooltip anchorSelect={`#${tooltipId}`} content={description} />}
	</div>

	const isAttackEnabled = false;
	const tooltipId = `can-attack-anchor`;
	const description =
		round.nb <= 2
			? 'Attacking is disabled in first turn'
			: !isMyRound
			? 'Not my round to attack'
			: !canAttack
			? 'Blocked from attacking'
			: "Animal is not selected or can't attack";

	"double-tanks-ap": {
		"description": "Double attack points of all Elephants",
		"name": "Double AP of all Elephants"
	}
		
className={
		slot?.hasAttacked ? (current ? 'up-transition' : 'down-transition') : undefined
	}
	
	const CanAttackIconsView = ({ slot }: { slot: SlotType }) => {
		const val = 24;
		return isAnimalCard(slot?.cardId) ? (
			slot?.canAttack ? (
				<img src={attIcon} style={{ width: val }}></img>
			) : (
				<img src={noAttIcon} style={{ width: 28 }}></img>
			)
		) : (
			<div style={{ height: val }} />
		);
	};

		"place-king": {
		"description": "Place an active king",
		"name": "Place a king on board"
	},


	"charge-element": {
		"description": "Charge the element",
		"name": "Charge the element"
	},

	const handlePlacingKing = async (
		cardId: string,
		slotNb: number,
		kingClan: ClanName,
	): Promise<void> => {
		const animalIdInSlotNb = currPSlots[slotNb!]?.cardId;
		const sacrificedAnimal = getAnimalCard(animalIdInSlotNb);

		if (!canPlaceKingWithoutSacrifice && sacrificedAnimal?.clan !== kingClan) {
			return;
		}

		if (canPlaceKingWithoutSacrifice) {
			await placeKingWithoutSacrifice(gameId, playerType, cardId, slotNb);
			setCanPlaceKingWithoutSacrifice(false);
		} else {
			await placeKingOnBoard(gameId, playerType, cardId, animalIdInSlotNb!, slotNb);
		}

		setNbCardsToPlay(nbCardsToPlay => (nbCardsToPlay > 1 ? nbCardsToPlay - 1 : 0));
	};

	"switch-2-cards": {
		"description": "Switch 2 cards with opponent",
		"name": "Switch 2 cards"
	},

	"steal-card-1hp": {
		"description": "Steal a card from opponent deck for 1hp",
		"name": "Steal Opponent card for 1hp",
		"gain": 0,
		"loss": 1
	}
	*/

export {};
