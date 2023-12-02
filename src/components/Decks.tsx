import { flexColumnStyle, flexRowStyle, violet } from '../styles/Style';
import { Round } from '../utils/interface';
import { DeckSlot, SlotBack } from './Slots';

interface CurrentPDeckProps {
	cardsIds: string[];
	setSelectedId: (id?: string) => void;
	selectedId?: string;
	round?: Round;
}

export const CurrentPDeck = ({
	cardsIds = [],
	setSelectedId,
	selectedId,
	round,
}: CurrentPDeckProps) => {
	const selectCard = (cardId: string) =>
		cardId === selectedId ? setSelectedId(undefined) : setSelectedId(cardId);
	return (
		<div
			style={{
				...flexRowStyle,
				width: '40vw',
				overflowY: 'auto',
			}}>
			{cardsIds.map((cardId, index) => (
				<div style={{ marginRight: 8 }} key={index} onClick={() => selectCard(cardId)}>
					<DeckSlot cardId={cardId} selected={selectedId === cardId} round={round} />
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
}) => (
	<div
		style={{
			...flexRowStyle,
			width: '40vw',
			overflowY: 'auto',
			justifyContent: !spectator ? 'center' : undefined,
		}}>
		{!spectator
			? [...Array(cardsIds.length).keys()].map((_, index) => (
					<div key={index} style={{ marginRight: 6 }}>
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

export const MainDeck = ({ nbCards = 0 }: { nbCards: number }) => {
	return (
		<div
			style={{
				width: '17vw',
				...flexColumnStyle,
				color: violet,
				gap: 2,
			}}>
			<h5>Main Deck ({nbCards}) </h5>
			<SlotBack shadow />
		</div>
	);
};
