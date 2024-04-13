import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { violet } from '../../styles/Style';
import { Tournament } from '../../utils/interface';
import { TOURNAMENT_PATH } from '../../utils/data';
import { subscribeToItems } from '../../backend/db';

function TournamentPage() {
    const location = useLocation();
    const {tournId} = location.state;
    const [tourn, setTourn] = useState<Tournament>();

	const subscribeToTournament = async () => {
		await subscribeToItems(TOURNAMENT_PATH + tournId, setTourn);
	};

	useEffect(() => {
		subscribeToTournament();
	}, []);



    return (
        <div>
            <h4 style={{ color: violet }}>
					Tournaments ID: <span style={{ fontSize: '1.2em', userSelect: 'all' }}>{tournId}</span>
				</h4>
        </div>
    );
}

export default TournamentPage;