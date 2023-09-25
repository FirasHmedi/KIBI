import { useRef, useState } from 'react';
import { buttonStyle, flexColumnStyle, flexRowStyle, violet } from '../styles/Style';
import { INITIAL_HP } from '../utils/data';
import { isAnimalCard, isPowerCard, waitFor } from '../utils/helpers';
import { Player, Round } from '../utils/interface';
import { CurrentPDeck, OpponentPDeck } from './Decks';
import './styles.css';
import ProgressBar from '@ramonak/react-progress-bar';

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
		await waitFor(500);
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
							gap: 10,
							width: '10vw',
							fontSize: '0.6em',
						}}>
						<button
							style={{
								...buttonStyle,
								backgroundColor: disableEnv ? 'grey' : violet,
							}}
							disabled={disableEnv}
							onClick={() => setElement()}>
							SET ELEMENT
						</button>
						<button
							style={{
								...buttonStyle,
								backgroundColor: !isAttackAnimalEnabled ? 'grey' : violet,
							}}
							disabled={!isAttackAnimalEnabled}
							onClick={() => attackOpponentAnimal()}>
							STRIKE ANIMAL
						</button>
						<button
							style={{
								...buttonStyle,
								backgroundColor: !isAttackOwnerEnabled ? 'grey' : violet,
							}}
							disabled={!isAttackOwnerEnabled}
							onClick={() => attackOppHp()}>
							STRIKE PLAYER
						</button>
					</div>

					<div
						style={{
							...flexColumnStyle,
							position: 'absolute',
							right: '20vw',
							bottom: '12vh',
							width: '10vw',
							gap: 6,
							fontSize: '0.6em',
						}}>
						{!!nbCardsToPlay && isMyRound && (
							<h5 style={{ color: violet, width: '6vw', fontSize: '1.3em' }}>Play {nbCardsToPlay} cards</h5>
						)}
						<button
							ref={playCardRef}
							style={{
								...buttonStyle,
								backgroundColor: !isPlayCardEnabled ? 'grey' : violet,
							}}
							disabled={!isPlayCardEnabled}
							onClick={() => playCardWithButtonControl()}>
							PLAY CARD
						</button>
					</div>
					<div style={{ position: 'absolute', right: '14vw', bottom: '12vh', width: '10vw', fontSize: '0.6em' }}>
						<button
							style={{
								...buttonStyle,
								backgroundColor: !isMyRound ? 'grey' : violet,
							}}
							disabled={!isMyRound}
							onClick={() => finishRound()}>
							FINISH
						</button>
					</div>
				</>
			)}

			<PlayerDataView player={player} />
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

const PlayerDataView = ({ player }: { player: Player }) => {
	const { hp, playerType, canPlayPowers, isDoubleAP, canAttack, envLoadNb } = player;
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
			<h4>{playerType?.toUpperCase()}</h4>

			<div style={{ ...flexRowStyle, alignItems: 'center', gap: 2 }}>
				<h4 style={{ fontSize: '1.1em' }}>{hp}HP</h4>
				<ProgressBar
					bgColor={violet}
					maxCompleted={hp > INITIAL_HP ? hp : INITIAL_HP}
					width='7vw'
					height='1.4vh'
					baseBgColor={'grey'}
					isLabelVisible={false}
					completed={hp}></ProgressBar>
			</div>

			<div style={{ ...flexRowStyle, alignItems: 'center', gap: 2 }}>
				{envLoadNb !== 3 ? <h5>Element charging</h5> : <h5>Element charged</h5>}
				<ProgressBar
					bgColor={violet}
					maxCompleted={3}
					width='3vw'
					height='1.4vh'
					baseBgColor={'grey'}
					isLabelVisible={false}
					completed={envLoadNb}></ProgressBar>
			</div>

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
