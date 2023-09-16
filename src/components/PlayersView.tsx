import { useState } from 'react';
import { buttonStyle, deckSlotStyle, flexColumnStyle, flexRowStyle, violet } from '../styles/Style';
import { INITIAL_HP } from '../utils/data';
import { isAnimalCard, isPowerCard } from '../utils/helpers';
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
	playCard: (cardId?: string) => void;
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
	const isMyRound = round?.player === playerType;
	const disableEnv = !isMyRound || player.envLoadNb !== 3;
	const isPlayCardEnabled =
		!!nbCardsToPlay &&
		!!selectedId &&
		isMyRound &&
		(isAnimalCard(selectedId) || (canPlayPowers && isPowerCard(selectedId)));

	return (
		<div
			style={{
				...flexRowStyle,
				alignItems: 'center',
				width: '100%',
				justifyContent: 'space-around',
			}}>
			{!spectator && (
				<>
					<div
						style={{
							...flexColumnStyle,
							justifyContent: 'center',
							position: 'absolute',
							right: '29vw',
							bottom: '31vh',
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
							right: '18vw',
							bottom: '5vh',
							width: '10vw',
							gap: 6,
							fontSize: '0.6em',
						}}>
						{!!nbCardsToPlay && isMyRound && (
							<h5 style={{ color: violet, width: '6vw', fontSize: '1.3em' }}>Play {nbCardsToPlay} cards</h5>
						)}
						<button
							style={{
								...buttonStyle,
								backgroundColor: !isPlayCardEnabled ? 'grey' : violet,
							}}
							disabled={!isPlayCardEnabled}
							onClick={() => playCard(selectedId)}>
							PLAY CARD
						</button>

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
				justifyContent: 'space-around',
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
				{envLoadNb !== 3 ? <h5>Element loading</h5> : <h5>Element ready</h5>}
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

			{isDoubleAP && <h5>King AP X 2 in its element</h5>}
		</div>
	);
};
