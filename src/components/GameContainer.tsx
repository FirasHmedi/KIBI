import _ from 'lodash';
import { useEffect, useState } from 'react';
import { drawCardFromMainDeck } from '../utils/actions';
import { getItemsOnce, setItem } from '../utils/db';
import { isGameRunning } from '../utils/helpers';
import { Board, DefaultBoard, Game, Player, PlayerType, Round } from '../utils/interface';
import { GameView } from './GameView';

export function GameContainer({
  game,
  playerType,
  roomId,
}: {
  game: Game;
  playerType: PlayerType;
  roomId: string;
}) {
  const [board, setBoard] = useState<Board>();
  const [round, setRound] = useState<Round>();
  const [currentPlayer, setCurrPlayer] = useState<Player>();
  const [opponentPlayer, setOppPlayer] = useState<Player>();

  useEffect(() => {
    if (!isGameRunning(game.status)) {
      return;
    }

    const gameBoard = game.board;
    const partOfBoard: Board = {
      mainDeck: gameBoard?.mainDeck ?? DefaultBoard.mainDeck,
      animalGY: gameBoard?.animalGY ?? DefaultBoard.animalGY,
      powerGY: gameBoard?.powerGY ?? DefaultBoard.powerGY,
      envType: gameBoard?.envType ?? DefaultBoard.envType,
      activeCardId: gameBoard?.activeCardId ?? DefaultBoard.activeCardId,
      currentPSlots: [],
      opponentPSlots: [],
    };
    const p1 = { ...game[PlayerType.ONE], playerType: PlayerType.ONE };
    const p2 = { ...game[PlayerType.TWO], playerType: PlayerType.TWO };

    if (playerType === PlayerType.ONE) {
      setCurrPlayer(p1);
      setOppPlayer(p2);
      setBoard({
        ...partOfBoard,
        currentPSlots: gameBoard.one ?? [],
        opponentPSlots: gameBoard.two ?? [],
      });
    } else {
      setCurrPlayer(p2);
      setOppPlayer(p1);
      setBoard({
        ...partOfBoard,
        currentPSlots: gameBoard.two ?? [],
        opponentPSlots: gameBoard.one ?? [],
      });
    }
    const newRound = game.round;
    if (round) {
      checkAndDrawCardFromMainDeck(newRound);
    }
    setRound(newRound);

    if (
      _.isEmpty(gameBoard?.mainDeck) &&
      round?.player === playerType &&
      !_.isEmpty(gameBoard?.powerGY)
    ) {
      revertMainDeck();
    }
  }, [game]);

  const revertMainDeck = async () => {
    const powerGY = (await getItemsOnce('rooms/' + roomId + '/board/powerGY')) as string[];
    await setItem('rooms/' + roomId + '/board/', { powerGY: [] });
    await setItem('rooms/' + roomId + '/board/', { mainDeck: _.shuffle(powerGY) });
  };

  const checkAndDrawCardFromMainDeck = ({ player, nb }: Round) => {
    if (nb > round!?.nb && !!round!.nb && player != round!.player && player === playerType) {
      drawCardFromMainDeck(roomId, playerType).then();
    }
  };

  if (!isGameRunning(game.status) || !board || !opponentPlayer || !currentPlayer || !round)
    return <></>;

  return (
    <GameView
      round={round}
      roomId={roomId}
      board={board}
      opponentPlayer={opponentPlayer}
      currentPlayer={currentPlayer}
    />
  );
}
