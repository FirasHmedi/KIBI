import Battery0BarIcon from '@mui/icons-material/Battery0Bar';
import BatteryCharging20Icon from '@mui/icons-material/BatteryCharging20';
import BatteryCharging80Icon from '@mui/icons-material/BatteryCharging80';
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ClawIcon from '@mui/icons-material/Pets';
import ProgressBar from '@ramonak/react-progress-bar';
import isEmpty from 'lodash/isEmpty';
import { useEffect, useRef, useState } from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { Tooltip } from 'react-tooltip';
import { centerStyle, flexColumnStyle, flexRowStyle, violet } from '../styles/Style';
import { INITIAL_HP, ROUND_DURATION } from '../utils/data';
import { isAnimalCard, isPowerCard, waitFor } from '../utils/helpers';
import { Player, Round } from '../utils/interface';
import { CurrentPDeck, OpponentPDeck } from './Decks';
import './styles.css';

export const CurrentPView = ({
	player,
	round,
	playCard,
	finishRound,
	attack,
	isAttackAnimalEnabled,
	isAttackOwnerEnabled,
	nbCardsToPlay,
	setElement,
	spectator,
	showCountDown,
}: {
	player: Player;
	round: Round;
	playCard: (cardId?: string) => Promise<void>;
	finishRound: () => void;
	attackOpponentAnimal: () => void;
	attack: () => void;
	attackOppHp: () => void;
	isAttackAnimalEnabled: boolean;
	isAttackOwnerEnabled: boolean;
	nbCardsToPlay: number;
	setElement: () => void;
	spectator?: boolean;
	showCountDown?: boolean;
}) => {
	const { playerType, canPlayPowers, canAttack } = player;
	const cardsIds = player.cardsIds ?? [];
	const [selectedId, setSelectedId] = useState<string>();
	const playCardRef = useRef<any>();

	const isMyRound = round?.player === playerType;
	const [disablePlayButton, setDisablePlayButton] = useState(false);

	const isPlayCardEnabled =
		nbCardsToPlay >= 1 &&
		!!selectedId &&
		isMyRound &&
		!disablePlayButton &&
		(isAnimalCard(selectedId) || (canPlayPowers && isPowerCard(selectedId)));

	const playCardWithButtonControl = async () => {
		setDisablePlayButton(true);
		await playCard(selectedId);
		setSelectedId(undefined);
		await waitFor(800);
		setDisablePlayButton(false);
	};

	const isAttackEnabled = isAttackAnimalEnabled || isAttackOwnerEnabled;
	const tooltipId = `can-attack-anchor`;
	const description =
		round.nb <= 2
			? 'Attacking is disabled in first turn'
			: !isMyRound
			? 'Not my round to attack'
			: !canAttack
			? 'Blocked from attacking'
			: "Animal is not selected or can't attack";

	const Buttons = () => {
		if (spectator) {
			return <></>;
		}
		return (
			<>
				<div
					style={{
						...flexColumnStyle,
						justifyContent: 'center',
						position: 'absolute',
						right: '29vw',
						bottom: '34vh',
						gap: 40,
						width: '10vw',
					}}>
					{!isAttackEnabled && <Tooltip anchorSelect={`#${tooltipId}`} content={description} />}

					<button
						style={{
							fontWeight: 'bold',
							color: !isAttackEnabled ? 'grey' : violet,
							...centerStyle,
						}}
						id={tooltipId}
						disabled={!isAttackEnabled}
						onClick={() => attack()}>
						<ClawIcon
							style={{ width: '2vw', height: 'auto', color: !isAttackEnabled ? 'grey' : violet }}
						/>
					</button>
				</div>

				<div
					style={{
						position: 'absolute',
						right: '15vw',
						bottom: '13vh',
						...flexRowStyle,
						alignItems: 'flex-end',
						justifyContent: 'center',
					}}>
					<button
						ref={playCardRef}
						style={{
							fontWeight: 'bold',
							minWidth: '8vw',
							fontSize: '0.8em',
							color: !isPlayCardEnabled ? 'grey' : violet,
						}}
						disabled={!isPlayCardEnabled}
						onClick={() => playCardWithButtonControl()}>
						PLAY CARD {!!nbCardsToPlay && isMyRound && <span>({nbCardsToPlay})</span>}
					</button>
					<div
						style={{
							...flexRowStyle,
							alignItems: 'flex-end',
							justifyContent: 'flex-start',
							width: '6vw',
						}}>
						<button
							style={{
								fontWeight: 'bold',
								minWidth: '4vw',
								fontSize: '0.8em',
								color: !isMyRound ? 'grey' : violet,
							}}
							disabled={!isMyRound}
							onClick={() => finishRound()}>
							FINISH
						</button>
						{showCountDown && (
							<CountdownCircleTimer
								isPlaying
								duration={ROUND_DURATION}
								colors={`#8e44ad`}
								onComplete={() => {
									finishRound();
								}}
								size={24}
								strokeLinecap='butt'
								strokeWidth={0.5}>
								{({ remainingTime }) => <h5 style={{ color: violet }}>{remainingTime}</h5>}
							</CountdownCircleTimer>
						)}
					</div>
				</div>
			</>
		);
	};

	return (
		<div
			style={{
				...flexRowStyle,
				alignItems: 'center',
				width: '100%',
				justifyContent: 'center',
			}}>
			<Buttons />
			<PlayerDataView player={player} setElement={setElement} isMyRound={isMyRound} isMe={true} />
			<CurrentPDeck
				round={round}
				cardsIds={cardsIds}
				selectedId={selectedId}
				setSelectedId={setSelectedId}
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
}: {
	player: Player;
	setElement?: any;
	isMyRound?: boolean;
	isMe?: boolean;
}) => {
	const { hp, playerType, canPlayPowers, tankIdWithDoubleAP, canAttack, envLoadNb } = player;
	const batteryStyle = { color: violet, width: '2.8vw', height: 'auto' };
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
				<div style={{ position: 'absolute', bottom: '4vh', right: '3vw' }}>
					<h4>{playerType?.toUpperCase()}</h4>
				</div>
			)}

			<div style={{ ...flexRowStyle, alignItems: 'center', gap: 2 }}>
				<div style={{ ...flexRowStyle, justifyContent: 'center', alignItems: 'center' }}>
					{!!hpChange && (
						<div style={{ position: 'absolute', left: '17.6vw' }}>
							<h4 style={{ fontSize: '1.7rem' }}>{hpChange}</h4>
						</div>
					)}
					<h4 style={{ fontSize: '1.3rem' }}>{hpRef.current}</h4>
					<FavoriteIcon style={{ color: violet, width: '1.2vw' }} />
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
					<BatteryChargingFullIcon style={batteryStyle} />
				) : envLoadNb === 2 ? (
					<BatteryCharging80Icon style={batteryStyle} />
				) : envLoadNb === 1 ? (
					<BatteryCharging20Icon style={batteryStyle} />
				) : envLoadNb === 0 ? (
					<Battery0BarIcon style={batteryStyle} />
				) : null}
			</button>

			<div
				style={{
					...flexColumnStyle,
					position: 'absolute',
					left: '6vw',
					bottom: isMe ? '6.5vh' : undefined,
					top: isMe ? undefined : '6.5vh',
					width: '10vw',
					gap: 12,
				}}>
				{canAttack === false && canPlayPowers === false ? (
					<h4>Blocked from attacking and playing power cards</h4>
				) : canAttack === false ? (
					<h4>Blocked from attacking</h4>
				) : canPlayPowers === false ? (
					<h4>Blocked from playing power cards</h4>
				) : null}
			</div>

			{!isEmpty(tankIdWithDoubleAP) && <h5>TANK AP is doubled </h5>}
		</div>
	);
};
