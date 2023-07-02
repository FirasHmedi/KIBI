import { useEffect, useState } from 'react';
import { flexColumnStyle } from '../styles/Style';
import { placeAnimalOnBoard } from '../utils/actions';
import { DefaultBoard, Player, PlayerType } from '../utils/data';
import { isAnimalCard, isGameRunning, isPowerCard } from '../utils/helpers';
import { Board } from './Board';
import { CurrentPView, OpponentPView } from './Players';

function GameView({
  game,
  playerType,
  roomId,
}: {
  game: any;
  playerType: PlayerType;
  roomId: string;
}) {
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

    const gameBoard = game.board;
    const partOfBoard: Board = {
      mainDeck: gameBoard?.mainDeck ?? DefaultBoard.mainDeck,
      animalsGY: gameBoard?.animalsGY ?? DefaultBoard.animalsGY,
      powersGY: gameBoard?.powersGY ?? DefaultBoard.powersGY,
      envCard: gameBoard?.envCard ?? DefaultBoard.envCard,
      activeCardId: gameBoard?.activeCardId ?? DefaultBoard.activeCardId,
      currentPSlots: [],
      opponentPSlots: [],
    };
    const player1 = { ...game[PlayerType.ONE], playerType: PlayerType.ONE };
    const player2 = { ...game[PlayerType.TWO], playerType: PlayerType.TWO };

    if (playerType === PlayerType.ONE) {
      setCurrentPlayer(player1);
      setOpponentPlayer(player2);
      setBoard({
        ...partOfBoard,
        currentPSlots: gameBoard.one ?? [],
        opponentPSlots: gameBoard.two ?? [],
      });
    } else {
      setCurrentPlayer(player2);
      setOpponentPlayer(player1);
      setBoard({
        ...partOfBoard,
        currentPSlots: gameBoard.two ?? [],
        opponentPSlots: gameBoard.one ?? [],
      });
    }

    setRound(game.round);
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

  const playCard = async (cardId?: string) => {
    console.log(cardId, isAnimalCard(cardId), selectedCurrentPSlotNb);
    if (isAnimalCard(cardId) && selectedCurrentPSlotNb != null) {
      await placeAnimalOnBoard(roomId, playerType, selectedCurrentPSlotNb, cardId!);
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
