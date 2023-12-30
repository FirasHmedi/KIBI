import { useNavigate } from 'react-router-dom';
import { flexColumnStyle, violet } from '../styles/Style';
import { CARDS_PATH, WALKTHROUGH_PATH } from '../utils/data';

function Sidebar() {
	const navigate = useNavigate();
	return (
		<div
			style={{
				width: '15vw',
				color: 'white',
				backgroundColor: violet,
				gap: 10,
				...flexColumnStyle,
				justifyContent: 'space-between',
				padding: 10,
			}}>
			<div
				style={{
					...flexColumnStyle,
					backgroundColor: violet,
					gap: 10,
				}}>
				<button onClick={() => navigate(CARDS_PATH)}>
					<h4 style={{}}>Cards</h4>
				</button>
				<button onClick={() => navigate(WALKTHROUGH_PATH)}>
					<h4 style={{}}>Walkthrough</h4>
				</button>
			</div>
			<div
				style={{
					...flexColumnStyle,
					justifyContent: 'flex-start',
					alignItems: 'flex-start',
					textAlign: 'start',
					position: 'relative',
					bottom: 0,
				}}>
				<h5 style={{ fontWeight: 'bold' }}>Rules</h5>
				<h6>- Element activates Animals abilities</h6>
				<h6>- No attack in first round</h6>
				<h6>- 3 Animals on board defend their player</h6>
				<h6>- Player can be attacked if no animal defends him</h6>
			</div>
		</div>
	);
}

export default Sidebar;
