import { useDrag, useDrop } from 'react-dnd';
import { flexColumnStyle, flexRowStyle, violet } from '../styles/Style';
import { DeckSlot, SlotBack } from './Slots';
import { useCallback } from 'react';

interface CurrentPDeckProps {
	cardsIds: string[];
	setSelectedId: (id?: string) => void;
	selectedId?: string;
	isJokerActive?: boolean;
	updateCardsOrder?:any;
}
const DraggableDeckSlot = ({ cardId, index, moveCard, selected, isJokerActive } : { cardId : string,index : number , moveCard : any , selected : any , isJokerActive : boolean}) => {
	const [, drag] = useDrag({
	  type: "card",
	  item: { cardId, index },
	});
  
	const [, drop] = useDrop({
	  accept: "card",
	  hover(item:{cardId : string , index : number}) {
		if (!drag) return;
		console.log("i'm dragging")
		const dragIndex = item.index;
		const hoverIndex = index;
		if (dragIndex === hoverIndex) return;
		moveCard(dragIndex, hoverIndex);
		item.index = hoverIndex;
	  },
	});
  
	return (
	  <div ref={node => drag(drop(node))} style={{ marginRight: 8 }}>
		<DeckSlot 
		  cardId={cardId}
		  selected={selected}
		  isJokerActive={isJokerActive}
		/>
	  </div>
	);
  };

export const CurrentPDeck = ({
	cardsIds = [],
	setSelectedId,
	selectedId,
	isJokerActive,
	updateCardsOrder
}: CurrentPDeckProps) => {
const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
    const newCardsIds = Array.from(cardsIds);
    const [removed] = newCardsIds.splice(dragIndex, 1);
    newCardsIds.splice(hoverIndex, 0, removed);
	updateCardsOrder(newCardsIds)
    // Here you should update the cardsIds array in the state of the parent component
  }, [cardsIds,updateCardsOrder]);
	const selectCard = (cardId: string) =>
		cardId === selectedId ? setSelectedId(undefined) : setSelectedId(cardId);
	return (
		<div
			style={{
				...flexRowStyle,
				width: '40rem',
				overflowY: 'auto',
			}}>
			{cardsIds.map((cardId, index) => (
				<div style={{ marginRight: 8 }} key={index} onClick={() => selectCard(cardId)}>
				<DraggableDeckSlot
    		      key={cardId}
     		      index={index}
         		  cardId={cardId}
        		  moveCard={moveCard}
        		  selected={selectedId === cardId}
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
}) => (
	<div
		style={{
			...flexRowStyle,
			width: '40rem',
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
