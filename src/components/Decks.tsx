import { flexColumnStyle, flexRowStyle, violet } from '../styles/Style';
import { DeckSlot, SlotBack } from './Slots';
import mainDeck from '/src/assets/mainDeck.svg';

interface CurrentPDeckProps {
	cardsIds: string[];
	setSelectedId: (id?: string) => void;
	selectedId?: string;
	isJokerActive?: boolean;
}

export const CurrentPDeck = ({
	cardsIds = [],
	setSelectedId,
	selectedId,
	isJokerActive,
}: CurrentPDeckProps) => {
	const selectCard = (cardId: string) =>
		cardId === selectedId ? setSelectedId(undefined) : setSelectedId(cardId);
	return (
		<div
			style={{
				...flexRowStyle,
				width: '40rem',
				overflowY: 'auto',
				justifyContent: 'safe center',
			}}>
			{cardsIds.map((cardId, index) => (
				<div style={{ marginRight: 8 }} key={index} onClick={() => selectCard(cardId)}>
					<DeckSlot
						cardId={cardId}
						selected={selectedId === cardId}
						isJokerActive={isJokerActive}
					/>
				</div>
			))}
		</div>
	);
};

export const OpponentPDeck = ({
	cardsIds = [],
	spectator,
}: {
	cardsIds: string[];
	spectator?: boolean;
}) => {
	return (
		<div
			style={{
				...flexRowStyle,
				width: '60vw',
				overflowY: 'auto',
				justifyContent: 'safe center',
			}}>
			{!spectator
				? cardsIds.map((cardId, index) => (
						<div style={{ marginRight: 8 }} key={index}>
							<SlotBack />
						</div>
				  ))
				: cardsIds.map((cardId, index) => (
						<div style={{ marginRight: 8 }} key={index}>
							<DeckSlot cardId={cardId} />
						</div>
				  ))}
		</div>
	);
};

export const OpponentDeckView = ({ nbCards = 0 }: { nbCards: number }) => {
	const name = nbCards > 1 ? `${nbCards} cards` : nbCards === 1 ? '1 card' : 'No cards';
	return (
		<div
			style={{
				width: '6vw',
				...flexColumnStyle,
				color: violet,
				gap: 2,
			}}>
			<h5>{name}</h5>
			<img src={mainDeck} style={{ height: '3rem' }} />
		</div>
	);
};

export const MainDeck = ({ nbCards = 0 }: { nbCards: number }) => {
	const name = nbCards > 1 ? `${nbCards} cards` : nbCards === 1 ? '1 card' : 'No cards';
	return (
		<div
			style={{
				width: '17vw',
				...flexColumnStyle,
				color: violet,
				gap: 2,
			}}>
			<h5>{name} </h5>
			<img src={mainDeck} style={{ height: '4rem' }} />
		</div>
	);
};
