import shuffle from 'lodash/shuffle';
import { useEffect, useState } from 'react';
import { MdComputer, MdPerson, MdVisibility } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getItemsOnce, setItem, subscribeToItems } from '../../backend/db';

import { isEmpty, orderBy } from 'lodash';
import { VscDebugContinue } from 'react-icons/vsc';
import { Tooltip } from 'react-tooltip';
import short from 'short-uuid';
import { Seperator } from '../../components/Elements';
import {
	buttonStyle,
	centerStyle,
	flexColumnStyle,
	flexRowStyle,
	homeButtonsStyle,
	violet,
} from '../../styles/Style';
import { BOT, CONNECT_PATH, EMPTY_SLOT, GAMES_PATH, PREPARE, RUNNING } from '../../utils/data';
import {
	distributeCards,
	getMainDeckFirstHalf,
	getMainDeckSecondHalf,
	isNotEmpty,
	isUserConnected,
	submitRandomSelection,
	submitRandomSelectionforBot,
} from '../../utils/helpers';
import { PlayerType, User } from '../../utils/interface';

function Home() {
	const navigate = useNavigate();
	const [gameId, setGameId] = useState('');
	const [disabledButton, setDisabledButton] = useState(false);
	const [alertMessage, setAlertMessage] = useState('');
	const [currentUser, setCurrentUser] = useState<User>();
	const [leaderBoard, setLeaderBoard] = useState<any[]>();
	const [INITIAL_HP, setINITIAL_HP] = useState(0);
	const [ROUND_DURATION, setROUND_DURATION] = useState(0);

	const setUser = async () => {
		const user = await isUserConnected();
		if (isNotEmpty(user.userName)) {
			setCurrentUser(user);
			return;
		}
		setCurrentUser(undefined);
	};

	const setLeaderBoardAfterCalc = async (users: any = {}) => {
		users = Object.values(users).map(({ score, wins, losses, userName }: any) => ({
			score,
			wins,
			losses,
			userName,
		}));
		users = orderBy(users, ['score'], ['desc']);
		setLeaderBoard(users);
	};

	const subscribeToUsers = async () => {
		await subscribeToItems('users', setLeaderBoardAfterCalc);
	};

	const getConstants = async () => {
		const constants = await getItemsOnce('constants');
		setINITIAL_HP(constants.INITIAL_HP);
		setROUND_DURATION(constants.ROUND_DURATION);
	};

	useEffect(() => {
		getConstants();
		setUser();
		subscribeToUsers();
	}, []);

	const createGame = async () => {
		if (!INITIAL_HP) return;
		if (isEmpty(currentUser)) {
			navigate(CONNECT_PATH);
			return;
		}

		const gameId = short.generate().slice(0, 6);
		const mainDeck: string[] = shuffle([...getMainDeckFirstHalf(), ...getMainDeckSecondHalf()]);
		const initialPowers = mainDeck.splice(-4, 4);

		let player1Id = currentUser.id;

		await setItem(GAMES_PATH + gameId, {
			status: PREPARE,
			one: {
				id: player1Id,
				hp: INITIAL_HP,
				playerName: currentUser.userName,
				canAttack: true,
				canPlayPowers: true,
				status: PREPARE,
				envLoadNb: 0,
			},
			board: {
				mainDeck,
				one: [EMPTY_SLOT, EMPTY_SLOT, EMPTY_SLOT],
				two: [EMPTY_SLOT, EMPTY_SLOT, EMPTY_SLOT],
			},
			playerToSelect: PlayerType.ONE,
			initialPowers: initialPowers,
		});

		setDisabledButton(true);

		await submitRandomSelection(gameId, initialPowers);

		await setItem(GAMES_PATH + gameId, {
			status: RUNNING,
			round: {
				player: PlayerType.ONE,
				nb: 1,
			},
		});

		navigate('/game/' + gameId, {
			state: {
				gameId: gameId,
				playerName: currentUser.userName,
				playerType: PlayerType.ONE,
				ROUND_DURATION,
			},
		});
	};

	const playWithGameBot = async () => {
		if (!INITIAL_HP) return;
		const gameId = short.generate().slice(0, 6);
		const mainDeck: string[] = shuffle([...getMainDeckFirstHalf(), ...getMainDeckSecondHalf()]);
		const initialPowers = mainDeck.splice(-4, 4);

		await setItem(GAMES_PATH + gameId, {
			status: PREPARE,
			one: {
				hp: INITIAL_HP,
				playerName: currentUser?.userName ?? 'Anonymous',
				canAttack: true,
				canPlayPowers: true,
				status: PREPARE,
				envLoadNb: 0,
			},
			board: {
				mainDeck,
			},
			playerToSelect: PlayerType.ONE,
			initialPowers: initialPowers,
		});

		if (gameId.length === 0) return;

		await setItem(GAMES_PATH + gameId + '/two', {
			hp: INITIAL_HP,
			playerName: BOT,
			canAttack: true,
			canPlayPowers: true,
			status: PREPARE,
			envLoadNb: 0,
		});

		await submitRandomSelectionforBot(gameId, initialPowers);
		setDisabledButton(true);

		await setItem(GAMES_PATH + gameId, {
			status: RUNNING,
			round: {
				player: PlayerType.ONE,
				nb: 1,
			},
		});

		navigate('/game/' + gameId, {
			state: {
				gameId: gameId,
				playerName: currentUser?.userName ?? 'Anonymous',
				playerType: PlayerType.ONE,
				ROUND_DURATION,
			},
		});
		await distributeCards(gameId);
	};

	const joinGameAsPlayer = async () => {
		if (!INITIAL_HP) return;
		if (gameId.length === 0) return;

		if (isEmpty(currentUser)) {
			navigate(CONNECT_PATH);
			return;
		}

		const gameData = await getItemsOnce(GAMES_PATH + gameId);

		if (!gameData || gameData.two) {
			toast.error('Game is full or does not exist.', {
				position: toast.POSITION.TOP_RIGHT,
			});
			return;
		}

		let player2Id = currentUser.id;

		await setItem(GAMES_PATH + gameId + '/two', {
			id: player2Id,
			hp: INITIAL_HP,
			playerName: currentUser.userName,
			canAttack: true,
			canPlayPowers: true,
			status: PREPARE,
			envLoadNb: 0,
		});
		setDisabledButton(true);
		navigate('game/' + gameId, {
			state: {
				gameId: gameId,
				playerName: currentUser.userName,
				playerType: PlayerType.TWO,
				ROUND_DURATION,
			},
		});
		await distributeCards(gameId);
	};

	const joinGameAsSpectator = async () => {
		if (gameId.length === 0) return;
		setDisabledButton(true);
		navigate('game/' + gameId, {
			state: {
				gameId: gameId,
				spectator: true,
				playerType: PlayerType.TWO,
				ROUND_DURATION,
			},
		});
	};

	const returnAsPlayer = async () => {
		if (isEmpty(currentUser)) {
			navigate(CONNECT_PATH);
			return;
		}

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
			navigate('game/' + gameId, {
				state: {
					gameId: gameId,
					playerName: currentUser.userName,
					playerType: PlayerType.ONE,
					ROUND_DURATION,
				},
			});
		} else if (playerTwoId === storedPlayerId) {
			navigate('game/' + gameId, {
				state: {
					gameId: gameId,
					playerName: currentUser.userName,
					playerType: PlayerType.TWO,
					ROUND_DURATION,
				},
			});
		} else {
			toast.error('Player ID does not match.', {
				position: toast.POSITION.TOP_RIGHT,
			});
		}
	};
	return (
		<>
			<ToastContainer />
			<div
				style={{
					display: 'flex',
					height: '100%',
					width: '100%',
					justifyContent: 'center',
					alignItems: 'center',
				}}>
				<div
					style={{
						...flexColumnStyle,
						gap: 20,
						alignItems: 'flex-start',
					}}>
					<div style={{ ...centerStyle, gap: 15 }}>
						<h3 style={{ color: violet }}>Create a game</h3>
						{alertMessage && (
							<div style={{}}>
								{alertMessage}
								<button onClick={() => setAlertMessage('')}>Close</button>
							</div>
						)}
						<button
							style={{
								...buttonStyle,
								...homeButtonsStyle,
							}}
							disabled={false}
							onClick={() => createGame()}>
							<MdPerson />
						</button>
						<button
							style={{
								...buttonStyle,
								...homeButtonsStyle,
							}}
							disabled={disabledButton}
							onClick={playWithGameBot}>
							<MdComputer />
						</button>
					</div>
					<Seperator h='1vh' />
					<div style={centerStyle}>
						<h3 style={{ color: violet }}>Join</h3>
						<input
							type='text'
							placeholder='Game Id'
							required
							style={{
								padding: 10,
								margin: 10,
								width: '14vw',
								height: '2vh',
								borderRadius: 5,
								borderWidth: 3,
								borderColor: violet,
								fontSize: '1rem',
								color: violet,
							}}
							value={gameId}
							disabled={disabledButton}
							onChange={e => setGameId(e.target.value)}
						/>

						<div style={{ width: '20vw', ...flexRowStyle, gap: 15 }}>
							<button
								style={{
									...buttonStyle,
									...homeButtonsStyle,
									fontSize: '1.4em',
								}}
								disabled={disabledButton}
								onClick={() => joinGameAsPlayer()}>
								<h6>TWO</h6>
							</button>
							<button
								style={{ ...buttonStyle, ...homeButtonsStyle, fontSize: '1.4em' }}
								disabled={disabledButton}
								onClick={() => joinGameAsSpectator()}>
								<MdVisibility />
							</button>
							<button
								style={{ ...buttonStyle, ...homeButtonsStyle, fontSize: '1.4em' }}
								disabled={disabledButton}
								onClick={() => returnAsPlayer()}>
								<VscDebugContinue /> <h6>ONE / TWO</h6>
							</button>
						</div>
					</div>
				</div>
			</div>
			<div
				style={{
					position: 'absolute',
					top: '20vh',
					right: '5vw',
					display: 'flex',
					alignItems: 'center',
					borderRadius: 5,
					flexDirection: 'column',
					gap: 6,
					overflowY: 'auto',
					maxHeight: '70vh',
					overflowX: 'hidden',
				}}>
				<h3 style={{ color: violet, fontWeight: 'bold' }}>Leaderboard</h3>
				<table style={{ width: '12vw' }}>
					{leaderBoard?.map((user, index) => (
						<tr>
							<td style={{ padding: 4 }}>
								<h5
									key={index}
									data-tooltip-id='wl'
									data-tooltip-content={`wins: ${user.wins} , losses: ${user.losses}`}
									style={{ color: violet, ...centerStyle }}>
									{user.userName}
								</h5>
								<h6 style={{ color: violet, ...centerStyle }}>{user.score} 🏆</h6>
								<Tooltip id='wl' />
							</td>
						</tr>
					))}
				</table>
			</div>
		</>
	);
}

export default Home;
