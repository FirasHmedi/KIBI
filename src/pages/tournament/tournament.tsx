import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import short from 'short-uuid';
import { getItemsOnce, setItem, subscribeToItems } from '../../backend/db';
import { buttonStyle, homeButtonsStyle, violet } from '../../styles/Style';
import { EMPTY_SLOT, GAMES_PATH, RUNNING, TOURNAMENT_PATH } from '../../utils/data';
import { Player, PlayerType, Tournament } from '../../utils/interface';

import { shuffle } from 'lodash';
import 'react-toastify/dist/ReactToastify.css';
import { getMainDeckFirstHalf, getMainDeckSecondHalf } from '../../utils/helpers';

function TournamentPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const { tournId, currentUser } = location.state;
	const [tournamentStatus, setTournamentStatus] = useState('waiting');
	const [tourn, setTourn] = useState<Tournament>();
	const [players, setPlayers] = useState<Player[]>([]);
	const [creator, setCreator] = useState<string>('');
	const [gamesId, setGamesId] = useState<string[]>([]);

	useEffect(() => {
		const fetchTournamentData = async () => {
			const playersPath = `/tournaments/${tournId}/players`;
			const creatorPath = `/tournaments/${tournId}/creator/name`;

			const [playersData, creatorData] = await Promise.all([
				getItemsOnce(playersPath),
				getItemsOnce(creatorPath),
			]);

			setPlayers(Object.values(playersData));
			setCreator(creatorData);
		};

		fetchTournamentData();
	}, [tournId]);

	const subscribeToTournament = async () => {
		await subscribeToItems(TOURNAMENT_PATH + tournId, setTourn);
	};

	useEffect(() => {
		subscribeToTournament();
	}, []);

	const isCreator = currentUser && currentUser.userName === creator;

	const game1Players = players.slice(0, 2);
	const game2Players = players.slice(2, 4);
	const game1Id = short.generate().slice(0, 6);
	const game2Id = short.generate().slice(0, 6);

	const beginTournament = async () => {
		if (players.length !== 4) {
			toast.error('Tournament must have exactly 4 players to begin!');
			return;
		}

		try {
			game1Players[0].playerType = PlayerType.ONE;
			game1Players[1].playerType = PlayerType.TWO;
			game2Players[0].playerType = PlayerType.ONE;
			game2Players[1].playerType = PlayerType.TWO;

			const mainDeck1: string[] = shuffle([...getMainDeckFirstHalf(), ...getMainDeckSecondHalf()]);
			const mainDeck2: string[] = shuffle([...getMainDeckFirstHalf(), ...getMainDeckSecondHalf()]);

			const initialPowers1 = mainDeck1.splice(-4, 4);
			const initialPowers2 = mainDeck2.splice(-4, 4);

			setItem(GAMES_PATH + game1Id, {
				status: RUNNING,
				round: {
					player: PlayerType.ONE,
					nb: 1,
				},
				board: {
					mainDeck1,
					one: [EMPTY_SLOT, EMPTY_SLOT, EMPTY_SLOT],
					two: [EMPTY_SLOT, EMPTY_SLOT, EMPTY_SLOT],
				},
				playerToSelect: PlayerType.ONE,
				initialPowers: initialPowers1,
			});

			setItem(GAMES_PATH + game2Id, {
				status: RUNNING,
				round: {
					player: PlayerType.ONE,
					nb: 1,
				},
				board: {
					mainDeck2,
					one: [EMPTY_SLOT, EMPTY_SLOT, EMPTY_SLOT],
					two: [EMPTY_SLOT, EMPTY_SLOT, EMPTY_SLOT],
				},
				playerToSelect: PlayerType.ONE,
				initialPowers: initialPowers2,
			});

			await setItem(`/tournaments/${tournId}/status`, { name: 'started' });
			setTournamentStatus('started');
			console.log(tournamentStatus);
		} catch (error) {
			console.error('Failed to start tournament:', error);
			toast.error('Failed to start the tournament.');
		}
	};
	useEffect(() => {
		async function checkTournamentStatus() {
			try {
				if (tournamentStatus === 'started') {
					if (
						currentUser.userName === game1Players[0].playerName ||
						currentUser.userName === game1Players[1].playerName
					) {
						navigate('/game/' + game1Id, {
							state: {
								gameId: game1Id,
								playerName: currentUser.userName,
								playerType:
									currentUser.userName === game1Players[0].playerName
										? PlayerType.ONE
										: PlayerType.TWO,
							},
						});
					} else {
						navigate('/game/' + game2Id, {
							state: {
								gameId: game2Id,
								playerName: currentUser.userName,
								playerType:
									currentUser.userName === game2Players[0].playerName
										? PlayerType.ONE
										: PlayerType.TWO,
							},
						});
					}
				}
			} catch (error) {
				console.error('Error checking tournament status:', error);
			}
		}
		checkTournamentStatus();
	}, [tournId, currentUser, navigate, tournamentStatus]);

	return (
		<div>
			<h4 style={{ color: violet }}>
				Tournaments ID: <span style={{ fontSize: '1.2em', userSelect: 'all' }}>{tournId}</span>
			</h4>

			<div
				style={{
					position: 'absolute',
					top: '20vh',
					right: '5vw',
					display: 'flex',
					alignItems: 'center',
					borderRadius: 5,
					flexDirection: 'column',
					gap: 6,
					overflowY: 'auto',
					maxHeight: '70vh',
					overflowX: 'hidden',
				}}>
				<h3 style={{ color: violet, fontWeight: 'bold' }}>Players</h3>
				<table style={{ width: '12vw' }}>
					<tbody>
						{players.map((player, index) => (
							<tr key={index}>
								<td
									style={{
										padding: 4,
										color: 'violet',
										display: 'flex',
										alignItems: 'center',
										flexDirection: 'column',
									}}>
									<h5>{player.playerName}</h5>
								</td>
							</tr>
						))}
					</tbody>
				</table>
				{isCreator && (
					<button
						style={{
							...buttonStyle,
							...homeButtonsStyle,
							fontSize: '1rem',
						}}
						//disabled={!isButtonEnabled}
						onClick={beginTournament}>
						Begin Tournament
					</button>
				)}
			</div>
		</div>
	);
}

export default TournamentPage;
