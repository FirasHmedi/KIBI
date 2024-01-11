import { FaHeart } from 'react-icons/fa6';
import { MdCancel } from 'react-icons/md';
import {
	airColor,
	centerStyle,
	earthColor,
	fireColor,
	flexColumnStyle,
	violet,
	waterColor,
} from '../styles/Style';
import { AIR, ClanName, EARTH, FIRE, WATER, elementsIcons } from '../utils/data';
import { Round } from '../utils/interface';

export const Seperator = ({ h, w }: { h?: string; w?: string }) => {
	const height = h ?? '2vh';
	const width = w ?? '2vw';
	return <div style={{ height, width }} />;
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
			zIndex: 2,
		}}>
		<button
			style={{ position: 'absolute', right: '35vw', top: '25vh' }}
			onClick={() => changeElement()}>
			<MdCancel style={{ color: 'white', width: '3vw', height: 'auto' }} />
		</button>
		<h2
			style={{
				position: 'absolute',
				top: '30vh',
				left: '40vw',
				width: '20vw',
				color: 'white',
				...centerStyle,
			}}>
			Set Element for 1 {'    '}
			<FaHeart style={{ color: 'white', fontSize: '1.3rem', marginLeft: 4 }} />
		</h2>
		<div
			style={{
				position: 'absolute',
				left: 0,
				right: 0,
				top: 0,
				bottom: 0,
				margin: 'auto',
				height: '14vw',
				width: '14vw',
				zIndex: 10,
				border: 5,
			}}>
			<div style={{ display: 'flex', flexDirection: 'row' }}>
				<div
					style={{
						width: '7vw',
						height: '7vw',
						backgroundColor: fireColor,
						...centerStyle,
						zIndex: 11,
					}}
					onClick={() => changeElement('fire')}>
					<img
						src={elementsIcons[FIRE]}
						style={{ width: '3vw', backgroundSize: 'cover', backgroundPosition: 'center' }}></img>
				</div>
				<div
					style={{
						width: '7vw',
						height: '7vw',
						backgroundColor: airColor,
						...centerStyle,
						zIndex: 11,
					}}
					onClick={() => changeElement('air')}>
					<img
						src={elementsIcons[AIR]}
						style={{ width: '3vw', backgroundSize: 'cover', backgroundPosition: 'center' }}></img>
				</div>
			</div>
			<div style={{ display: 'flex', flexDirection: 'row' }}>
				<div
					style={{
						width: '7vw',
						height: '7vw',
						backgroundColor: waterColor,
						...centerStyle,
						zIndex: 11,
					}}
					onClick={() => changeElement('water')}>
					<img
						src={elementsIcons[WATER]}
						style={{ width: '3vw', backgroundSize: 'cover', backgroundPosition: 'center' }}></img>
				</div>
				<div
					style={{
						width: '7vw',
						height: '7vw',
						backgroundColor: earthColor,
						...centerStyle,
						zIndex: 11,
					}}
					onClick={() => changeElement('earth')}>
					<img
						src={elementsIcons[EARTH]}
						style={{ width: '3vw', backgroundSize: 'cover', backgroundPosition: 'center' }}></img>
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

export const GameLeftInfo = ({ round, logs }: { round: Round; logs: any[] }) => (
	<div
		style={{
			position: 'absolute',
			left: '1vw',
			top: '35vh',
			...flexColumnStyle,
			gap: 12,
			alignItems: 'flex-start',
			color: violet,
			width: '18vw',
			fontSize: '1.2em',
		}}>
		<div style={{ ...centerStyle }}>
			<h6>{round.player.toUpperCase()} playing</h6>
		</div>
		<RoundView nb={round?.nb} />
		<div
			style={{
				...flexColumnStyle,
				justifyContent: 'flex-start',
				alignItems: 'flex-start',
				width: '15vw',
				height: '11vh',
				overflowY: 'auto',
			}}>
			{logs.map((log, index) => (
				<h6 key={index} style={{ fontSize: '0.5em' }}>
					{logs.length - index}- {log}
				</h6>
			))}
		</div>
	</div>
);

import { getOriginalCardId } from '../utils/helpers';
import twoAnimals from '/src/assets/icons/2-animals.svg';
import blockAttacks from '/src/assets/icons/block-attacks.svg';
import blockPowers from '/src/assets/icons/block-pow.svg';
import drawTwo from '/src/assets/icons/draw-2.svg';
import hpGain from '/src/assets/icons/hp-gain.svg';
import resetBoard from '/src/assets/icons/reset.svg';
import revAnyAnimal from '/src/assets/icons/rev-any-animal.svg';
import revAnyPower from '/src/assets/icons/rev-any-power.svg';
import revLastPower from '/src/assets/icons/rev-last-pow.svg';
import sacrificeAnimal from '/src/assets/icons/sacrifice-animal.svg';
import stealAnimal from '/src/assets/icons/steal-animal.svg';
import stealCard1hp from '/src/assets/icons/steal-card-1hp.svg';
import switchDecks from '/src/assets/icons/switch.svg';

export const powersPics = {
	blockAttacks,
	blockPowers,
	twoAnimals,
	drawTwo,
	hpGain,
	resetBoard,
	switchDecks,
	sacrificeAnimal,
	revLastPower,
	revAnyAnimal,
	revAnyPower,
	stealAnimal,
	stealCard1hp,
};

export const PowerCardIcon = ({ id }: { id: string }) => {
	let src;
	let h = '2.4rem',
		w = '2.4rem';
	switch (getOriginalCardId(id)) {
		case 'block-att':
			src = blockAttacks;
			break;
		case 'rev-last-pow':
			src = revLastPower;
			h = '2.6rem';
			w = '2.6rem';
			break;
		case 'rev-any-pow-1hp':
			src = revAnyPower;
			h = '3rem';
			w = '3rem';
			break;
		case 'steal-card-1hp':
			src = stealCard1hp;
			h = '3rem';
			w = '3rem';
			break;
		case 'rev-any-anim-1hp':
			src = revAnyAnimal;
			break;
		case 'steal-anim-3hp':
			src = stealAnimal;
			h = '2.6rem';
			w = '2.6rem';
			break;
		case 'switch-decks':
			src = switchDecks;
			h = '2.6rem';
			w = '2.6rem';
			break;
		case 'sacrif-anim-3hp':
			src = sacrificeAnimal;
			break;
		case '2hp':
			src = hpGain;
			break;
		case 'draw-2':
			src = drawTwo;
			break;
		case '2-anim-gy':
			src = twoAnimals;
			break;
		case 'block-pow':
			src = blockPowers;
			break;
		case 'reset-board':
			src = resetBoard;
			break;
	}
	return <img src={src} style={{ width: w, height: h }} />;
};
