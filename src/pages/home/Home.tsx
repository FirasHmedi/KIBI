import React, { useEffect, useState } from 'react';
import { Items } from './Items';
import { black, primaryBlue } from '../../styles/Style';
import { User } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { SINGUP_PATH } from '../../utils/data';
import { addItem } from '../../utils/db';
import { v4 as uuidv4 } from 'uuid';

function Home() {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState('');
  const [disabledButton, setDisabledButton] = useState(false);
  const createRoom = async () => {
    const roomId = uuidv4();
    const p1Id = uuidv4();
    await addItem('room/' + roomId, {
      p1Id: p1Id,
    });
    await addItem('players/player1/' + p1Id, {
      id: p1Id,
      hp: 8,
    });
    setDisabledButton(true);
    navigate('/game/' + roomId, {
      state: { roomId: roomId, playerName: 'player1' },
    });
  };

  const joinRoom = async () => {
    if (roomId.length === 0) return;
    const p2Id = uuidv4();
    await addItem('room/' + roomId, {
      p2Id: p2Id,
    });
    await addItem('players/player2/' + p2Id, {
      id: p2Id,
      hp: 8,
    });
    setDisabledButton(true);
    navigate('/game/' + roomId, {
      state: { roomId: roomId, playerName: 'player2' },
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
          style={{
            backgroundColor: primaryBlue,
            padding: 7,
            borderRadius: 5,
            fontWeight: 'bold',
            color: 'white',
          }}
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
            style={{
              backgroundColor: primaryBlue,
              padding: 7,
              borderRadius: 5,
              fontWeight: 'bold',
              color: 'white',
            }}
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
