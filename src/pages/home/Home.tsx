import _ from 'lodash';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { buttonStyle, centerStyle, flexRowStyle, greyBackground, violet } from '../../styles/Style';
import { ENV_MAX_LOAD, INITIAL_HP, PREPARE, GAMES_PATH } from '../../utils/data';
import { setItem } from '../../utils/db';
import { PlayerType } from '../../utils/interface';
import { getMainDeckFirstHalf, getMainDeckSecondHalf } from '../../utils/helpers';

function Home() {
	const navigate = useNavigate();
	const [gameId, setGameId] = useState('');
	const [disabledButton, setDisabledButton] = useState(false);

	const createGame = async () => {
		const gameId = uuidv4();
		const mainDeck: string[] = _.shuffle([...getMainDeckFirstHalf(), ...getMainDeckSecondHalf()]);
		const initialPowers = mainDeck.splice(-3, 3);

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
		<div style={{ backgroundColor: greyBackground, height: '100%', ...centerStyle, width: '100%' }}>
			<div
				style={{
					...centerStyle,
					flexDirection: 'column',
					gap: 4,
				}}>
				<button style={{ ...buttonStyle, fontSize: '1em', padding: 10 }} disabled={false} onClick={() => createGame()}>
					Create a game
				</button>

				<div style={centerStyle}>
					<input
						type='text'
						placeholder='Game Id'
						required
						style={{
							padding: 10,
							margin: 10,
							width: '20vw',
							height: '2vh',
							borderRadius: 5,
							borderWidth: 3,
							borderColor: violet,
						}}
						value={gameId}
						disabled={disabledButton}
						onChange={e => setGameId(e.target.value)}
					/>
					<div style={{ width: '20vw', ...flexRowStyle, gap: 10 }}>
						<button
							style={{ ...buttonStyle, fontSize: '1em', padding: 10 }}
							disabled={disabledButton}
							onClick={() => joinGameAsPlayer()}>
							Join as second player
						</button>
						<button
							style={{ ...buttonStyle, fontSize: '1em', padding: 10 }}
							disabled={disabledButton}
							onClick={() => joinGameAsSpectator()}>
							Join as watcher
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Home;
