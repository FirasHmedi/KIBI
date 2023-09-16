import React from 'react';
import { greyBackground, violet } from '../styles/Style';

function Sidebar() {
	return (
		<div style={{ width: '15vw', color: violet, backgroundColor: greyBackground, padding: 4 }}>
			<div>
				<h5>Rules</h5>
				<ul style={{}}>
					<li>
						<h6>3 Animals in board defend their player from being attacked</h6>
					</li>
					<li>
						<h6>Player is attackable if no animal defends him</h6>
					</li>
				</ul>
			</div>
		</div>
	);
}

export default Sidebar;
