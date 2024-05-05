import { isNil, reverse } from 'lodash';
import isEmpty from 'lodash/isEmpty';
import { useEffect, useRef, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { toast } from 'react-toastify';
import { drawCardFromMainDeck, revertMainDeck } from '../backend/actions';
import { getItemsOnce } from '../backend/db';
import { CurrPlayerViewButtonsStyle, violet } from '../styles/Style';
import { BOT } from '../utils/data';
import { isGameFinished, isGameInPreparation, isGameRunning } from '../utils/helpers';
import { Board, DefaultBoard, Game, Player, PlayerType, Round } from '../utils/interface';
import { GameView } from './GameView';

export function GameContainer({
	game,
	playerType,
	gameId,
	spectator,
	ROUND_DURATION,
}: {
	game: Game;
	playerType: PlayerType;
	gameId: string;
	spectator?: boolean;
	ROUND_DURATION: number;
}) {
	const [board, setBoard] = useState<Board>();
	const [round, setRound] = useState<Round>();
	const [currentPlayer, setCurrPlayer] = useState<Player>();
	const [opponentPlayer, setOppPlayer] = useState<Player>();
	const showCountDown = useRef(false);
	const [logs, setLogs] = useState<string[]>([]);

	useEffect(() => {
		if (!isGameFinished(game?.status) && !isGameRunning(game?.status)) {
			return;
		}

		const board = game?.board;
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

	const winner = game?.winner;

	//add card to next player and set countdown
	useEffect(() => {
		if (isGameInPreparation(game?.status)) {
			return;
		}
		const newRound = game?.round;
		if (round && !spectator && !isGameFinished(game?.status)) {
			checkAndDrawCardFromMainDeck(newRound);
		}
		setRound(newRound);
	}, [game]);

	const getLogs = async () => {
		const logsObject = (await getItemsOnce('/logs/' + gameId + '/log/')) ?? {};
		const logsArray: string[] = Object.values(logsObject).map((val: any) => val.action);
		setLogs(reverse(logsArray));
	};

	useEffect(() => {
		getLogs();
	}, [game]);

	//Revert main deck
	useEffect(() => {
		if (!isGameRunning(game?.status)) {
			return;
		}
		const gameBoard = game?.board;
		if (isEmpty(gameBoard?.mainDeck) && !isEmpty(gameBoard?.powerGY) && !spectator) {
			revertMainDeck(gameId);
		}
	}, [game]);

	const checkAndDrawCardFromMainDeck = async ({ player, nb }: Round) => {
		if (nb > round!?.nb && !!round!.nb && player != round!.player && player === playerType) {
			if (game?.two?.playerName != BOT) {
				showCountDown.current = true;
			}
			await drawCardFromMainDeck(gameId, playerType);
		}
	};

	const copyGameLink = () => {
		const link = window.location.host + '/connect?gameId=' + gameId;
		navigator.clipboard.writeText(link);
		toast.success('Copied', {
			position: toast.POSITION.TOP_RIGHT,
			autoClose: 500,
		});
	};

	if (
		(!isGameFinished(game?.status) && !isGameRunning(game?.status)) ||
		!board ||
		!opponentPlayer ||
		!currentPlayer ||
		!round
	)
		return <></>;

	return (
		<DndProvider backend={HTML5Backend}>
			{isNil(game?.two?.hp) && (
				<button
					onClick={() => copyGameLink()}
					style={{
						...CurrPlayerViewButtonsStyle,
						minWidth: undefined,
						width: undefined,
						padding: 8,
						backgroundColor: violet,
						fontSize: '1rem',
					}}>
					GAME LINK
				</button>
			)}
			<GameView
				round={game?.round}
				gameId={gameId}
				board={board}
				oppPlayer={opponentPlayer}
				currPlayer={currentPlayer}
				spectator={spectator}
				showCountDown={showCountDown}
				logs={logs}
				status={game?.status}
				winner={winner}
				ROUND_DURATION={ROUND_DURATION}
			/>
		</DndProvider>
	);
}
