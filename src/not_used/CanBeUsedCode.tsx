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
