import { useState } from 'react';
import { buttonStyle, deckSlotStyle, flexColumnStyle, flexRowStyle, violet } from '../styles/Style';
import { INITIAL_HP } from '../utils/data';
import { isAnimalCard, isPowerCard } from '../utils/helpers';
import { Player, PlayerType, Round } from '../utils/interface';
import { CurrentPDeck, OpponentPDeck } from './Decks';
import './styles.css';

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
			}}>
			<div
				style={{
					...flexColumnStyle,
					position: 'absolute',
					right: '10vw',
					bottom: '3vh',
					width: '10vw',
					gap: 6,
				}}>
				{!!nbCardsToPlay && isMyRound && <h5 style={{ color: violet }}>Play {nbCardsToPlay} cards</h5>}
				<button
					style={{
						...buttonStyle,
						fontSize: '0.7em',
						backgroundColor: !isMyRound ? 'grey' : violet,
					}}
					disabled={!isMyRound}
					onClick={() => finishRound()}>
					Finish
				</button>
				<button
					style={{
						...buttonStyle,
						fontSize: '0.7em',
						backgroundColor: !isPlayCardEnabled ? 'grey' : violet,
					}}
					disabled={!isPlayCardEnabled}
					onClick={() => playCard(selectedId)}>
					Play card
				</button>

				<div
					style={{
						...flexColumnStyle,
						justifyContent: 'space-evenly',
						position: 'absolute',
						right: '19vw',
						bottom: '30vh',
						gap: 8,
						width: '7vw',
					}}>
					<button
						style={{
							...buttonStyle,
							fontSize: '0.7em',
							backgroundColor: !isAttackAnimalEnabled ? 'grey' : violet,
						}}
						disabled={!isAttackAnimalEnabled}
						onClick={() => attackOpponentAnimal()}>
						Strike animal
					</button>
					<button
						style={{
							...buttonStyle,
							fontSize: '0.7em',
							backgroundColor: !isAttackOwnerEnabled ? 'grey' : violet,
						}}
						disabled={!isAttackOwnerEnabled}
						onClick={() => attackOppHp()}>
						Strike directly
					</button>
				</div>

				<button
					style={{
						...buttonStyle,
						fontSize: '0.7em',
						backgroundColor: disableEnv ? 'grey' : violet,
					}}
					disabled={disableEnv}
					onClick={() => setElement()}>
					Set element
				</button>
			</div>
			<PlayerDataView player={player} />
			<ElementCard loadNb={player.envLoadNb} setElement={setElement} />
			<CurrentPDeck cardsIds={cardsIds} selectedId={selectedId} setSelectedId={setSelectedId} />
		</div>
	);
};

export const OpponentPView = ({ player }: { player: Player }) => {
	return (
		<div
			style={{
				...flexRowStyle,
				alignItems: 'center',
			}}>
			<PlayerDataView player={player} />
			<OpponentPDeck cardsNb={player?.cardsIds?.length} />
		</div>
	);
};

const PlayerDataView = ({ player }: { player: Player }) => {
	const { hp, playerType, canPlayPowers, isDoubleAP, canAttack } = player;
	return (
		<div
			style={{
				color: violet,
				position: 'absolute',
				left: '1vw',
				fontSize: '0.9em',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'flex-start',
				justifyContent: 'center',
			}}>
			<h5>Player {playerType?.toUpperCase()}</h5>
			<progress style={{ width: '8vw' }} value={hp} max={hp > INITIAL_HP ? hp : INITIAL_HP} />
			<h4 style={{ fontSize: '1em' }}>{hp} HP</h4>
			{canAttack === false && <h5>Can't attack</h5>}
			{canPlayPowers === false && <h5>Can't play power cards</h5>}
			{isDoubleAP && <h5>King AP X 2</h5>}
		</div>
	);
};

const ElementCard = ({ loadNb = 0 }: any) => {
	const disableUsage = loadNb !== 3;
	return (
		<div
			style={{
				...deckSlotStyle,
				justifyContent: 'center',
				flexShrink: 0,
				position: 'relative',
				left: '-5vw',
				borderColor: violet,
				flex: 1,
			}}>
			<div style={{ backgroundColor: disableUsage ? 'grey' : violet, width: '100%', flex: 1 }}> </div>
			<div
				style={{
					backgroundColor: loadNb >= 2 ? violet : 'grey',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					width: '100%',
					flex: 1,
				}}>
				{disableUsage ? <h5>Element loading</h5> : <h5>Element ready</h5>}
			</div>
			<div style={{ flex: 1, backgroundColor: loadNb >= 1 ? violet : 'grey', width: '100%' }}> </div>
		</div>
	);
};
