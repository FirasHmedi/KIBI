import isNil from 'lodash/isNil';
import { useDrop } from 'react-dnd';
import { centerStyle, flexColumnStyle } from '../styles/Style';
import { Board } from '../utils/interface';
import { MainDeck } from './Decks';
import { RoundView, Seperator } from './Elements';
import { AnimalGraveyard, PowerGraveyard } from './GraveyardsView';
import { BoardSlots, DeckSlot, DropItem, ElementSlot } from './Slots';

interface Props {
	board: Board;
	isMyRound: boolean;
	tankIdWithDoubleAPOfCurr?: string;
	tankIdWithDoubleAPOfOpp?: string;
	selectedCurrentPSlotNb?: number;
	selectedOppSlotsNbs?: number[];
	selectOppSlotsNbs: (slotNb: number) => void;
	selectCurrentSlot: (slotNb: number) => void;
	playCard: any;
	localState?: any;
}

export const BoardView = ({
	board,
	selectCurrentSlot,
	selectOppSlotsNbs,
	selectedOppSlotsNbs = [],
	selectedCurrentPSlotNb,
	tankIdWithDoubleAPOfCurr,
	tankIdWithDoubleAPOfOpp,
	playCard,
	localState,
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
			<ActiveCardSlot cardId={activeCardId!} playCard={playCard} localState={localState} />

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
					localState={localState}
				/>
			</div>

			<div style={{ position: 'absolute', right: '30vw' }}>
				<ElementSlot elementType={elementType} />
			</div>

			<div style={{ position: 'absolute', right: '3vw' }}>
				<RoundView nb={localState?.round?.nb} />
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

const ActiveCardSlot = ({
	cardId,
	playCard,
	localState,
}: {
	cardId: string;
	playCard: any;
	localState: any;
}) => {
	const [, drop] = useDrop(
		{
			accept: 'powercard',
			drop: (item: DropItem) => {
				console.log(item);
				if (!!playCard) playCard(item.id);
			},
		},
		[cardId, localState],
	);
	return (
		<div ref={drop} style={{ position: 'absolute', left: '27vw' }}>
			<DeckSlot cardId={cardId} />
		</div>
	);
};
