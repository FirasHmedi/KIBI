import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimalsSelection } from '../../components/AnimalsSelection';
import { Board } from '../../components/Board';
import { CurrentPView, OpponentPView } from '../../components/Players';
import { centerStyle, flexColumnStyle } from '../../styles/Style';
import { GeneralTestData, TestDeck } from '../../utils/data';
import { setItem, subscribeToItems } from '../../utils/db';

function Game() {
  const location = useLocation();
  const { roomId, playerName, playerType, playerId } = location.state ?? GeneralTestData;
  const [data, setData] = useState<any>();
  const [board, setBoard] = useState<Board>();
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
      setItem('rooms/' + roomId, { status: 'running' });
    }
    if (data?.status === 'running') {
      setBoard(data.board);
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
        width: '100vw',
      }}>
      {game.running && (
        <div
          style={{
            ...flexColumnStyle,
            width: '100vw',
            height: '100vh',
            justifyContent: 'space-between',
          }}>
          <OpponentPView player={player} deck={TestDeck} />
          <Board board={board} />
          <CurrentPView player={player} deck={TestDeck} />
        </div>
      )}

      {!game.running && (
        <div style={{ width: '100vw' }}>
          <AnimalsSelection playerType={playerType} playerId={playerId} roomId={roomId} />
          <h5>
            {playerName} : {playerType}
          </h5>
        </div>
      )}
    </div>
  );
}

export default Game;
