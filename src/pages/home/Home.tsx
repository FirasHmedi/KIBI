import shuffle from 'lodash/shuffle';
import { useEffect, useState } from 'react';
import { MdComputer, MdPerson, MdVisibility } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getItemsOnce, setItem } from '../../backend/db';

import { isEmpty, orderBy } from 'lodash';
import { VscDebugContinue } from 'react-icons/vsc';
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
import {
	BOT,
	CONNECT_PATH,
	EMPTY_SLOT,
	GAMES_PATH,
	INITIAL_HP,
	PREPARE,
	RUNNING,
} from '../../utils/data';
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

	const setUser = async () => {
		const user = await isUserConnected();
		if (isNotEmpty(user.userName)) {
			setCurrentUser(user);
			return;
		}
		setCurrentUser(undefined);
	};

	const setLeaderBoardAfterCalc = async () => {
		let users: any = (await getItemsOnce('users')) ?? {};
		users = Object.values(users).map(({ score, wins, losses, userName }: any) => ({
			score,
			wins,
			losses,
			userName,
		}));
		users = orderBy(users, ['score'], ['desc']);
		setLeaderBoard(users);
	};

	useEffect(() => {
		setUser();
		setLeaderBoardAfterCalc();
	}, []);

	const createGame = async () => {
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
				playerName: 'player1',
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
				playerName: 'player1',
				playerType: PlayerType.ONE,
			},
		});
	};

	const playWithGameBot = async () => {
		const gameId = short.generate().slice(0, 6);
		const mainDeck: string[] = shuffle([...getMainDeckFirstHalf(), ...getMainDeckSecondHalf()]);
		const initialPowers = mainDeck.splice(-4, 4);

		await setItem(GAMES_PATH + gameId, {
			status: PREPARE,
			one: {
				hp: INITIAL_HP,
				playerName: 'player1',
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
				playerName: 'player1',
				playerType: PlayerType.ONE,
			},
		});
		await distributeCards(gameId);
	};

	const joinGameAsPlayer = async () => {
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
			playerName: 'player2',
			canAttack: true,
			canPlayPowers: true,
			status: PREPARE,
			envLoadNb: 0,
		});
		setDisabledButton(true);
		navigate('game/' + gameId, {
			state: {
				gameId: gameId,
				playerName: 'player2',
				playerType: PlayerType.TWO,
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
					playerName: 'player1',
					playerType: PlayerType.ONE,
				},
			});
		} else if (playerTwoId === storedPlayerId) {
			navigate('game/' + gameId, {
				state: {
					gameId: gameId,
					playerName: 'player2',
					playerType: PlayerType.TWO,
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
					<Seperator h='1vh' />
					<div style={centerStyle}>
						<button
							style={{ color: violet }}
							onClick={() => window.open('https://discord.gg/CrAy2vKQ', '_blank')}>
							<h3 style={{ textDecoration: 'underline' }}>Discord server</h3>
						</button>
					</div>
				</div>
			</div>
			<div
				style={{
					width: '15rem',
					position: 'absolute',
					top: '20vh',
					right: '5vw',
					display: 'flex',
					alignItems: 'center',
					borderRadius: 5,
					flexDirection: 'column',
					gap: 6,
					overflowY: 'scroll',
					maxHeight: '70vh',
				}}>
				<h3 style={{ color: violet, fontWeight: 'bold' }}>Leaderboard</h3>
				{leaderBoard?.map((user, index) => (
					<h5 key={index} style={{ color: violet, fontWeight: 'semi-bold', ...centerStyle }}>
						{user.userName} <br /> {user.score}🏆 <br /> {user.wins}⬆ {user.losses}⬇
						<br />
						------------------
					</h5>
				))}
			</div>
		</>
	);
}

export default Home;
