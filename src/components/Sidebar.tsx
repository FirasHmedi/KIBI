import { violet } from '../styles/Style';

function Sidebar() {
	return (
		<div style={{ width: '15vw', color: violet, backgroundColor: '#ecf0f1', padding: 4 }}>
			<div>
				<h5>Rules</h5>
				<ul style={{}}>
					<li>
						<h6>The animals abilities can be used only if their clan's element is activated</h6>
					</li>
					<li>
						<h6>Animals cannot attack on the first round</h6>
					</li>
					<li>
						<h6>3 Animals in board defend their player from being attacked</h6>
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
