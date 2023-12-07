import { shuffle } from 'lodash';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getGamePath, setItem, subscribeToItems } from '../../backend/db';
import { GameContainer } from '../../components/GameContainer';
import {
	buttonStyle,
	centerStyle,
	flexColumnStyle,
	neutralColor,
	violet,
} from '../../styles/Style';
import { ANIMALS_CARDS, GAMES_PATH, INITIAL_DECK_COUNT, KING, RUNNING } from '../../utils/data';
import { isGameInPreparation, isGameRunning } from '../../utils/helpers';
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

	const submitRandomSelection = async () => {
		const oneCardsIds: string[] = [];
		const twoCardsIds: string[] = [];
		let i = 0,
			j = 0;
		const animalsWithoutKings = shuffle(ANIMALS_CARDS)
			.filter(({ role, id }) => {
				if (role === KING) {
					if (i < 2) {
						oneCardsIds.push(id);
						i++;
					} else if (j < 2) {
						twoCardsIds.push(id);
						j++;
					}
					return false;
				}
				return true;
			})
			.map(animal => animal.id);

		animalsWithoutKings.forEach((id, index) => {
			index < 6 ? oneCardsIds.push(id) : twoCardsIds.push(id);
		});

		const powers = game?.initialPowers ?? [];
		oneCardsIds.push(...powers.filter((_: any, index: number) => index < 2));
		twoCardsIds.push(...powers.filter((_: any, index: number) => index >= 2));

		await setItem(getGamePath(gameId) + PlayerType.ONE, {
			cardsIds: oneCardsIds,
		});

		await setItem(getGamePath(gameId) + PlayerType.TWO, {
			cardsIds: twoCardsIds,
		});

		await setItem(getGamePath(gameId), {
			playerToSelect: PlayerType.ONE,
		});
	};

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
						onClick={() => submitRandomSelection()}>
						LAUNCH
					</button>
					{/*<SharedSelection
						playerType={playerType}
						gameId={gameId}
						oneCards={game?.one?.cardsIds ?? []}
						twoCards={game?.two?.cardsIds ?? []}
						playerToSelect={game?.playerToSelect}
						powerCards={game?.initialPowers}
						/>*/}
				</div>
			)}
		</div>
	);
}

export default GamePage;
