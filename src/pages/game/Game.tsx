import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { GameContainer } from '../../components/GameContainer';
import { SharedAnimalsSelection } from '../../components/SharedAnimalsSelection';
import { centerStyle, flexColumnStyle, violet } from '../../styles/Style';
import { ROOMS_PATH, RUNNING, getMainDeckFirstHalf, getMainDeckSecondHalf } from '../../utils/data';
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
      game?.one?.cardsIds?.length === 8 &&
      game?.two?.cardsIds?.length === 8 &&
      !isGameRunning(game?.status)
    ) {
      setItem(ROOMS_PATH + roomId, {
        status: RUNNING,
        board: {
          mainDeck: [..._.shuffle(getMainDeckFirstHalf()), ..._.shuffle(getMainDeckSecondHalf())],
        },
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
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 4,
            }}>
            <h4 style={{ padding: 2 }}>
              {playerName} : {playerType} //
            </h4>
            <h4>
              Room ID: <span style={{ fontSize: '1.3em', color: 'red' }}>{roomId}</span>
            </h4>
          </div>
          <SharedAnimalsSelection
            playerType={playerType}
            roomId={roomId}
            oneCards={game?.one?.cardsIds ?? []}
            twoCards={game?.two?.cardsIds ?? []}
            playerToSelect={game?.playerToSelect}
          />
        </div>
      )}
    </div>
  );
}

export default GamePage;
