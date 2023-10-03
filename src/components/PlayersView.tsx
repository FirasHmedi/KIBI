import { useRef, useState } from 'react';
import { centerStyle, flexColumnStyle, flexRowStyle, violet } from '../styles/Style';
import { INITIAL_HP } from '../utils/data';
import { isAnimalCard, isPowerCard, waitFor } from '../utils/helpers';
import { Player, Round } from '../utils/interface';
import { CurrentPDeck, OpponentPDeck } from './Decks';
import './styles.css';
import ProgressBar from '@ramonak/react-progress-bar';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Battery0BarIcon from '@mui/icons-material/Battery0Bar';
import BatteryCharging20Icon from '@mui/icons-material/BatteryCharging20';
import BatteryCharging80Icon from '@mui/icons-material/BatteryCharging80';
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';
import SwordIcon from '../assets/icons/sword-small-violet.png';
import ClawIcon from '@mui/icons-material/Pets';
import PersonIcon from '@mui/icons-material/Person';

export const CurrentPView = ({
	player,
	round,
	playCard,
	finishRound,
	attackOpponentAnimal,
	attackOppHp,
	isAttackAnimalEnabled,
	isAttackOwnerEnabled,
	nbCardsToPlay,
	setElement,
	spectator,
}: {
	player: Player;
	round: Round;
	playCard: (cardId?: string) => Promise<void>;
	finishRound: () => void;
	attackOpponentAnimal: () => void;
	attackOppHp: () => void;
	isAttackAnimalEnabled: boolean;
	isAttackOwnerEnabled: boolean;
	nbCardsToPlay: number;
	setElement: () => void;
	spectator?: boolean;
}) => {
	const { playerType, canPlayPowers } = player;
	const cardsIds = player.cardsIds ?? [];
	const [selectedId, setSelectedId] = useState<string>();
	const playCardRef = useRef<any>();

	const isMyRound = round?.player === playerType;
	const disableEnv = !isMyRound || player.envLoadNb !== 3;
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

	return (
		<div
			style={{
				...flexRowStyle,
				alignItems: 'center',
				width: '100%',
				justifyContent: 'center',
			}}>
			{!spectator && (
				<>
					<div
						style={{
							...flexColumnStyle,
							justifyContent: 'center',
							position: 'absolute',
							right: '29vw',
							bottom: '30vh',
							gap: 40,
							width: '10vw',
						}}>
						<button
							style={{
								fontWeight: 'bold',
								color: !isAttackOwnerEnabled ? 'grey' : violet,
								...centerStyle,
							}}
							disabled={!isAttackOwnerEnabled}
							onClick={() => attackOppHp()}>
							<img src={SwordIcon} style={{ width: 28 }}></img>
							<PersonIcon style={{ width: '2vw', height: 'auto', color: !isAttackOwnerEnabled ? 'grey' : violet }} />
						</button>
						<button
							style={{
								fontWeight: 'bold',
								color: !isAttackAnimalEnabled ? 'grey' : violet,
								...centerStyle,
							}}
							disabled={!isAttackAnimalEnabled}
							onClick={() => attackOpponentAnimal()}>
							<img src={SwordIcon} style={{ width: 28 }}></img>
							<ClawIcon style={{ width: '2vw', height: 'auto', color: !isAttackAnimalEnabled ? 'grey' : violet }} />
						</button>
					</div>

					<div
						style={{
							...flexColumnStyle,
							position: 'absolute',
							right: '20vw',
							bottom: '10vh',
							width: '10vw',
							gap: 12,
						}}>
						{!!nbCardsToPlay && isMyRound && (
							<h6 style={{ color: violet, width: '6vw', fontSize: '0.7em' }}>{nbCardsToPlay} cards to play</h6>
						)}
						<button
							ref={playCardRef}
							style={{
								fontWeight: 'bold',
								minWidth: '4vw',
								fontSize: '0.8em',
								color: !isPlayCardEnabled ? 'grey' : violet,
							}}
							disabled={!isPlayCardEnabled}
							onClick={() => playCardWithButtonControl()}>
							PLAY CARD
						</button>
					</div>
					<div style={{ position: 'absolute', right: '14vw', bottom: '10vh', width: '10vw' }}>
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
					</div>
				</>
			)}

			<PlayerDataView player={player} setElement={setElement} isMyRound={isMyRound} />
			<CurrentPDeck cardsIds={cardsIds} selectedId={selectedId} setSelectedId={setSelectedId} />
			<EmptyElement />
		</div>
	);
};

export const OpponentPView = ({ player }: { player: Player }) => {
	return (
		<div
			style={{
				...flexRowStyle,
				alignItems: 'center',
				width: '100%',
				justifyContent: 'center',
			}}>
			<PlayerDataView player={player} />
			<OpponentPDeck cardsNb={player?.cardsIds?.length} />
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
}: {
	player: Player;
	setElement?: any;
	isMyRound?: boolean;
}) => {
	const { hp, playerType, canPlayPowers, isDoubleAP, canAttack, envLoadNb } = player;
	const batteryStyle = { color: violet, width: '2.8vw', height: 'auto' };

	return (
		<div
			style={{
				color: violet,
				fontSize: '0.9em',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'flex-start',
				justifyContent: 'center',
				gap: 12,
				width: '11vw',
			}}>
			<h5>{playerType?.toUpperCase()}</h5>

			<div style={{ ...flexRowStyle, alignItems: 'center', gap: 2 }}>
				<div style={{ ...flexRowStyle, justifyContent: 'center', alignItems: 'center' }}>
					<h4 style={{ fontSize: '1.1em' }}>{hp}</h4>
					<FavoriteIcon style={{ color: violet, width: '1.1vw' }} />
				</div>

				<ProgressBar
					bgColor={violet}
					maxCompleted={hp > INITIAL_HP ? hp : INITIAL_HP}
					width='5vw'
					height='1vh'
					baseBgColor={'grey'}
					isLabelVisible={false}
					completed={hp}></ProgressBar>
			</div>

			<button
				style={{ ...flexRowStyle, alignItems: 'center', justifyContent: 'center' }}
				disabled={!(!!setElement && envLoadNb === 3 && isMyRound)}
				onClick={() => setElement()}>
				<h5>Element</h5>
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

			{canAttack === false && canPlayPowers === false ? (
				<h5>Blocked from attacking and playing power cards</h5>
			) : canAttack === false ? (
				<h5>Blocked from attacking</h5>
			) : canPlayPowers === false ? (
				<h5>Blocked from playing power cards</h5>
			) : null}

			{isDoubleAP && <h5>Animals AP is doubled </h5>}
		</div>
	);
};
