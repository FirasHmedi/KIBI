import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { GameContainer } from '../../components/GameContainer';
import { SharedSelection } from '../../components/SharedSelection';
import { centerStyle, flexColumnStyle, violet } from '../../styles/Style';
import { GAMES_PATH, RUNNING } from '../../utils/data';
import { isGameInPreparation, isGameRunning } from '../../utils/helpers';
import { Game, PlayerType } from '../../utils/interface';
import { subscribeToItems, setItem } from '../../backend/db';

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

		if (game?.one?.cardsIds?.length === 12 && game?.two?.cardsIds?.length === 12 && !isGameRunning(game?.status)) {
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
				<div style={{ color: violet }}>
					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'center',
							alignItems: 'center',
							padding: 10,
							paddingTop: 30,
						}}>
						<h4>
							Game ID: <span style={{ fontSize: '1.2em', color: violet, userSelect: 'all' }}>{gameId}</span>
						</h4>
					</div>
					<SharedSelection
						playerType={playerType}
						gameId={gameId}
						oneCards={game?.one?.cardsIds ?? []}
						twoCards={game?.two?.cardsIds ?? []}
						playerToSelect={game?.playerToSelect}
						powerCards={game?.initialPowers}
					/>
				</div>
			)}
		</div>
	);
}

export default GamePage;
