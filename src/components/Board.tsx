import { useDrop } from 'react-dnd';
import { MdPerson } from 'react-icons/md';
import { TbSword } from 'react-icons/tb';
import { centerStyle, flexColumnStyle, violet } from '../styles/Style';
import { isPowerCard } from '../utils/helpers';
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
	setElement: () => void;
	canAttackOpponent?: boolean;
	attackPlayer: () => void;
}

export const BoardView = ({
	board,
	playCard,
	localState,
	attack,
	attackState,
	isOppDoubleAP,
	isCurrDoubleAP,
	setElement,
	canAttackOpponent,
	attackPlayer,
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
					canAttackOpponent={canAttackOpponent}
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

			<button onClick={() => setElement()}>
				<ElementSlot elementType={elementType} />
			</button>

			<button
				style={{
					position: 'absolute',
					right: '31vw',
					top: '57vh',
					borderRadius: 10,
					backgroundColor: canAttackOpponent ? violet : 'grey',
					padding: 4,
					...centerStyle,
				}}
				disabled={!canAttackOpponent}
				onClick={() => {
					attackPlayer();
				}}>
				<TbSword style={{ fontSize: '1.1rem', color: 'white' }} />
				<MdPerson style={{ fontSize: '1.1rem', color: 'white' }} />
			</button>

			<div style={{ position: 'absolute', right: '0vw', top: '10vh' }}>
				<MainDeck nbCards={mainDeck.length} />
				<Seperator h='4vh' />
				<AnimalGraveyard cardsIds={animalGY} />
				<Seperator h='4vh' />
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
			accept: 'movecard',
			drop: (item: DropItem) => {
				if (!isPowerCard(item.id) || !playCard) {
					return;
				}
				playCard(item.id);
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
