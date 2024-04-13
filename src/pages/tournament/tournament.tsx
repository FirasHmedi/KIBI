import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Player, Tournament } from "../../utils/interface";
import { getItemsOnce, subscribeToItems } from "../../backend/db";
import { TOURNAMENT_PATH } from "../../utils/data";
import { buttonStyle, homeButtonsStyle, violet } from "../../styles/Style";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function TournamentPage() {
    const location = useLocation();
    const { tournId ,currentUser} = location.state;
    const [tourn, setTourn] = useState<Tournament>();
    const [players, setPlayers] = useState<Player[]>([]);
    const [creator, setCreator] = useState<string>('');

    useEffect(() => {
        const fetchTournamentData = async () => {
            const playersPath = `/tournaments/${tournId}/players`;
            const creatorPath = `/tournaments/${tournId}/creator/name`;

            const [playersData, creatorData] = await Promise.all([
                getItemsOnce(playersPath),
                getItemsOnce(creatorPath)
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
    const handleBeginClick = () => {
        if (players.length !== 4) {
            console.log("fghjk")
            toast.error('Tournament must have exactly 4 players to begin!');
            return;
        }

        console.log('Tournament started!');
    };

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
                <h3 style={{ color: 'violet', fontWeight: 'bold' }}>Players joined</h3>
                <table style={{ width: '12vw' }}>
                    <tbody>
                        {players.map((player, index) => (
                            <tr key={index}>
                                <td style={{ padding: 4, color: 'violet', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
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
                    }}
                        //disabled={!isButtonEnabled}
                        onClick={handleBeginClick}>
                        Begin Tournament
                    </button>
                )}
            </div>
        </div>
    );
}

export default TournamentPage;