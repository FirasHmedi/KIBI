import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimalsSelection } from '../../components/AnimalsSelection';
import GameView from '../../components/GameView';
import { centerStyle, flexColumnStyle } from '../../styles/Style';
import {
  GeneralTestData,
  PlayerType,
  READY,
  ROOMS_PATH,
  RUNNING,
  getRandomMainDeck,
} from '../../utils/data';
import { setItem, subscribeToItems } from '../../utils/db';
import { isGameInPreparation, isGameRunning } from '../../utils/helpers';

function Game() {
  const location = useLocation();
  const { roomId, playerName, playerType } = location.state ?? GeneralTestData;
  const [game, setGame] = useState<any>();

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
        <GameView game={game} roomId={roomId} playerType={playerType} />
      )}

      {isGameInPreparation(game?.status) && (
        <div style={{ width: '100vw' }}>
          <AnimalsSelection playerType={playerType} roomId={roomId} />
          <h5>
            {playerName} : {playerType}
          </h5>
        </div>
      )}
    </div>
  );
}

export default Game;
