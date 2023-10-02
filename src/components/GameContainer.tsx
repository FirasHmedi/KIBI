import _ from 'lodash';
import { useEffect, useState } from 'react';
import { isGameRunning } from '../utils/helpers';
import { Board, DefaultBoard, Game, Player, PlayerType, Round } from '../utils/interface';
import { GameView } from './GameView';
import { revertMainDeck, drawCardFromMainDeck } from '../backend/actions';

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
	const [showCountDown, setShowCountDown] = useState(false);

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
				currentPSlots: gameBoard?.one ?? [],
				opponentPSlots: gameBoard?.two ?? [],
			});
		} else {
			setCurrPlayer(p2);
			setOppPlayer(p1);
			setBoard({
				...partOfBoard,
				currentPSlots: gameBoard?.two ?? [],
				opponentPSlots: gameBoard?.one ?? [],
			});
		}

		const newRound = game.round;
		if (round && !spectator) {
			checkAndDrawCardFromMainDeck(newRound);
		}
		setRound(newRound);

		if (
			_.isEmpty(gameBoard?.mainDeck) &&
			round?.player === playerType &&
			!_.isEmpty(gameBoard?.powerGY) &&
			!spectator
		) {
			revertMainDeck(gameId);
		}
	}, [game]);

	const checkAndDrawCardFromMainDeck = ({ player, nb }: Round) => {
		if (nb > round!?.nb && !!round!.nb && player != round!.player && player === playerType) {
			drawCardFromMainDeck(gameId, playerType).then();
			setShowCountDown(true);
		}
	};

	if (!isGameRunning(game.status) || !board || !opponentPlayer || !currentPlayer || !round) return <></>;

	return (
		<GameView
			round={round}
			gameId={gameId}
			board={board}
			opponentPlayer={opponentPlayer}
			currentPlayer={currentPlayer}
			spectator={spectator}
			showCountDown={showCountDown}
			setShowCountDown={setShowCountDown}
		/>
	);
}
