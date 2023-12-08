import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { setItem, subscribeToItems } from '../../backend/db';
import { GameContainer } from '../../components/GameContainer';
import {
	buttonStyle,
	centerStyle,
	flexColumnStyle,
	neutralColor,
	violet,
} from '../../styles/Style';
import { GAMES_PATH, INITIAL_DECK_COUNT, RUNNING } from '../../utils/data';
import { isGameInPreparation, isGameRunning, submitRandomSelection } from '../../utils/helpers';
import { Game, PlayerType } from '../../utils/interface';

function GamePage() {
	const location = useLocation();
	const { gameId, playerType, spectator } = location.state;
	const [game, setGame] = useState<Game>();

	const subscribeToGame = async () => {
		await subscribeToItems(GAMES_PATH + gameId, setGame);
	};

	useEffect(() => {
		subscribeToGame();
	}, []);

	useEffect(() => {
		if (spectator) return;

		if (
			game?.one?.cardsIds?.length === INITIAL_DECK_COUNT &&
			game?.two?.cardsIds?.length === INITIAL_DECK_COUNT &&
			!isGameRunning(game?.status)
		) {
			setItem(GAMES_PATH + gameId, {
				status: RUNNING,
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
				justifyContent: 'flex-start',
				height: '100%',
			}}>
			{isGameRunning(game?.status) && (
				<GameContainer game={game!} gameId={gameId} playerType={playerType} spectator={spectator} />
			)}

			{!spectator && isGameInPreparation(game?.status) && (
				<div
					style={{
						color: violet,
						...flexColumnStyle,
						gap: 20,
						...centerStyle,
						justifyContent: 'center',
						height: '100%',
					}}>
					<h4>
						Game ID: <span style={{ fontSize: '1.2em', userSelect: 'all' }}>{gameId}</span>
					</h4>
					<button
						style={{
							...buttonStyle,
							backgroundColor: playerType !== PlayerType.ONE ? neutralColor : violet,
							padding: 4,
							fontSize: 14,
						}}
						disabled={playerType !== PlayerType.ONE}
						onClick={() => submitRandomSelection(gameId, game?.initialPowers)}>
						LAUNCH
					</button>
				</div>
			)}
		</div>
	);
}

export default GamePage;
