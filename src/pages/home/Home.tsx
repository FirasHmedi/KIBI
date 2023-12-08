import shuffle from 'lodash/shuffle';
import { useState } from 'react';
import { FaGamepad } from 'react-icons/fa';
import { MdComputer, MdPerson, MdPersonAdd, MdVisibility } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { setItem } from '../../backend/db';
import {
	buttonStyle,
	centerStyle,
	flexRowStyle,
	homeButtonsStyle,
	violet,
} from '../../styles/Style';
import { BOT, EMPTY_SLOT, ENV_MAX_LOAD, GAMES_PATH, INITIAL_HP, PREPARE } from '../../utils/data';
import {
	getMainDeckFirstHalf,
	getMainDeckSecondHalf,
	submitRandomSelection,
} from '../../utils/helpers';
import { PlayerType } from '../../utils/interface';

function Home() {
	const navigate = useNavigate();
	const [gameId, setGameId] = useState('');
	const [disabledButton, setDisabledButton] = useState(false);

	const createGame = async () => {
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
				envLoadNb: ENV_MAX_LOAD,
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
				envLoadNb: ENV_MAX_LOAD,
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
			envLoadNb: ENV_MAX_LOAD,
		});

		await submitRandomSelection(gameId, initialPowers);
		setDisabledButton(true);
		navigate('/game/' + gameId, {
			state: {
				gameId: gameId,
				playerName: 'player1',
				playerType: PlayerType.ONE,
			},
		});
	};

	const joinGameAsPlayer = async () => {
		if (gameId.length === 0) return;
		await setItem(GAMES_PATH + gameId + '/two', {
			hp: INITIAL_HP,
			playerName: 'player2',
			canAttack: true,
			canPlayPowers: true,
			status: PREPARE,
			envLoadNb: ENV_MAX_LOAD,
		});
		setDisabledButton(true);
		navigate('game/' + gameId, {
			state: {
				gameId: gameId,
				playerName: 'player2',
				playerType: PlayerType.TWO,
			},
		});
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

	return (
		<div style={{ height: '100%', ...centerStyle, width: '100%' }}>
			<div
				style={{
					...centerStyle,
					flexDirection: 'column',
					gap: 20,
				}}>
				<div style={{ ...centerStyle, gap: 15 }}>
					<button
						style={{
							...buttonStyle,
							...homeButtonsStyle,
						}}
						disabled={false}
						onClick={() => createGame()}>
						<FaGamepad />
						<MdPerson />
					</button>
					<button
						style={{
							...buttonStyle,
							...homeButtonsStyle,
						}}
						disabled={disabledButton}
						onClick={playWithGameBot}>
						<FaGamepad />
						<MdComputer />
					</button>
				</div>
				<div style={centerStyle}>
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
							}}
							disabled={disabledButton}
							onClick={() => joinGameAsPlayer()}>
							<FaGamepad />
							<MdPersonAdd />
						</button>
						<button
							style={{ ...buttonStyle, ...homeButtonsStyle, fontSize: '1.7em' }}
							disabled={disabledButton}
							onClick={() => joinGameAsSpectator()}>
							<MdVisibility />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Home;
