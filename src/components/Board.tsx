import isNil from 'lodash/isNil';
import { centerStyle, flexColumnStyle } from '../styles/Style';
import { Board, Round } from '../utils/interface';
import { MainDeck } from './Decks';
import { RoundView, Seperator } from './Elements';
import { AnimalGraveyard, PowerGraveyard } from './GraveyardsView';
import { BoardSlots, DeckSlot, DropItem, ElementSlot } from './Slots';
import { useDrop } from 'react-dnd';
import { useState } from 'react';

interface Props {
	board: Board;
	round: Round;
	isMyRound: boolean;
	tankIdWithDoubleAPOfCurr?: string;
	tankIdWithDoubleAPOfOpp?: string;
	selectedCurrentPSlotNb?: number;
	selectedOppSlotsNbs?: number[];
	selectOppSlotsNbs: (slotNb: number) => void;
	selectCurrentSlot: (slotNb: number) => void;
	playCard: any;
	canPlacekingWithoutSacrifice?:boolean;
	playPowerCard?:any;
}

export const BoardView = ({
	board,
	selectCurrentSlot,
	selectOppSlotsNbs,
	selectedOppSlotsNbs = [],
	selectedCurrentPSlotNb,
	round,
	tankIdWithDoubleAPOfCurr,
	tankIdWithDoubleAPOfOpp,
	playCard,
	canPlacekingWithoutSacrifice,
	playPowerCard,
}: Props) => {
	const { mainDeck, currentPSlots, opponentPSlots, animalGY, powerGY, elementType, activeCardId } =
		board;
	const selectedCurrSlots = !isNil(selectedCurrentPSlotNb) ? [selectedCurrentPSlotNb!] : [];

	return (
		<div
			style={{
				...centerStyle,
				flexDirection: 'row',
			}}>
			<ActiveCardSlot 
			cardId={activeCardId!}
			playPowerCard={playPowerCard}
			/>

			<div
				style={{
					...centerStyle,
					...flexColumnStyle,
				}}>
				<BoardSlots
					slots={opponentPSlots}
					selectSlot={selectOppSlotsNbs}
					selectedSlots={selectedOppSlotsNbs}
					opponent={true}
					elementType={elementType}
					tankIdWithDoubleAP={tankIdWithDoubleAPOfOpp}
				/>
				<Seperator />
				<BoardSlots
					slots={currentPSlots}
					selectSlot={selectCurrentSlot}
					selectedSlots={selectedCurrSlots}
					current={true}
					elementType={elementType}
					tankIdWithDoubleAP={tankIdWithDoubleAPOfCurr}
					playCard={playCard}
					round={round}
					canPlacekingWithoutSacrifice={canPlacekingWithoutSacrifice}
				/>
			</div>

			<div style={{ position: 'absolute', left: '31vw' }}>
				<ElementSlot elementType={elementType} />
			</div>

			<div style={{ position: 'absolute', right: '3vw' }}>
				<RoundView nb={round.nb} />
				<Seperator />
				<MainDeck nbCards={mainDeck.length} />
				<Seperator />
				<AnimalGraveyard cardsIds={animalGY} />
				<Seperator />
				<PowerGraveyard cardsIds={powerGY} />
			</div>
		</div>
	);
};

const ActiveCardSlot = ({ cardId , playPowerCard }: { cardId: string; playPowerCard:any }) => {
	const [, drop] = useDrop(
		{	
			accept: 'powercard',
			drop: (item: DropItem) => {
				console.log(item);
				playPowerCard(item.id)
			},
		},
		[cardId],
	);
	return(<div ref={drop} style={{ position: 'absolute', left: '22vw' }}>
	<DeckSlot cardId={cardId} />
</div>)
	
};
