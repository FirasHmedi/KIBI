import shuffle from 'lodash/shuffle';
import { useState } from 'react';
import { MdComputer, MdPerson, MdVisibility } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { v4 as uuidv4 } from 'uuid';
import { getItemsOnce, setItem } from '../../backend/db';

import { VscDebugContinue } from 'react-icons/vsc';
import { Seperator } from '../../components/Elements';
import {
	buttonStyle,
	centerStyle,
	flexColumnStyle,
	flexRowStyle,
	homeButtonsStyle,
	violet,
} from '../../styles/Style';
import { BOT, EMPTY_SLOT, GAMES_PATH, INITIAL_HP, PREPARE } from '../../utils/data';
import {
	distributeCards,
	getMainDeckFirstHalf,
	getMainDeckSecondHalf,
	submitRandomSelectionforBot,
} from '../../utils/helpers';
import { PlayerType } from '../../utils/interface';

function Home() {
	const navigate = useNavigate();
	const [gameId, setGameId] = useState('');
	const [disabledButton, setDisabledButton] = useState(false);
	const [alertMessage, setAlertMessage] = useState('');

	const createGame = async () => {
		const gameId = uuidv4();
		const player1Id = uuidv4();
		const mainDeck: string[] = shuffle([...getMainDeckFirstHalf(), ...getMainDeckSecondHalf()]);
		const initialPowers = mainDeck.splice(-4, 4);
		localStorage.setItem('playerId', player1Id);

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
		navigate('/game/' + gameId, {
			state: {
				gameId: gameId,
				playerName: 'player1',
				playerType: PlayerType.ONE,
			},
		});
	};

	const playWithGameBot = async () => {
		const gameId = uuidv4();
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
		const gameData = await getItemsOnce(GAMES_PATH + gameId);

		if (!gameData || gameData.two) {
			toast.error('Game is full or does not exist.', {
				position: toast.POSITION.TOP_RIGHT,
			});
			return;
		}
		const player2Id = uuidv4();

		localStorage.setItem('playerId', player2Id);

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
		const storedPlayerId = localStorage.getItem('playerId');
		if (!storedPlayerId) {
			toast.error('No player ID found in local storage.', {
				position: toast.POSITION.TOP_RIGHT,
			});
			return;
		}

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
						<h3 style={{ color: violet }}>Join a game</h3>
						<input
							type='text'
							placeholder='Game Id'
							required
							style={{
								padding: 10,
								margin: 10,
								width: '24vw',
								height: '2vh',
								borderRadius: 5,
								borderWidth: 3,
								borderColor: violet,
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
		</>
	);
}

export default Home;
