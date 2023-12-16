import { MdCancel } from 'react-icons/md';
import { airColor, centerStyle, earthColor, fireColor, violet, waterColor } from '../styles/Style';
import { AIR, ClanName, EARTH, FIRE, WATER, elementsIcons } from '../utils/data';

export const Seperator = ({ h }: { h?: string }) => {
	const height = h ?? '2vh';
	return <div style={{ height }} />;
};

export const ElementPopup = ({
	changeElement,
}: {
	changeElement: (elementType?: ClanName) => void;
}) => (
	<div
		style={{
			position: 'absolute',
			top: 0,
			left: 0,
			height: '100%',
			width: '100%',
			backgroundColor: 'rgba(0, 0, 0, 0.6)',
			zIndex: 1,
		}}>
		<button
			style={{ position: 'absolute', right: '35vw', top: '25vh' }}
			onClick={() => changeElement()}>
			<MdCancel style={{ color: 'white', width: '3vw', height: 'auto' }} />
		</button>
		<div
			style={{
				position: 'absolute',
				left: 0,
				right: 0,
				top: 0,
				bottom: 0,
				margin: 'auto',
				height: '20vw',
				width: '20vw',
				zIndex: 10,
			}}>
			<div style={{ display: 'flex', flexDirection: 'row' }}>
				<div
					style={{
						width: '10vw',
						height: '10vw',
						backgroundColor: fireColor,
						...centerStyle,
						zIndex: 11,
					}}
					onClick={() => changeElement('fire')}>
					<img
						src={elementsIcons[FIRE]}
						style={{ width: '6vw', backgroundSize: 'cover', backgroundPosition: 'center' }}></img>
				</div>
				<div
					style={{
						width: '10vw',
						height: '10vw',
						backgroundColor: airColor,
						...centerStyle,
						zIndex: 11,
					}}
					onClick={() => changeElement('air')}>
					<img
						src={elementsIcons[AIR]}
						style={{ width: '6vw', backgroundSize: 'cover', backgroundPosition: 'center' }}></img>
				</div>
			</div>
			<div style={{ display: 'flex', flexDirection: 'row' }}>
				<div
					style={{
						width: '10vw',
						height: '10vw',
						backgroundColor: waterColor,
						...centerStyle,
						zIndex: 11,
					}}
					onClick={() => changeElement('water')}>
					<img
						src={elementsIcons[WATER]}
						style={{ width: '6vw', backgroundSize: 'cover', backgroundPosition: 'center' }}></img>
				</div>
				<div
					style={{
						width: '10vw',
						height: '10vw',
						backgroundColor: earthColor,
						...centerStyle,
						zIndex: 11,
					}}
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
			fontWeight: 'bold',
			color: violet,
		}}>
		<h6>ROUND {Math.floor(nb / 2)}</h6>
	</div>
);
