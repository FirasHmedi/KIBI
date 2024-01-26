// Program for Elo Rating

// Function to calculate the Probability
function getProbabilityOfWinning(rating1: number, rating2: number) {
	return (1.0 * 1.0) / (1 + 1.0 * Math.pow(10, (1.0 * (rating1 - rating2)) / 400));
}

// Function to calculate Elo rating
// K is a constant.
export function getEloRating(oneScore: number, twoScore: number, isOneWon: boolean) {
	//K-factor, it will change dynamically in the future based on players rating
	const K = 50;

	// To calculate the Winning, Probability of Player B
	const POne = getProbabilityOfWinning(twoScore, oneScore);
	// To calculate the Winning, Probability of Player A
	const PTwo = getProbabilityOfWinning(oneScore, twoScore);

	// Case 1 When Player A wins, Updating the Elo Ratings
	if (isOneWon === true) {
		oneScore = oneScore + K * (1 - POne);
		twoScore = twoScore + K * (0 - PTwo);
	}
	// Case 2 When Player B wins, Updating the Elo Ratings
	else {
		oneScore = oneScore + K * (0 - POne);
		twoScore = twoScore + K * (1 - PTwo);
	}

	console.log('Updated Ratings:-');
	console.log('One score = ' + Math.floor(oneScore) + ' Two score = ' + Math.floor(twoScore));

	return {
		oneScore: Math.floor(oneScore),
		twoScore: Math.floor(twoScore),
	};
}

// Ra and Rb are current ELO ratings
const Ra = 1200;
const Rb = 1000;
const d = true;
