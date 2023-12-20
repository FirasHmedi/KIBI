import { useNavigate } from 'react-router-dom';
import { flexColumnStyle, violet } from '../styles/Style';
import { CARDS_PATH } from '../utils/data';
import { Seperator } from './Elements';

function Sidebar() {
	const navigate = useNavigate();
	return (
		<div
			style={{
				width: '15vw',
				color: 'white',
				backgroundColor: violet,
				padding: 4,
				gap: 10,
				...flexColumnStyle,
				alignItems: 'safe center',
			}}>
			<Seperator />
			<button onClick={() => navigate(CARDS_PATH)}>
				<h4 style={{}}>Cards</h4>
			</button>
			{/*
			<button onClick={() => navigate(WALKTHROUGH_PATH)}>
				<h4 style={{}}>Walkthrough</h4>
			</button>
			*/}
			<div style={{ ...flexColumnStyle, justifyContent: 'flex-start', alignItems: 'flex-start' }}>
				<h5>Rules</h5>
				<ul
					style={{
						...flexColumnStyle,
						justifyContent: 'flex-start',
						alignItems: 'flex-start',
						gap: 8,
					}}>
					<li>
						<h6>Animals abilities are activated when their clan's element is set</h6>
					</li>
					<li>
						<h6>No attack on first round</h6>
					</li>
					<li>
						<h6>3 Animals on board defend their player</h6>
					</li>
					<li>
						<h6>Player can be attacked if no animal defends him</h6>
					</li>
				</ul>
			</div>
		</div>
	);
}

export default Sidebar;
