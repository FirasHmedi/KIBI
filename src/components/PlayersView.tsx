import ProgressBar from '@ramonak/react-progress-bar';
import { useEffect, useRef, useState } from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { FaHeart } from 'react-icons/fa';
import { GiHeartMinus } from 'react-icons/gi';
import {
	airColor,
	centerStyle,
	earthColor,
	fireColor,
	flexColumnStyle,
	flexRowStyle,
	violet,
	waterColor,
} from '../styles/Style';
import { INITIAL_HP, ROUND_DURATION } from '../utils/data';
import { Player, Round } from '../utils/interface';
import { CurrentPDeck, OpponentPDeck } from './Decks';
import './styles.css';

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
	finishRound,
	nbCardsToPlay,
	setElement,
	spectator,
	showCountDown,
	chargeElement,
}: {
	player: Player;
	round: Round;
	playCard: (cardId?: string) => Promise<void>;
	finishRound: () => void;
	nbCardsToPlay: number;
	setElement: () => void;
	spectator?: boolean;
	showCountDown?: any;
	chargeElement?: any;
}) => {
	const { playerType } = player;
	const cardsIds = player.cardsIds ?? [];
	const [selectedId, setSelectedId] = useState<string>();

	const isMyRound = round?.player === playerType;

	const Buttons = () => {
		if (spectator) {
			return <></>;
		}
		const cardsToPlay =
			nbCardsToPlay > 1 ? `${nbCardsToPlay} cards` : nbCardsToPlay === 1 ? '1 card' : 'No cards';
		return (
			<div
				style={{
					position: 'absolute',
					right: '14vw',
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
						<h5 style={{ color: violet, padding: 10 }}>{cardsToPlay} to play</h5>
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
				chargeElement={chargeElement}
			/>
			<CurrentPDeck cardsIds={cardsIds} selectedId={selectedId} setSelectedId={setSelectedId} />
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
	chargeElement,
}: {
	player: Player;
	setElement?: any;
	isMyRound?: boolean;
	isMe?: boolean;
	showCountDown?: any;
	finishRound?: any;
	chargeElement?: any;
}) => {
	const { hp, playerType, canPlayPowers, isDoubleAP, canAttack, envLoadNb } = player;
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

	const chargeOrSetElement = () => {
		if (!isMe || !isMyRound) {
			return;
		}
		if (envLoadNb === 1) {
			setElement();
		}
		if (envLoadNb === 0) {
			chargeElement();
		}
	};

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
					<FaHeart style={{ color: violet, width: '1vw' }} />
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

			<div style={{ ...flexRowStyle, alignItems: 'center' }}>
				<button
					style={{
						...centerStyle,
						borderRadius: 5,
						backgroundColor: violet,
						color: 'white',
						height: '2.4vw',
						width: '2.4vw',
						justifyContent: 'center',
						fontSize: '1em',
					}}
					onClick={() => chargeOrSetElement()}>
					{envLoadNb === 1 ? (
						<div
							style={{
								margin: 'auto',
							}}>
							<div style={{ display: 'flex', flexDirection: 'row' }}>
								<div
									style={{
										width: '0.8vw',
										height: '0.8vw',
										backgroundColor: fireColor,
										borderTopLeftRadius: 5,
									}}></div>
								<div
									style={{
										width: '0.8vw',
										height: '0.8vw',
										backgroundColor: airColor,
										borderTopRightRadius: 5,
									}}></div>
							</div>
							<div style={{ display: 'flex', flexDirection: 'row' }}>
								<div
									style={{
										width: '0.8vw',
										height: '0.8vw',
										backgroundColor: waterColor,
										borderBottomLeftRadius: 5,
									}}></div>
								<div
									style={{
										width: '0.8vw',
										height: '0.8vw',
										backgroundColor: earthColor,
										borderBottomRightRadius: 5,
									}}></div>
							</div>
						</div>
					) : (
						<div style={centerStyle}>
							<GiHeartMinus style={{ color: 'white', width: '0.8vw', height: '1vw' }} />
							<GiHeartMinus style={{ color: 'white', width: '0.8vw', height: '1vw' }} />
						</div>
					)}
				</button>
			</div>

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
