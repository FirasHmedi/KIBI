import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimalsSelection } from '../../components/AnimalsSelection';
import { GameContainer } from '../../components/GameContainer';
import { centerStyle, flexColumnStyle, violet } from '../../styles/Style';
import { READY, ROOMS_PATH, RUNNING, getRandomMainDeck } from '../../utils/data';
import { setItem, subscribeToItems } from '../../utils/db';
import { isGameInPreparation, isGameRunning } from '../../utils/helpers';
import { Game, PlayerType } from '../../utils/interface';

function GamePage() {
  const location = useLocation();
  const { roomId, playerName, playerType } = location.state;
  const [game, setGame] = useState<Game>();

  const subscribeToRoom = async () => {
    await subscribeToItems(ROOMS_PATH + roomId, setGame);
  };

  useEffect(() => {
    subscribeToRoom();
  }, []);

  useEffect(() => {
    if (
      game?.one?.status === READY &&
      game?.two?.status === READY &&
      !isGameRunning(game?.status)
    ) {
      setItem(ROOMS_PATH + roomId, {
        status: RUNNING,
        board: { mainDeck: getRandomMainDeck() },
        round: {
          player: PlayerType.ONE,
          nb: 1,
        },
      });
    }
  }, [game]);

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
      {isGameRunning(game?.status) && (
        <GameContainer game={game!} roomId={roomId} playerType={playerType} />
      )}

      {isGameInPreparation(game?.status) && (
        <div style={{ width: '100vw', color: violet }}>
          <AnimalsSelection playerType={playerType} roomId={roomId} />
          <h4 style={{ padding: 10 }}>
            {playerName} : {playerType}
          </h4>
          <h4>Room ID: {roomId}</h4>
        </div>
      )}
    </div>
  );
}

export default GamePage;
