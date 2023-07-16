import { useEffect, useState } from 'react';
import { flexColumnStyle, violet } from '../styles/Style';
import { attackAnimal, placeAnimalOnBoard, playerDrawCard } from '../utils/actions';
import { DefaultBoard, Player, PlayerType, Round } from '../utils/data';
import {
  getOpponentIdFromCurrentId,
  isAnimalCard,
  isGameRunning,
  isPowerCard,
} from '../utils/helpers';
import { addOneRound } from '../utils/unitActions';
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
  const [round, setRound] = useState<Round>();
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
      animalGY: gameBoard?.animalGY ?? DefaultBoard.animalGY,
      powerGY: gameBoard?.powerGY ?? DefaultBoard.powerGY,
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
    if (round) {
      if (
        game.round.nb > round?.nb &&
        !!round.nb &&
        game.round.player != round.player &&
        game.round.player === playerType
      ) {
        playerDrawCard(roomId, playerType).then();
      }
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
    if (isAnimalCard(cardId) && selectedCurrentPSlotNb != null) {
      await placeAnimalOnBoard(roomId, playerType, selectedCurrentPSlotNb, cardId!);
    }

    if (isPowerCard(cardId)) {
    }
  };

  const finishRound = async () => {
    await addOneRound(roomId, getOpponentIdFromCurrentId(playerType));
  };

  const attackOpponentAnimal = async () => {
    if (selectedCurrentPSlotNb == null || selectedOpponentPSlotNb == null) {
      return;
    }
    const animalAId = board?.currentPSlots[selectedCurrentPSlotNb!];
    const animalDId = board?.opponentPSlots[selectedOpponentPSlotNb!];
    if (!animalDId || !animalAId) {
      return;
    }

    await attackAnimal(
      roomId,
      playerType,
      getOpponentIdFromCurrentId(playerType),
      animalAId.cardId!,
      animalDId.cardId!,
      selectedCurrentPSlotNb,
      selectedOpponentPSlotNb,
    );
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
      <div
        style={{
          position: 'absolute',
          left: '2%',
          top: '50%',
          fontSize: '1.2em',
          fontWeight: 'bold',
          color: violet,
        }}>
        Round {game.round.nb}
      </div>
      <Board
        board={board}
        selectedCurrentPSlotNb={selectedCurrentPSlotNb}
        selectedOpponentPSlotNb={selectedOpponentPSlotNb}
        selectOpponentSlot={selectOpponentSlot}
        selectCurrentSlot={selectCurrentSlot}
      />
      <CurrentPView
        player={currentPlayer}
        round={round}
        playCard={playCard}
        finishRound={finishRound}
        attackOpponentAnimal={attackOpponentAnimal}
      />
    </div>
  );
}

export default GameView;
