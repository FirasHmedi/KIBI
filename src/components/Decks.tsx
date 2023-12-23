import { useRef } from 'react';
import { useDrop } from 'react-dnd';
import { flexColumnStyle, flexRowStyle, violet } from '../styles/Style';
import { DeckSlot, SlotBack } from './Slots';
import mainDeck from '/src/assets/mainDeck.svg';

interface CurrentPDeckProps {
	cardsIds: string[];
	isJokerActive?: boolean;
	updateCardsOrder?: any;
}
const DraggableDeckSlot = ({
	cardId,
	index,
	moveCard,
	isJokerActive,
}: {
	cardId: string;
	index: number;
	moveCard: any;
	isJokerActive: boolean;
}) => {
	/*const [, drag] = useDrag({
		type: 'card',
		item: { cardId, index },
	});*/
	const [, drop] = useDrop({
		accept: 'movecard',
		drop(item: { cardId: string; index: number }) {
			const dragIndex = item.index;
			const hoverIndex = index;
			if (dragIndex === hoverIndex) return;
			moveCard(dragIndex, hoverIndex);
			item.index = hoverIndex;
		},
	});

	const ref = useRef(null);
	drop(ref);

	return (
		<div ref={ref} style={{ marginRight: 8 }}>
			<DeckSlot cardId={cardId} isJokerActive={isJokerActive} index={index} />
		</div>
	);
};

export const CurrentPDeck = ({
	cardsIds = [],
	isJokerActive,
	updateCardsOrder,
}: CurrentPDeckProps) => {
	const moveCard = async (dragIndex: number, hoverIndex: number) => {
		const swapArr = [...cardsIds];
		[swapArr[dragIndex], swapArr[hoverIndex]] = [swapArr[hoverIndex], swapArr[dragIndex]];
		updateCardsOrder(swapArr);
	};

	return (
		<div
			style={{
				...flexRowStyle,
				width: '40rem',
				overflowY: 'auto',
				justifyContent: 'safe center',
			}}>
			{cardsIds.map((cardId, index) => (
				<div style={{ marginRight: 8 }} key={index}>
					<DraggableDeckSlot
						index={index}
						cardId={cardId}
						moveCard={moveCard}
						isJokerActive={isJokerActive!}
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
				width: '30vw',
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
