import ProgressBar from '@ramonak/react-progress-bar';
import { useCallback, useEffect, useRef, useState } from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { FaHeart } from 'react-icons/fa';
import {
	MdBattery0Bar,
	MdBatteryCharging20,
	MdBatteryCharging80,
	MdBatteryChargingFull,
} from 'react-icons/md';
import { flexColumnStyle, flexRowStyle, violet } from '../styles/Style';
import { GAMES_PATH, INITIAL_HP, ROUND_DURATION } from '../utils/data';
import { Player, Round } from '../utils/interface';
import { CurrentPDeck, OpponentPDeck } from './Decks';
import './styles.css';
import { setItem } from '../backend/db';

const CountDown = ({ finishRound }: any) => (
	<CountdownCircleTimer
		isPlaying
		duration={ROUND_DURATION}
		colors={`#8e44ad`}
		onComplete={() => {
			if (!!finishRound) finishRound();
		}}
		size={24}
		strokeLinecap='butt'
		strokeWidth={0.5}>
		{({ remainingTime }) => <h5 style={{ color: violet }}>{remainingTime}</h5>}
	</CountdownCircleTimer>
);

export const CurrentPView = ({
	player,
	round,
	playCard,
	finishRound,
	nbCardsToPlay,
	setElement,
	spectator,
	showCountDown,
	gameId,
}: {
	player: Player;
	round: Round;
	playCard: (cardId?: string) => Promise<void>;
	finishRound: () => void;
	nbCardsToPlay: number;
	setElement: () => void;
	spectator?: boolean;
	showCountDown?: any;
	gameId ? : string;
}) => {

	const { playerType } = player;
	//const cardsIds = player.cardsIds ?? [];
	const [cardsIds, setCardsIds] = useState(player.cardsIds ?? []);
	const updateCardsOrder = useCallback((newOrder:string[]) => {
        setCardsIds(newOrder);
		setItem(GAMES_PATH + gameId + player.playerType , {cardsIds : newOrder})
        
    }, [setCardsIds]);
	const [selectedId, setSelectedId] = useState<string>();
	
	const isMyRound = round?.player === playerType;

	const Buttons = () => {
		if (spectator) {
			return <></>;
		}
		return (
			<div
				style={{
					position: 'absolute',
					right: '12vw',
					bottom: '8vh',
				}}>
				<div
					style={{
						...flexColumnStyle,
						alignItems: 'center',
						justifyContent: 'center',
						width: '14vw',
					}}>
					{!!nbCardsToPlay && isMyRound && (
						<h5 style={{ color: violet, padding: 10 }}>{nbCardsToPlay} card(s) to play</h5>
					)}
					<button
						style={{
							fontWeight: 'bold',
							minWidth: '4vw',
							fontSize: '0.8em',
							width: '4.5vw',
							padding: 2,
							color: 'white',
							backgroundColor: isMyRound ? violet : 'grey',
							borderRadius: 5,
						}}
						disabled={!isMyRound}
						onClick={() => finishRound()}>
						FINISH
					</button>
				</div>
			</div>
		);
	};

	return (
		<div
			style={{
				...flexRowStyle,
				alignItems: 'center',
				width: '100%',
				justifyContent: 'center',
				gap: 8,
			}}>
			<Buttons />
			<PlayerDataView
				showCountDown={showCountDown}
				player={player}
				setElement={setElement}
				isMyRound={isMyRound}
				isMe={true}
				finishRound={finishRound}
			/>
			<CurrentPDeck 
			cardsIds={cardsIds} 
			selectedId={selectedId} 
			setSelectedId={setSelectedId}
			updateCardsOrder={updateCardsOrder}
			/>
			<EmptyElement />
		</div>
	);
};

export const OpponentPView = ({ player, spectator }: { player: Player; spectator?: boolean }) => {
	return (
		<div
			style={{
				...flexRowStyle,
				alignItems: 'center',
				width: '100%',
				justifyContent: 'center',
			}}>
			<PlayerDataView player={player} />
			<OpponentPDeck cardsIds={player?.cardsIds} spectator={spectator} />
			<EmptyElement />
		</div>
	);
};

export const EmptyElement = ({ width = '11vw' }: any) => {
	return <div style={{ width }}></div>;
};

const PlayerDataView = ({
	player,
	setElement,
	isMyRound,
	isMe,
	showCountDown,
	finishRound,
}: {
	player: Player;
	setElement?: any;
	isMyRound?: boolean;
	isMe?: boolean;
	showCountDown?: any;
	finishRound?: any;
}) => {
	const { hp, playerType, canPlayPowers, isDoubleAP, canAttack, envLoadNb } = player;
	const batteryStyle = { color: violet, width: '3vw', height: 'auto' };
	const hpRef = useRef<number>(0);
	const [hpChange, setHpChange] = useState<string>();

	useEffect(() => {
		if (hp > hpRef.current) {
			setHpChange('+' + (hp - hpRef.current));
			setTimeout(() => {
				setHpChange(undefined);
			}, 1000);
		} else if (hp < hpRef.current) {
			setHpChange('-' + (hpRef.current - hp));
			setTimeout(() => {
				setHpChange(undefined);
			}, 1000);
		}
		hpRef.current = hp;
	}, [hp]);

	return (
		<div
			style={{
				color: violet,
				fontSize: '0.9em',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				gap: 12,
				width: '10vw',
			}}>
			{isMe && (
				<div
					style={{
						position: 'absolute',
						bottom: '4vh',
						right: '3vw',
						...flexRowStyle,
						alignItems: 'center',
						height: '4vh',
						gap: 12,
					}}>
					{showCountDown?.current && !!finishRound && false && (
						<CountDown finishRound={finishRound} />
					)}
					<h4>{playerType?.toUpperCase()}</h4>
				</div>
			)}
			<div style={{ position: 'absolute', bottom: '4vh', right: '8vw' }}></div>

			<div style={{ ...flexRowStyle, alignItems: 'center', gap: 2 }}>
				<div style={{ ...flexRowStyle, justifyContent: 'center', alignItems: 'center' }}>
					{!!hpChange && (
						<div style={{ position: 'absolute', left: '12rem' }}>
							<h4 style={{ fontSize: '1.7rem' }}>{hpChange}</h4>
						</div>
					)}
					<h4 style={{ fontSize: '1.3rem' }}>{hpRef.current}</h4>
					<FaHeart style={{ color: violet, width: '1.2vw' }} />
				</div>

				<ProgressBar
					bgColor={violet}
					maxCompleted={hp > INITIAL_HP ? hp : INITIAL_HP}
					width='4vw'
					height='1.1vh'
					baseBgColor={'grey'}
					isLabelVisible={false}
					completed={hp ?? 0}></ProgressBar>
			</div>

			<button
				style={{ ...flexRowStyle, alignItems: 'center', justifyContent: 'center' }}
				disabled={!(!!setElement && envLoadNb === 3 && isMyRound)}
				onClick={() => setElement()}>
				{envLoadNb === 3 ? (
					<MdBatteryChargingFull style={batteryStyle} />
				) : envLoadNb === 2 ? (
					<MdBatteryCharging80 style={batteryStyle} />
				) : envLoadNb === 1 ? (
					<MdBatteryCharging20 style={batteryStyle} />
				) : envLoadNb === 0 ? (
					<MdBattery0Bar style={batteryStyle} />
				) : null}
			</button>

			<div
				style={{
					...flexColumnStyle,
					position: 'absolute',
					left: '3vw',
					bottom: isMe ? '8vh' : undefined,
					top: isMe ? undefined : '13vh',
					width: '12vw',
					gap: 12,
					fontSize: '0.9em',
				}}>
				{canAttack === false && canPlayPowers === false ? (
					<h4>Blocked from attacking and playing power cards</h4>
				) : canAttack === false ? (
					<h4>Blocked from attacking</h4>
				) : canPlayPowers === false ? (
					<h4>Blocked from playing power cards</h4>
				) : null}
				{isDoubleAP && <h4>Animals AP is doubled </h4>}
			</div>
		</div>
	);
};
