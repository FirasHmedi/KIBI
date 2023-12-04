import isEmpty from 'lodash/isEmpty';
import { useEffect, useRef, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { drawCardFromMainDeck, revertMainDeck } from '../backend/actions';
import { isGameRunning } from '../utils/helpers';
import { Board, DefaultBoard, Game, Player, PlayerType, Round } from '../utils/interface';
import { GameView } from './GameView';

export function GameContainer({
	game,
	playerType,
	gameId,
	spectator,
}: {
	game: Game;
	playerType: PlayerType;
	gameId: string;
	spectator?: boolean;
}) {
	const [board, setBoard] = useState<Board>();
	const [round, setRound] = useState<Round>();
	const [currentPlayer, setCurrPlayer] = useState<Player>();
	const [opponentPlayer, setOppPlayer] = useState<Player>();
	const showCountDown = useRef(false);

	useEffect(() => {
		if (!isGameRunning(game.status)) {
			return;
		}

		const gameBoard = game.board;
		const partOfBoard: Board = {
			mainDeck: gameBoard?.mainDeck ?? DefaultBoard.mainDeck,
			animalGY: gameBoard?.animalGY ?? DefaultBoard.animalGY,
			powerGY: gameBoard?.powerGY ?? DefaultBoard.powerGY,
			elementType: gameBoard?.elementType ?? DefaultBoard.elementType,
			activeCardId: gameBoard?.activeCardId ?? DefaultBoard.activeCardId,
			currPSlots: [],
			oppPSlots: [],
		};

		const p1 = { ...game[PlayerType.ONE], playerType: PlayerType.ONE };
		const p2 = { ...game[PlayerType.TWO], playerType: PlayerType.TWO };
		p1.cardsIds = p1.cardsIds ?? [];
		p2.cardsIds = p2.cardsIds ?? [];

		if (playerType === PlayerType.ONE) {
			setCurrPlayer(p1);
			setOppPlayer(p2);
			setBoard({
				...partOfBoard,
				currPSlots: gameBoard?.one ?? [],
				oppPSlots: gameBoard?.two ?? [],
			});
		} else {
			setCurrPlayer(p2);
			setOppPlayer(p1);
			setBoard({
				...partOfBoard,
				currPSlots: gameBoard?.two ?? [],
				oppPSlots: gameBoard?.one ?? [],
			});
		}

		const newRound = game.round;
		if (round && !spectator) {
			checkAndDrawCardFromMainDeck(newRound);
		}
		setRound(newRound);

		if (
			isEmpty(gameBoard?.mainDeck) &&
			round?.player === playerType &&
			!isEmpty(gameBoard?.powerGY) &&
			!spectator
		) {
			revertMainDeck(gameId);
		}
	}, [game]);

	const checkAndDrawCardFromMainDeck = ({ player, nb }: Round) => {
		if (nb > round!?.nb && !!round!.nb && player != round!.player && player === playerType) {
			drawCardFromMainDeck(gameId, playerType).then();
			showCountDown.current = true;
		}
	};

	if (!isGameRunning(game.status) || !board || !opponentPlayer || !currentPlayer || !round)
		return <></>;

	return (
		<DndProvider backend={HTML5Backend}>
			<GameView
				round={game.round}
				gameId={gameId}
				board={board}
				oppPlayer={opponentPlayer}
				currPlayer={currentPlayer}
				spectator={spectator}
				showCountDown={showCountDown}
			/>
		</DndProvider>
	);
}
