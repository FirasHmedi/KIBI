import React from 'react';
import { violet } from '../styles/Style';

function Sidebar() {
	return (
		<div style={{ width: '15vw', color: violet, backgroundColor: '#ecf0f1', padding: 4 }}>
			<div>
				<h5>Rules</h5>
				<ul style={{}}>
					<li>
						<h6>3 Animals in board defend their player from being attacked</h6>
					</li>
					<li>
						<h6>Player is attackable if no animal defends him</h6>
					</li>
					<li>
						<h6>Animals defend their king from being attacked</h6>
					</li>
					<li>
						<h6>King ability in its element is to attack opponent player</h6>
					</li>
				</ul>
			</div>
		</div>
	);
}

export default Sidebar;
