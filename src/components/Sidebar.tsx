import { useNavigate } from 'react-router-dom';
import { flexColumnStyle, violet } from '../styles/Style';
import { CARDS_PATH } from '../utils/data';

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
					gap: 20,
				}}>
				<button onClick={() => window.open('https://discord.gg/CrAy2vKQ', '_blank')}>
					<h4 style={{ textDecoration: 'underline' }}>Discord server</h4>
				</button>
				<button onClick={() => navigate(CARDS_PATH)}>
					<h4 style={{}}>Cards</h4>
				</button>
			</div>
			<div
				style={{
					...flexColumnStyle,
					justifyContent: 'flex-start',
					alignItems: 'flex-start',
					textAlign: 'start',
					fontSize: '0.8rem',
				}}>
				<h2 style={{ fontWeight: 'bold' }}>Rules</h2>
				<ul>
					<li>In the first round, Players cant attack.</li>
					<br />
					<li>Player attacks once per round. Lion gives an extra attack in its element</li>
					<br />
					<li>
						Player can attack the opponent if he has no animal to defend, Eagle in element can
						attack Opponent directly.
					</li>
					<br />
					<li>Animals can be sacrificed from the board. Player gets +2hp per sacrifice. </li>
				</ul>
			</div>
		</div>
	);
}

export default Sidebar;
