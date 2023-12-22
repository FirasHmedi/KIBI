import isEmpty from 'lodash/isEmpty';
import { useEffect, useRef, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { drawCardFromMainDeck, revertMainDeck } from '../backend/actions';
import { getItemsOnce } from '../backend/db';
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
	const [logs, setLogs] = useState<string[]>([]);

	useEffect(() => {
		if (!isGameRunning(game.status)) {
			return;
		}

		const board = game.board;
		const partOfBoard: Board = {
			mainDeck: board?.mainDeck ?? DefaultBoard.mainDeck,
			animalGY: board?.animalGY ?? DefaultBoard.animalGY,
			powerGY: board?.powerGY ?? DefaultBoard.powerGY,
			elementType: board?.elementType ?? DefaultBoard.elementType,
			activeCardId: board?.activeCardId ?? DefaultBoard.activeCardId,
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
				currPSlots: board?.one ?? [],
				oppPSlots: board?.two ?? [],
			});
		} else {
			setCurrPlayer(p2);
			setOppPlayer(p1);
			setBoard({
				...partOfBoard,
				currPSlots: board?.two ?? [],
				oppPSlots: board?.one ?? [],
			});
		}
	}, [game]);

	//add card to next player and set countdown
	useEffect(() => {
		if (!isGameRunning(game.status)) {
			return;
		}
		const newRound = game.round;
		if (round && !spectator) {
			checkAndDrawCardFromMainDeck(newRound);
		}
		setRound(newRound);
	}, [game]);

	const getLogs = async () => {
		const logsObject = (await getItemsOnce('/logs/' + gameId + '/log/')) ?? {};
		console.log('objects ', logsObject);
		const logsArray: string[] = (Object.values(logsObject) ?? []).map((val: any) => val.action);
		console.log('logs ', logsArray);
		setLogs(logsArray);
	};

	useEffect(() => {
		getLogs();
	}, [game]);

	//add log
	useEffect(() => {
		if (!isGameRunning(game.status)) {
			return;
		}
	}, [game]);

	//Revert main deck
	useEffect(() => {
		if (!isGameRunning(game.status)) {
			return;
		}
		const gameBoard = game.board;
		if (isEmpty(gameBoard?.mainDeck) && !isEmpty(gameBoard?.powerGY) && !spectator) {
			revertMainDeck(gameId);
		}
	}, [game]);

	const checkAndDrawCardFromMainDeck = async ({ player, nb }: Round) => {
		if (nb > round!?.nb && !!round!.nb && player != round!.player && player === playerType) {
			showCountDown.current = true;
			await drawCardFromMainDeck(gameId, playerType);
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
				logs={logs}
			/>
		</DndProvider>
	);
}
