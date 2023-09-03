import { airColor, earthColor, fireColor, violet, waterColor } from '../styles/Style';
import { ClanName } from '../utils/data';

export const Seperator = ({ h }: { h?: string }) => {
	const height = h ?? '3vh';
	return <div style={{ height }} />;
};

export const ElementPopup = ({ changeElement }: { changeElement: (elementType: ClanName) => void }) => (
	<div
		style={{
			position: 'absolute',
			top: 0,
			left: 0,
			height: '100%',
			width: '100%',
			backgroundColor: 'rgba(0, 0, 0, 0.4)',
			zIndex: 1,
		}}>
		<div
			style={{
				position: 'absolute',
				left: 0,
				right: 0,
				top: 0,
				bottom: 0,
				margin: 'auto',
				height: '16vw',
				width: '16vw',
				zIndex: 10,
			}}>
			<div style={{ display: 'flex', flexDirection: 'row' }}>
				<div
					style={{ width: '8vw', height: '8vw', backgroundColor: fireColor }}
					onClick={() => changeElement('fire')}
				/>
				<div style={{ width: '8vw', height: '8vw', backgroundColor: airColor }} onClick={() => changeElement('air')} />
			</div>
			<div style={{ display: 'flex', flexDirection: 'row' }}>
				<div
					style={{ width: '8vw', height: '8vw', backgroundColor: waterColor }}
					onClick={() => changeElement('water')}
				/>
				<div
					style={{ width: '8vw', height: '8vw', backgroundColor: earthColor }}
					onClick={() => changeElement('earth')}
				/>
			</div>
		</div>
	</div>
);

export const RoundView = ({ nb = 1 }: { nb: number }) => (
	<div
		style={{
			position: 'absolute',
			left: '1vw',
			top: 0,
			bottom: 0,
			margin: 'auto',
			height: '4vh',
			fontSize: '0.8em',
			fontWeight: 'bold',
			color: violet,
		}}>
		Round {Math.floor(nb / 2)}
	</div>
);
