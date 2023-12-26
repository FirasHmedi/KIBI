import { CSSProperties, useEffect, useRef, useState } from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { FaHeart } from 'react-icons/fa';
import { GiHeartMinus } from 'react-icons/gi';
import 'react-toastify/dist/ReactToastify.css';
import { Tooltip } from 'react-tooltip';
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
import { ROUND_DURATION } from '../utils/data';
import { showToast } from '../utils/helpers';
import { Player, Round } from '../utils/interface';
import { CurrentPDeck, OpponentPDeck } from './Decks';
import { Seperator } from './Elements';
import './styles.css';
import BlockAttacksIcon from '/src/assets/icons/block-attacks-violet.svg';
import BlockPowersIcon from '/src/assets/icons/block-pow-violet.svg';

export const BlockElement = ({ type }: any) => {
	if (type === 'pow')
		return <img src={BlockPowersIcon} style={{ height: '3.5rem', width: '3.5rem' }} />;
	else return <img src={BlockAttacksIcon} style={{ height: '3.5rem', width: '3.5rem' }} />;
};

export const CountDown = ({ finishRound }: any) => (
	<CountdownCircleTimer
		isPlaying
		duration={ROUND_DURATION}
		colors={`#681b89`}
		onComplete={() => {
			if (!!finishRound) finishRound();
		}}
		size={40}
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
	updateCardsOrder,
	hasAttacked,
	isConfirmActive,
	setIsConfirmActive,
	isAttackDisabled,
}: {
	player: Player;
	round: Round;
	playCard: (cardId?: string) => Promise<void>;
	finishRound: () => void;
	nbCardsToPlay: number;
	setElement: () => void;
	spectator?: boolean;
	updateCardsOrder: any;
	hasAttacked: any;
	isConfirmActive: boolean;
	setIsConfirmActive: any;
	isAttackDisabled: boolean;
}) => {
	const { playerType, hp } = player;
	const cardsIds = player.cardsIds ?? [];
	const isMyRound = round?.player === playerType;

	const Buttons = ({ setElement }: any) => {
		if (spectator) {
			return null;
		}

		const handleFinishClick = () => {
			if (hasAttacked.current || isAttackDisabled) {
				finishRound();
			} else {
				setIsConfirmActive(true);
				showToast("Don't forget to attack");
			}
		};

		const handleConfirmClick = () => {
			finishRound();
			setIsConfirmActive(false);
		};

		const cardsToPlay =
			nbCardsToPlay > 1 ? `${nbCardsToPlay} cards` : nbCardsToPlay === 1 ? '1 card' : 'No cards';

		const buttonsStyle: CSSProperties = {
			fontWeight: 'bold',
			minWidth: '4vw',
			fontSize: '0.8em',
			width: '4.5vw',
			padding: 2,
			color: 'white',
			backgroundColor: isMyRound ? violet : 'grey',
			borderRadius: 5,
		};

		return (
			<div
				style={{
					position: 'absolute',
					right: '18vw',
					bottom: '14vh',
					...flexRowStyle,
					justifyContent: 'flex-end',
					alignItems: 'flex-end',
				}}>
				<Seperator w='1vw' />
				<div
					style={{
						...flexColumnStyle,
						width: '8vw',
					}}>
					{!!nbCardsToPlay && isMyRound && <h5 style={{ color: violet }}>{cardsToPlay} left</h5>}
					<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
						{!isConfirmActive ? (
							<button style={buttonsStyle} disabled={!isMyRound} onClick={handleFinishClick}>
								FINISH
							</button>
						) : (
							<>
								<button
									style={buttonsStyle}
									disabled={!isMyRound}
									onClick={handleConfirmClick}
									data-tooltip-id='confirm-tooltip'
									data-tooltip-content="Don't forget to attack">
									CONFIRM
								</button>
								<Tooltip id='confirm-tooltip' />
							</>
						)}
					</div>
				</div>
			</div>
		);
	};

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
				...flexRowStyle,
				alignItems: 'center',
				justifyContent: 'center',
				gap: 8,
			}}>
			<Buttons setElement={setElement} />

			<CurrPlayerDataView player={player} isMyRound={isMyRound} isMe={true} />

			<div
				style={{
					...flexColumnStyle,
					color: violet,
					justifyContent: 'center',
					alignItems: 'center',
					gap: 16,
				}}>
				<CurrentPDeck cardsIds={cardsIds} updateCardsOrder={updateCardsOrder} />
				<div
					style={{
						...flexRowStyle,
						alignItems: 'center',
					}}>
					<div style={{ width: '3rem' }}>
						{hpChange ? <h4 style={{ fontSize: '1.7rem' }}>{hpChange}</h4> : <div />}
					</div>
					<div style={{ ...flexRowStyle, alignItems: 'center', justifyContent: 'center' }}>
						<h4 style={{ fontSize: '1.7rem' }}> {hpRef.current}</h4>
						<FaHeart style={{ color: violet, fontSize: '1.3rem' }} />
					</div>
				</div>
			</div>
			<EmptyElement width='5vw' />
		</div>
	);
};

export const OpponentPView = ({ player, spectator }: { player: Player; spectator?: boolean }) => {
	return (
		<div
			style={{
				...flexColumnStyle,
				width: '20vw',
				alignItems: 'center',
				justifyContent: 'safe center',
				gap: 10,
			}}>
			<OpponentDataView player={player} />
			<OpponentPDeck cardsIds={player?.cardsIds} spectator={spectator} />
			{spectator && <EmptyElement />}
		</div>
	);
};

export const EmptyElement = ({ width = '11vw' }: any) => {
	return <div style={{ width }}></div>;
};

export const ElementButton = ({ setElement }: any) => (
	<button
		style={{
			borderRadius: 5,
			backgroundColor: violet,
			color: 'white',
			height: '3.6vw',
			width: '3.6vw',
			fontSize: '1em',
			...flexColumnStyle,
			alignItems: 'center',
			justifyContent: 'flex-end',
		}}
		onClick={() => setElement()}>
		<div style={{ zIndex: 1, position: 'relative', top: '3vw' }}>
			<GiHeartMinus style={{ color: 'white', width: '1.3rem', height: '1.3rem' }} />
		</div>
		<div style={{}}>
			<div style={{ display: 'flex', flexDirection: 'row' }}>
				<div
					style={{
						width: '1.8vw',
						height: '1.8vw',
						backgroundColor: fireColor,
						borderTopLeftRadius: 5,
					}}></div>
				<div
					style={{
						width: '1.8vw',
						height: '1.8vw',
						backgroundColor: airColor,
						borderTopRightRadius: 5,
					}}></div>
			</div>
			<div style={{ display: 'flex', flexDirection: 'row' }}>
				<div
					style={{
						width: '1.8vw',
						height: '1.8vw',
						backgroundColor: waterColor,
						borderBottomLeftRadius: 5,
					}}></div>
				<div
					style={{
						width: '1.8vw',
						height: '1.8vw',
						backgroundColor: earthColor,
						borderBottomRightRadius: 5,
					}}></div>
			</div>
		</div>
	</button>
);

const CurrPlayerDataView = ({
	player,
	isMe,
}: {
	player: Player;
	setElement?: any;
	isMyRound?: boolean;
	isMe?: boolean;
}) => {
	const { playerType, canPlayPowers, isDoubleAP, canAttack } = player;

	return (
		<>
			{isMe && (
				<div
					style={{
						position: 'absolute',
						left: '2vh',
						bottom: '2vh',
						height: '4vh',
						...centerStyle,
						color: violet,
					}}>
					<h4>{playerType?.toUpperCase()}</h4>
				</div>
			)}

			<div
				style={{
					...flexColumnStyle,
					position: 'absolute',
					left: '8vw',
					bottom: isMe ? '10vh' : undefined,
					top: isMe ? undefined : '6vh',
					width: '12vw',
					gap: 12,
					fontSize: '1.1em',
					color: violet,
				}}>
				{canAttack === false && canPlayPowers === false ? (
					<div style={{ ...flexColumnStyle, gap: 8 }}>
						<BlockElement type='att' />
						<BlockElement type='pow' />
					</div>
				) : canAttack === false ? (
					<BlockElement type='att' />
				) : canPlayPowers === false ? (
					<BlockElement type='pow' />
				) : null}
				{isDoubleAP && <h4>Animals AP X 2</h4>}
			</div>
		</>
	);
};

const OpponentDataView = ({
	player,
	isMe,
}: {
	player: Player;
	setElement?: any;
	isMyRound?: boolean;
	isMe?: boolean;
	finishRound?: any;
	chargeElement?: any;
}) => {
	const { hp, canPlayPowers, isDoubleAP, canAttack } = player;
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
			<div
				style={{
					...flexRowStyle,
					alignItems: 'center',
					gap: 1,
				}}>
				<div
					style={{
						...flexRowStyle,
						alignItems: 'center',
						gap: 8,
					}}>
					<div style={{ width: '3rem' }}>
						{hpChange ? <h4 style={{ fontSize: '1.7rem' }}>{hpChange}</h4> : <div />}
					</div>
					<div style={{ ...flexRowStyle, alignItems: 'center', justifyContent: 'center' }}>
						<h4 style={{ fontSize: '1.7rem' }}> {hpRef.current}</h4>
						<FaHeart style={{ color: violet, fontSize: '1.3rem' }} />
					</div>
				</div>

				<div style={{ width: '3rem' }}></div>
			</div>

			<div
				style={{
					...flexColumnStyle,
					position: 'absolute',
					left: '18vw',
					top: '10vh',
					width: '12vw',
					gap: 12,
					fontSize: '1.1em',
				}}>
				{canAttack === false && canPlayPowers === false ? (
					<div style={{ ...flexRowStyle, gap: 8 }}>
						<BlockElement type='att' />
						<BlockElement type='pow' />
					</div>
				) : canAttack === false ? (
					<BlockElement type='att' />
				) : canPlayPowers === false ? (
					<BlockElement type='pow' />
				) : null}
				{isDoubleAP && <h4>Animals AP X 2</h4>}
			</div>
		</div>
	);
};
