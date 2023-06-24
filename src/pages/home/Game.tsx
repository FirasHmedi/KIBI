import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimalsSelection } from '../../components/AnimalsSelection';
import { Board } from '../../components/Board';
import { CurrentPView, OpponentPView } from '../../components/Players';
import { centerStyle, flexColumnStyle } from '../../styles/Style';
import { subscribeToItems } from '../../utils/db';

function Game() {
  const navigate = useNavigate();
  const location = useLocation();
  const testData = { roomId: 'test', playerName: 'test', playerType: 'one', playerId: 'testId' };
  const { roomId, playerName, playerType, playerId } = location.state ?? testData;
  const [data, setData] = useState<any>();
  const [game, setGame] = useState({
    running: true,
  });
  const player = {
    playerName,
    playerType,
    playerId,
  };

  async function subscribeToRoom() {
    await subscribeToItems('rooms/' + roomId, setData);
  }

  useEffect(() => {
    subscribeToRoom();
  }, []);

  useEffect(() => {
    if (data?.one?.status === 'ready' || data?.two?.status === 'ready') {
      setGame({
        running: true,
      });
    }
  }, [data]);

  return (
    <div
      style={{
        ...flexColumnStyle,
        ...centerStyle,
        backgroundColor: '#ecf0f1',
        justifyContent: 'flex-start',
        height: '100vh',
      }}>
      {game.running && (
        <div
          style={{
            ...flexColumnStyle,
            width: '100vw',
            height: '100vh',
            justifyContent: 'space-between',
          }}>
          <OpponentPView player={player} deck={[]} />
          <Board />
          <CurrentPView player={player} deck={[]} />
        </div>
      )}

      {!game.running && (
        <div>
          <AnimalsSelection playerType={playerType} playerId={playerId} roomId={roomId} />
          <h5>
            Player {playerName} / Order {playerType}
          </h5>
        </div>
      )}

      <div style={{ position: 'absolute', bottom: 10, ...centerStyle }}></div>
    </div>
  );
}

export default Game;
