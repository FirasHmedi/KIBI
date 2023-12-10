import shuffle from 'lodash/shuffle';
import { useState } from 'react';
import { FaGamepad } from 'react-icons/fa';
import { MdComputer, MdPerson, MdPersonAdd, MdVisibility } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { getItemsOnce, setItem } from '../../backend/db';
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
	const [alertMessage, setAlertMessage] = useState("");

	const createGame = async () => {
		const gameId = uuidv4();
		const player1Id = uuidv4(); 
		const mainDeck: string[] = shuffle([...getMainDeckFirstHalf(), ...getMainDeckSecondHalf()]);
		const initialPowers = mainDeck.splice(-4, 4);
		localStorage.setItem('playerId', player1Id);
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
		//const player1Id = uuidv4(); 
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
		const gameData = await getItemsOnce(GAMES_PATH + gameId);
		if (!gameData || gameData.two.id) {
			console.log("Game is full or does not exist.");
			setAlertMessage("Game is full or does not exist.");
			return;
		}
		const player2Id = uuidv4(); // Generate unique ID for Player 1

		localStorage.setItem('playerId', player2Id);

		await setItem(GAMES_PATH + gameId + '/two', {
			id: player2Id, 
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
	const returnAsPlayer = async (playerNumber:number) => {
		const storedPlayerId = localStorage.getItem('playerId');
		if (!storedPlayerId) {
			console.log("No player ID found in local storage.");
			return;
		}
		const playerData = playerNumber === 1 ? "one" : "two";
		console.log(playerData)
		const IdFromDb = await getItemsOnce(GAMES_PATH +'/'+ gameId +'/'+ playerData + '/' + 'id');
		if (!IdFromDb) {
			console.log("Game does not exist.");
			return;
		}
		
		console.log(storedPlayerId)
		console.log(IdFromDb)
		if (IdFromDb === storedPlayerId) {
			if (playerNumber === 1 ) {navigate('game/' + gameId, {
				state: {
					gameId: gameId,
					playerName: 'player1',
					playerType: PlayerType.ONE,
				},
			});}
			else {navigate('game/' + gameId, {
				state: {
					gameId: gameId,
					playerName: 'player2',
					playerType: PlayerType.TWO,
				},
			});}
		} else {
			console.log("Player ID does not match.");
		}
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
				{alertMessage && (
            <div style={{  }}>
                {alertMessage}
                <button onClick={() => setAlertMessage("")}>Close</button>
            </div>
        )}
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
						<button
							style={{ ...buttonStyle, ...homeButtonsStyle, fontSize: '1.7em' }}
							disabled={disabledButton}
							onClick={() => returnAsPlayer(1)}>
							Return 1

						</button>
						<button
							style={{ ...buttonStyle, ...homeButtonsStyle, fontSize: '1.7em' }}
							disabled={disabledButton}
							onClick={() => returnAsPlayer(2)}>
							Return 2
						</button>
						
					</div>
				</div>
			</div>
		</div>
	);
}

export default Home;
