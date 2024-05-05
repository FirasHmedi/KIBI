import { NavigateFunction } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getItemsOnce, setItem } from '../backend/db';
import { GAMES_PATH, PREPARE } from './data';
import { distributeCards } from './helpers';
import { PlayerType, User } from './interface';

export const joinGameAsPlayerTwoImpl = async (
	gameId: string,
	initialHp: number,
	user: User,
	roundDuration: number,
	navigate: any,
) => {
	if (!initialHp || gameId.length === 0) return;

	const gameData = await getItemsOnce(GAMES_PATH + gameId);

	if (!gameData || gameData.two) {
		toast.error('Game is full or does not exist.', {
			position: toast.POSITION.TOP_RIGHT,
		});
		return;
	}

	let player2Id = user.id;

	await setItem(GAMES_PATH + gameId + '/two', {
		id: player2Id,
		hp: initialHp,
		playerName: user.userName,
		canAttack: true,
		canPlayPowers: true,
		status: PREPARE,
		envLoadNb: 0,
	});

	navigate('/game/' + gameId, {
		state: {
			gameId: gameId,
			playerName: user.userName,
			playerType: PlayerType.TWO,
			roundDuration,
		},
	});

	await distributeCards(gameId);
};

export const joinGameAsSpectatorImpl = async (
	gameId: string,
	roundDuration: number,
	navigate: NavigateFunction,
) => {
	if (gameId.length === 0) return;
	navigate('/game/' + gameId, {
		state: {
			gameId: gameId,
			spectator: true,
			playerType: PlayerType.TWO,
			roundDuration,
		},
	});
};

export const returnAsPlayerImpl = async (
	gameId: string,
	currentUser: any,
	roundDuration: number,
	navigate: NavigateFunction,
) => {
	const storedPlayerId = currentUser.id;
	const playerOneId = await getItemsOnce(GAMES_PATH + '/' + gameId + '/one/id');
	const playerTwoId = await getItemsOnce(GAMES_PATH + '/' + gameId + '/two/id');

	if (!playerOneId || !playerTwoId) {
		toast.error('Game does not exist or player is not initiated yet', {
			position: toast.POSITION.TOP_RIGHT,
		});
		return;
	}

	if (playerOneId === storedPlayerId) {
		navigate('/game/' + gameId, {
			state: {
				gameId: gameId,
				playerName: currentUser.userName,
				playerType: PlayerType.ONE,
				roundDuration,
			},
		});
	} else if (playerTwoId === storedPlayerId) {
		navigate('/game/' + gameId, {
			state: {
				gameId: gameId,
				playerName: currentUser.userName,
				playerType: PlayerType.TWO,
				roundDuration,
			},
		});
	} else {
		toast.error('Player ID does not match.', {
			position: toast.POSITION.TOP_RIGHT,
		});
	}
};
