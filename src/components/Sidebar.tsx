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
					marginTop: '5rem',
				}}>
				<button onClick={() => window.open('https://discord.gg/CrAy2vKQ', '_blank')}>
					<h4 style={{}}>Discord server</h4>
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
					<li>Player attacks once per round. Lion in element can attack 2 animals</li>
					<br />
					<li>
						3 animals defend the opponent (Player cant attack opponent directly if he has 3 animals
						on board)
					</li>
					<br />
					<li>
						Player can attack the opponent if he has no animal to defend, Eagle in element can
						attack Opponent if he has 1 or 2 animals on Board.
					</li>
					<br />
					<li>
						If the player has 3 animals of the same activated element, All animals AP are doubled.
					</li>
				</ul>
			</div>
		</div>
	);
}

export default Sidebar;
