import { airColor, centerStyle, earthColor, fireColor, violet, waterColor } from '../styles/Style';
import { AIR, ClanName, EARTH, FIRE, WATER, elementsIcons } from '../utils/data';

export const Seperator = ({ h }: { h?: string }) => {
	const height = h ?? '2vh';
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
					style={{ width: '8vw', height: '8vw', backgroundColor: fireColor, ...centerStyle }}
					onClick={() => changeElement('fire')}>
					<img
						src={elementsIcons[FIRE]}
						style={{ width: '6vw', backgroundSize: 'cover', backgroundPosition: 'center' }}></img>
				</div>
				<div
					style={{ width: '8vw', height: '8vw', backgroundColor: airColor, ...centerStyle }}
					onClick={() => changeElement('air')}>
					<img
						src={elementsIcons[AIR]}
						style={{ width: '6vw', backgroundSize: 'cover', backgroundPosition: 'center' }}></img>
				</div>
			</div>
			<div style={{ display: 'flex', flexDirection: 'row' }}>
				<div
					style={{
						width: '8vw',
						height: '8vw',
						backgroundColor: waterColor,
						...centerStyle,
					}}
					onClick={() => changeElement('water')}>
					<img
						src={elementsIcons[WATER]}
						style={{ width: '6vw', backgroundSize: 'cover', backgroundPosition: 'center' }}></img>
				</div>
				<div
					style={{ width: '8vw', height: '8vw', backgroundColor: earthColor, ...centerStyle }}
					onClick={() => changeElement('earth')}>
					<img
						src={elementsIcons[EARTH]}
						style={{ width: '6vw', backgroundSize: 'cover', backgroundPosition: 'center' }}></img>
				</div>
			</div>
		</div>
	</div>
);

export const RoundView = ({ nb = 1 }: { nb: number }) => (
	<div
		style={{
			width: '17vw',
			fontSize: '0.8em',
			fontWeight: 'bold',
			color: violet,
		}}>
		ROUND #{Math.floor(nb / 2)}
	</div>
);
