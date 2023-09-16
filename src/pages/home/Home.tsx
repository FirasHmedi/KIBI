import _ from 'lodash';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { buttonStyle, centerStyle, flexRowStyle, greyBackground } from '../../styles/Style';
import {
	ENV_MAX_LOAD,
	INITIAL_HP,
	PREPARE,
	ROOMS_PATH,
	getMainDeckFirstHalf,
	getMainDeckSecondHalf,
} from '../../utils/data';
import { setItem } from '../../utils/db';
import { PlayerType } from '../../utils/interface';

function Home() {
	const navigate = useNavigate();
	const [roomId, setRoomId] = useState('');
	const [disabledButton, setDisabledButton] = useState(false);

	const createRoom = async () => {
		const roomId = uuidv4();
		const mainDeck: string[] = _.shuffle([...getMainDeckFirstHalf(), ...getMainDeckSecondHalf()]);
		const initialPowers = mainDeck.splice(-3, 3);

		await setItem(ROOMS_PATH + roomId, {
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
		navigate('/game/' + roomId, {
			state: {
				roomId: roomId,
				playerName: 'player1',
				playerType: PlayerType.ONE,
			},
		});
	};

	const joinRoomAsPlayer = async () => {
		if (roomId.length === 0) return;
		await setItem(ROOMS_PATH + roomId + '/two', {
			hp: INITIAL_HP,
			playerName: 'player2',
			canAttack: true,
			canPlayPowers: true,
			status: PREPARE,
			envLoadNb: ENV_MAX_LOAD,
		});
		setDisabledButton(true);
		navigate('game/' + roomId, {
			state: {
				roomId: roomId,
				playerName: 'player2',
				playerType: PlayerType.TWO,
			},
		});
	};

	const joinRoomAsSpectator = async () => {
		if (roomId.length === 0) return;
		setDisabledButton(true);
		navigate('game/' + roomId, {
			state: {
				roomId: roomId,
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
				}}>
				<button style={{ ...buttonStyle, fontSize: '1em', padding: 10 }} disabled={false} onClick={() => createRoom()}>
					Create a room
				</button>

				<div style={centerStyle}>
					<input
						type='text'
						placeholder='Room Id'
						required
						style={{
							padding: 5,
							margin: 10,
							width: '30vw',
							height: '4vh',
							borderRadius: 5,
							borderWidth: 0,
						}}
						value={roomId}
						disabled={disabledButton}
						onChange={e => setRoomId(e.target.value)}
					/>
					<div style={{ width: '20vw', ...flexRowStyle, gap: 10 }}>
						<button
							style={{ ...buttonStyle, fontSize: '1em', padding: 10 }}
							disabled={disabledButton}
							onClick={() => joinRoomAsPlayer()}>
							Join as player
						</button>
						<button
							style={{ ...buttonStyle, fontSize: '1em', padding: 10 }}
							disabled={disabledButton}
							onClick={() => joinRoomAsSpectator()}>
							Join as spectator
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Home;
