import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { buttonStyle } from '../../styles/Style';
import {placeAnimalOnBoard, placeKingOnBoard, playerDrawCard} from '../../utils/actions';
import { PREPARE, PlayerType, ROOMS_PATH } from '../../utils/data';
import { setItem } from '../../utils/db';
import {changeEnv, reviveLastPower} from "../../utils/abilities";
import {
  changeCanAttackVar,
  changeCanAttackVarOfSlot, changePLayerCards,
  changePLayerHealth,
  changeUsingPowerCardsVar,
  deleteAnimalCardFromGraveYardByIndex,
  deletePowerCardFromGraveYardById,
  getPLayerCards,
  getPLayerHealth,
} from "../../utils/unitActions";

function Home() {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState('');
  const [disabledButton, setDisabledButton] = useState(false);

  const createRoom = async () => {
    const roomId = uuidv4();
    await setItem(ROOMS_PATH + roomId, {
      board: {
        one: ['empty', 'empty', 'empty'],
        two: ['empty', 'empty', 'empty'],
        envCard: {
          id: '0',
          name: 'Neutral',
          ability: 'neutral',
        },
      },
      status: PREPARE,
      one: {
        hp: 8,
        playerName: 'player1',
        canPlayAnimals: true,
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
      canPlayAnimals: true,
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
    //await playerDrawCard("test-room","one")
    //await placeAnimalOnBoard('test-room', 'one', 1, '2-a');
    //await placeKingOnBoard('test-room', 'one', '1-a', '2-a',1);
    //await changePLayerHealth('test-room', 'one', 5)
    //await reviveLastPower('test-room','one')
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
