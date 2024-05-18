import { isNil } from 'lodash';
import { CSSProperties, useEffect, useRef, useState } from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { FaHeart } from 'react-icons/fa';
import { GiHeartMinus } from 'react-icons/gi';
import 'react-toastify/dist/ReactToastify.css';
import { Tooltip } from 'react-tooltip';
import {
	CurrPlayerViewButtonsStyle,
	airColor,
	darkViolet,
	earthColor,
	fireColor,
	flexColumnStyle,
	flexRowStyle,
	violet,
	waterColor,
} from '../styles/Style';
import { isGameFinished } from '../utils/helpers';
import { Player, Round } from '../utils/interface';
import { CurrentPDeck, OpponentPDeck } from './Decks';
import './styles.css';
import BlockAttacksIcon from '/src/assets/icons/block-attacks-violet.svg';
import BlockPowersIcon from '/src/assets/icons/block-pow-violet.svg';

export const BlockElement = ({ type }: any) => {
	if (type === 'pow')
		return <img src={BlockPowersIcon} style={{ height: '3.5rem', width: '3.5rem' }} />;
	else return <img src={BlockAttacksIcon} style={{ height: '3.5rem', width: '3.5rem' }} />;
};

export const CountDown = ({
	finishRound,
	ROUND_DURATION,
}: {
	finishRound: () => void;
	ROUND_DURATION: number;
}) => {
	if (!ROUND_DURATION) return <></>;
	return (
		<CountdownCircleTimer
			isPlaying
			duration={ROUND_DURATION}
			colors={`#EA7FFB`}
			onComplete={() => {
				if (!!finishRound) finishRound();
			}}
			size={40}
			strokeLinecap='butt'
			strokeWidth={0.5}>
			{({ remainingTime }) => <h5 style={{ color: violet }}>{remainingTime}</h5>}
		</CountdownCircleTimer>
	);
};

export const CurrentPView = ({
	player,
	round,
	finishRound,
	nbCardsToPlay,
	spectator,
	updateCardsOrder,
	hasAttacked,
	isConfirmActive,
	setIsConfirmActive,
	isAttackDisabled,
	status,
}: {
	player: Player;
	round: Round;
	finishRound: () => void;
	nbCardsToPlay: number;
	spectator?: boolean;
	updateCardsOrder: any;
	hasAttacked: any;
	isConfirmActive: boolean;
	setIsConfirmActive: any;
	isAttackDisabled: boolean;
	status: string;
}) => {
	const { playerType, hp } = player;
	const cardsIds = player.cardsIds ?? [];
	const isMyRound = round?.player === playerType;

	const Buttons = () => {
		if (spectator) {
			return null;
		}

		const handleFinishClick = () => {
			finishRound();
			/*if (hasAttacked.current || isAttackDisabled) {
				finishRound();
			} else {
				setIsConfirmActive(true);
				showToast("Don't forget to attack");
			}*/
		};

		const handleConfirmClick = () => {
			finishRound();
			setIsConfirmActive(false);
		};

		const cardsToPlay =
			nbCardsToPlay > 1 ? `${nbCardsToPlay} 🃁` : nbCardsToPlay === 1 ? '1 🃁' : 'No 🃁';

		const buttonsStyle: CSSProperties = {
			...CurrPlayerViewButtonsStyle,
			backgroundColor: isMyRound ? darkViolet : 'grey',
		};

		if (isGameFinished(status)) {
			return <></>;
		}

		return (
			<div
				style={{
					position: 'absolute',
					right: '18vw',
					bottom: '10vh',
					...flexColumnStyle,
					justifyContent: 'flex-end',
					alignItems: 'flex-end',
					width: '8vw',
				}}>
				{!!nbCardsToPlay && isMyRound && <h5 style={{ color: violet }}>{cardsToPlay} left</h5>}
				<div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
					{!isConfirmActive ? (
						<button
							style={{
								...buttonsStyle,
								minWidth: undefined,
								width: undefined,
								padding: 2,
								paddingLeft: 6,
								paddingRight: 6,
							}}
							disabled={!isMyRound}
							onClick={handleFinishClick}>
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

	const hearts = hpRef.current > 0 ? [...Array(hpRef.current).keys()] : [];

	return (
		<div
			style={{
				...flexRowStyle,
				alignItems: 'center',
				justifyContent: 'center',
				gap: 8,
			}}>
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
				{!isNil(hp) && (
					<div
						style={{
							...flexRowStyle,
							alignItems: 'center',
						}}>
						<div style={{ ...flexRowStyle, alignItems: 'center', justifyContent: 'center' }}>
							{hearts.map(h => (
								<FaHeart key={h} style={{ color: violet, fontSize: '1.3rem', margin: 1 }} />
							))}
						</div>
					</div>
				)}
			</div>

			<Buttons />
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
			<GiHeartMinus style={{ color: 'white', width: '0.8rem', height: '0.8rem' }} />
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
	return <PlayerCanDoView player={player} isMe={isMe} />;
};

const OpponentDataView = ({ player }: { player: Player }) => {
	const { hp } = player;
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

	const hearts = hpRef.current > 0 ? [...Array(hpRef.current).keys()] : [];

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
				{!isNil(hp) && (
					<div style={{ ...flexRowStyle, alignItems: 'center', justifyContent: 'center' }}>
						{hearts.map(h => (
							<FaHeart key={h} style={{ color: violet, fontSize: '1.3rem', margin: 1 }} />
						))}
					</div>
				)}
			</div>
			<PlayerCanDoView player={player} />
		</div>
	);
};

const PlayerCanDoView = ({ player, isMe }: { player: Player; isMe?: boolean }) => {
	const { canPlayPowers, isDoubleAP, canAttack } = player;
	return (
		<div
			style={{
				...flexColumnStyle,
				position: 'absolute',
				left: '14vw',
				bottom: isMe ? '4vh' : undefined,
				top: isMe ? undefined : '4vh',
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
			{isDoubleAP && <h4>Animals AP*2</h4>}
		</div>
	);
};
