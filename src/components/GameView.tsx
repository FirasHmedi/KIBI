import { useEffect, useState } from 'react';
import { flexColumnStyle } from '../styles/Style';
import { Player, PlayerType } from '../utils/data';
import { isAnimalCard, isGameRunning, isPowerCard } from '../utils/helpers';
import { Board } from './Board';
import { CurrentPView, OpponentPView } from './Players';

function GameView({ game, playerType }: { game: any; playerType: PlayerType }) {
  const [board, setBoard] = useState<Board>();
  const [round, setRound] = useState();
  const [currentPlayer, setCurrentPlayer] = useState<Player>();
  const [opponentPlayer, setOpponentPlayer] = useState<Player>();
  const [selectedCurrentPSlotNb, setSelectedCurrentPSlotNb] = useState<number>();
  const [selectedOpponentPSlotNb, setSelectedOpponentPSlotNb] = useState<number>();

  useEffect(() => {
    if (!isGameRunning(game.status)) {
      return;
    }

    setBoard(game.board);
    setRound(game.round);
    const player1 = { ...game[PlayerType.ONE], playerType: PlayerType.ONE };
    const player2 = { ...game[PlayerType.TWO], playerType: PlayerType.TWO };

    if (playerType === PlayerType.ONE) {
      setCurrentPlayer(player1);
      setOpponentPlayer(player2);
    } else {
      setCurrentPlayer(player2);
      setOpponentPlayer(player1);
    }
  }, [game]);

  const selectOpponentSlot = (nbSlot?: number, cardId?: string) => {
    nbSlot !== selectedOpponentPSlotNb
      ? setSelectedOpponentPSlotNb(nbSlot)
      : setSelectedOpponentPSlotNb(undefined);
  };
  const selectCurrentSlot = (nbSlot?: number, cardId?: string) => {
    nbSlot !== selectedCurrentPSlotNb
      ? setSelectedCurrentPSlotNb(nbSlot)
      : setSelectedCurrentPSlotNb(undefined);
  };

  const playCard = (cardId?: string) => {
    if (isAnimalCard(cardId)) {
    }

    if (isPowerCard(cardId)) {
    }
  };

  if (!isGameRunning(game.status) || !board || !opponentPlayer || !currentPlayer) {
    return <></>;
  }

  return (
    <div
      style={{
        ...flexColumnStyle,
        width: '100vw',
        height: '100vh',
        justifyContent: 'space-between',
      }}>
      <OpponentPView player={opponentPlayer} />
      <Board
        board={board}
        selectedCurrentPSlotNb={selectedCurrentPSlotNb}
        selectedOpponentPSlotNb={selectedOpponentPSlotNb}
        selectOpponentSlot={selectOpponentSlot}
        selectCurrentSlot={selectCurrentSlot}
      />
      <CurrentPView player={currentPlayer} round={round} playCard={playCard} />
    </div>
  );
}

export default GameView;
