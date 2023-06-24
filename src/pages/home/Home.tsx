import React, { useEffect, useState } from 'react';
import { black, buttonStyle, primaryBlue } from '../../styles/Style';
import { useNavigate } from 'react-router-dom';
import { PlayerType, SINGUP_PATH } from '../../utils/data';
import { setItem, subscribeToItems } from '../../utils/db';
import { v4 as uuidv4 } from 'uuid';

function Home() {
  console.log('home');
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState('');
  const [disabledButton, setDisabledButton] = useState(false);

  const createRoom = async () => {
    const roomId = uuidv4();
    const p1Id = uuidv4();
    const animalGraveyardId = uuidv4();
    const powerGraveyardId = uuidv4();
    const boardId = uuidv4();
    const mainDeckId = uuidv4();

    await setItem('rooms/' + roomId, {
      p1Id,
      animalGraveyardId,
      powerGraveyardId,
      boardId,
      mainDeckId,
      status: 'prepare',
    });
    await setItem('players/one/' + p1Id, {
      id: p1Id,
      hp: 8,
      deckCardsIds: [],
    });

    setDisabledButton(true);
    navigate('/game/' + roomId, {
      state: {
        roomId: roomId,
        playerName: 'player1',
        playerType: PlayerType.ONE,
        playerId: p1Id,
      },
    });
  };

  const joinRoom = async () => {
    if (roomId.length === 0) return;
    const p2Id = uuidv4();
    await setItem('rooms/' + roomId, {
      p2Id: p2Id,
    });
    await setItem('players/two/' + p2Id, {
      id: p2Id,
      hp: 8,
      deckCardsIds: [],
    });

    setDisabledButton(true);
    navigate('game/' + roomId, {
      state: {
        roomId: roomId,
        playerName: 'player2',
        playerType: PlayerType.TWO,
        playerId: p2Id,
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
        <button
          style={buttonStyle}
          disabled={false}
          onClick={() => createRoom()}>
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
          <button
            style={buttonStyle}
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
