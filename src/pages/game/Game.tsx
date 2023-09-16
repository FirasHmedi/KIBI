import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { GameContainer } from '../../components/GameContainer';
import { SharedSelection } from '../../components/SharedSelection';
import { centerStyle, flexColumnStyle, greyBackground, violet } from '../../styles/Style';
import { ROOMS_PATH, RUNNING } from '../../utils/data';
import { getBoardPath, setItem, subscribeToItems } from '../../utils/db';
import { isGameInPreparation, isGameRunning } from '../../utils/helpers';
import { Game, PlayerType } from '../../utils/interface';

function GamePage() {
	const location = useLocation();
	const { roomId, playerType, spectator } = location.state;
	const [game, setGame] = useState<Game>();

	const subscribeToRoom = async () => {
		await subscribeToItems(ROOMS_PATH + roomId, setGame);
	};

	useEffect(() => {
		subscribeToRoom();
	}, []);

	useEffect(() => {
		if (spectator) return;

		if (game?.one?.cardsIds?.length === 9 && game?.two?.cardsIds?.length === 9 && !isGameRunning(game?.status)) {
			const powerNotChoosed = (game.initialPowers ?? [])?.find(
				id => id !== game?.one?.cardsIds[8] || id !== game?.two?.cardsIds[8],
			);
			setItem(ROOMS_PATH + roomId, {
				status: RUNNING,
				round: {
					player: PlayerType.ONE,
					nb: 1,
				},
			});
			if (!_.isEmpty(powerNotChoosed)) {
				setItem(getBoardPath(roomId), {
					mainDeck: _.shuffle([...game.board.mainDeck, powerNotChoosed]),
				});
			}
		}
	}, [game]);

	return (
		<div
			style={{
				...flexColumnStyle,
				...centerStyle,
				backgroundColor: greyBackground,
				justifyContent: 'flex-start',
				height: '100%',
			}}>
			{isGameRunning(game?.status) && (
				<GameContainer game={game!} roomId={roomId} playerType={playerType} spectator={spectator} />
			)}

			{!spectator && isGameInPreparation(game?.status) && (
				<div style={{ color: violet }}>
					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'center',
							alignItems: 'center',
							gap: 4,
						}}>
						<h4>
							Room ID: <span style={{ fontSize: '1.1em', color: violet, userSelect: 'all' }}>{roomId}</span>
						</h4>
					</div>
					<SharedSelection
						playerType={playerType}
						roomId={roomId}
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
