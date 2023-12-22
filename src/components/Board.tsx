import { useDrop } from 'react-dnd';
import { centerStyle, flexColumnStyle } from '../styles/Style';
import { Board } from '../utils/interface';
import { MainDeck } from './Decks';
import { Seperator } from './Elements';
import { AnimalGraveyard, PowerGraveyard } from './GraveyardsView';
import { BoardSlots, DeckSlot, DropItem, ElementSlot } from './Slots';

interface Props {
	board: Board;
	isMyRound: boolean;
	playCard: any;
	localState?: any;
	attack?: any;
	attackState?: any;
	isOppDoubleAP?: boolean;
	isCurrDoubleAP?: boolean;
}

export const BoardView = ({
	board,
	playCard,
	localState,
	attack,
	attackState,
	isOppDoubleAP,
	isCurrDoubleAP,
}: Props) => {
	const { mainDeck, currPSlots, oppPSlots, animalGY, powerGY, elementType, activeCardId } = board;

	return (
		<div
			style={{
				...centerStyle,
				flexDirection: 'row',
			}}>
			<ActiveCardSlot cardId={activeCardId!} playCard={playCard} localState={localState} />
			<Seperator w='2vw' />
			<div
				style={{
					...centerStyle,
					...flexColumnStyle,
				}}>
				<BoardSlots
					slots={oppPSlots}
					opponent={true}
					elementType={elementType}
					attack={attack}
					attackState={attackState}
					localState={localState}
					isDoubleAP={isOppDoubleAP}
				/>
				<Seperator h='8vh' />
				<BoardSlots
					slots={currPSlots}
					current={true}
					elementType={elementType}
					playCard={playCard}
					localState={localState}
					attack={attack}
					attackState={attackState}
					isDoubleAP={isCurrDoubleAP}
				/>
			</div>
			<Seperator w='2vw' />
			<ElementSlot elementType={elementType} />

			<div style={{ position: 'absolute', right: '-1vw' }}>
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
		<div ref={drop}>
			<DeckSlot cardId={cardId} />
		</div>
	);
};
