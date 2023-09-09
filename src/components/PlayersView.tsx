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
					justifyContent: 'center',
					position: 'absolute',
					right: '26vw',
					bottom: '29vh',
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
					bottom: '3vh',
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
			<PlayerDataView player={player} />
			<div style={{ position: 'absolute', left: '22vw' }}>
				<ElementCard loadNb={player.envLoadNb} setElement={setElement} />
			</div>
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
			<h4>{playerType?.toUpperCase()}</h4>
			<progress style={{ width: '8vw' }} value={hp} max={hp > INITIAL_HP ? hp : INITIAL_HP} />
			<h4 style={{ fontSize: '1.1em' }}>{hp} HP</h4>
			{canAttack === false && <h5>Blocked from attacking</h5>}
			{canPlayPowers === false && <h5>Blocked from playing power cards</h5>}
			{isDoubleAP && <h5>King AP X 2 in its element</h5>}
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
