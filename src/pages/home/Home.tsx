import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { buttonStyle, centerStyle } from '../../styles/Style';
import { PREPARE, ROOMS_PATH } from '../../utils/data';
import { setItem } from '../../utils/db';
import { PlayerType } from '../../utils/interface';

function Home() {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState('');
  const [disabledButton, setDisabledButton] = useState(false);

  const createRoom = async () => {
    const roomId = uuidv4();
    await setItem(ROOMS_PATH + roomId, {
      status: PREPARE,
      one: {
        hp: 8,
        playerName: 'player1',
        canAttack: true,
        canPlayPowers: true,
        status: PREPARE,
      },
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
      hp: 8,
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

  const test = async () => {
    //await attackOwner("test-room","one","1-a")
    //await drawCardFromMainDeck("test-room","one")
    //await placeAnimalOnBoard('test-room', 'one', 1, '2-a');
    //await placeKingOnBoard('test-room', 'one', '1-a', '2-a',1);
    //await changePLayerHealth('test-room', 'one', 5)
    //await reviveLastPower('test-room','one')
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
