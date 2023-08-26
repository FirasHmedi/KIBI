import _ from 'lodash';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { buttonStyle, centerStyle } from '../../styles/Style';
import {
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
    const mainDeck: string[] = [
      ..._.shuffle(getMainDeckFirstHalf()),
      ..._.shuffle(getMainDeckSecondHalf()),
    ];
    const initialPowers = mainDeck.splice(-3, 3);

    await setItem(ROOMS_PATH + roomId, {
      status: PREPARE,
      one: {
        hp: INITIAL_HP,
        playerName: 'player1',
        canAttack: true,
        canPlayPowers: true,
        status: PREPARE,
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

  const joinRoom = async () => {
    if (roomId.length === 0) return;
    await setItem(ROOMS_PATH + roomId + '/two', {
      hp: INITIAL_HP,
      playerName: 'player2',
      canAttack: true,
      canPlayPowers: true,
      status: PREPARE,
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

  return (
    <div style={{ flex: 1, backgroundColor: '#ecf0f1', height: '100vh', ...centerStyle }}>
      <div
        style={{
          display: 'flex',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}>
        <button
          style={{ ...buttonStyle, fontSize: 26, padding: 20 }}
          disabled={false}
          onClick={() => createRoom()}>
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
          <button
            style={{ ...buttonStyle, fontSize: 26, padding: 20 }}
            disabled={disabledButton}
            onClick={() => joinRoom()}>
            Join a room
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
