import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { buttonStyle } from '../../styles/Style';
import { PlayerType } from '../../utils/data';
import { setItem } from '../../utils/db';

function Home() {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState('');
  const [disabledButton, setDisabledButton] = useState(false);

  const createRoom = async () => {
    const roomId = uuidv4();
    await setItem('rooms/' + roomId, {
      board: {
        one: [1, 2, 3],
        two: [1, 2, 3],
        envCard: 'unknown',
      },
      mainDeck: [1, 2],
      animalsGY: [1],
      powersGY: [1],
      status: 'prepare',
      one: {
        hp: 8,
        deckCardsIds: [1],
        playerName: 'player2',
        canPlayAnimals: true,
        canPlayPowers: true,
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
    await setItem('rooms/' + roomId + '/two', {
      hp: 8,
      deckCardsIds: [],
      playerName: 'player2',
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
    <div style={{ flex: 1, backgroundColor: '#ecf0f1', height: '100vh' }}>
      <div
        style={{
          display: 'flex',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}>
        <button style={buttonStyle} disabled={false} onClick={() => createRoom()}>
          Create a room
        </button>

        <div>
          <input
            type='text'
            placeholder='Room Id'
            required
            style={{ padding: 5, margin: 10 }}
            value={roomId}
            disabled={disabledButton}
            onChange={e => setRoomId(e.target.value)}
          />
          <button style={buttonStyle} disabled={disabledButton} onClick={() => joinRoom()}>
            Join a room
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
