import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { subscribeToItems } from '../../backend/db';
import { GameContainer } from '../../components/GameContainer';
import { centerStyle, flexColumnStyle } from '../../styles/Style';
import { GAMES_PATH } from '../../utils/data';
import { Game } from '../../utils/interface';

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

	return (
		<div
			style={{
				...flexColumnStyle,
				...centerStyle,
				justifyContent: 'flex-start',
				height: '100%',
			}}>
			<GameContainer game={game!} gameId={gameId} playerType={playerType} spectator={spectator} />
		</div>
	);
}

export default GamePage;
