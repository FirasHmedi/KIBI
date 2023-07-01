import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimalsSelection } from '../../components/AnimalsSelection';
import { Board } from '../../components/Board';
import { CurrentPView, OpponentPView } from '../../components/Players';
import { centerStyle, flexColumnStyle } from '../../styles/Style';
import { GeneralTestData, Player, PlayerType, getRandomMainDeck } from '../../utils/data';
import { setItem, subscribeToItems } from '../../utils/db';

function Game() {
  const location = useLocation();
  const { roomId, playerName, playerType } = location.state ?? GeneralTestData;
  const [data, setData] = useState<any>();
  const [board, setBoard] = useState<Board>();
  const [currentPlayer, setCurrentPlayer] = useState<Player>();
  const [opponentPlayer, setOpponentPlayer] = useState<Player>();
  const [game, setGame] = useState({
    running: false,
  });

  const subscribeToRoom = async () => {
    await subscribeToItems('rooms/' + roomId, setData);
  };

  useEffect(() => {
    subscribeToRoom();
  }, []);

  useEffect(() => {
    if (data?.one?.status === 'ready' && data?.two?.status === 'ready' && !game.running) {
      setGame({
        running: true,
      });
      setItem('rooms/' + roomId, { status: 'running', board: { mainDeck: getRandomMainDeck() } });
    }

    if (data?.status === 'running') {
      setBoard(data.board);
      const player1 = { ...data[PlayerType.ONE], playerType: PlayerType.ONE };
      const player2 = { ...data[PlayerType.TWO], playerType: PlayerType.TWO };
      if (playerType === PlayerType.ONE) {
        setCurrentPlayer(player1);
        setOpponentPlayer(player2);
      } else {
        setCurrentPlayer(player2);
        setOpponentPlayer(player1);
      }
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
      {game.running && !!board && !!opponentPlayer && !!currentPlayer && (
        <div
          style={{
            ...flexColumnStyle,
            width: '100vw',
            height: '100vh',
            justifyContent: 'space-between',
          }}>
          <OpponentPView player={opponentPlayer} />
          <Board board={board} />
          <CurrentPView player={currentPlayer} />
        </div>
      )}

      {!game.running && (
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
