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
		const oppAnimal = getAnimalCard(opponentPSlots[i]?.cardId);
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
	playerType: 'one',
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
	*/

export {};
