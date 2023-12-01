import isNil from 'lodash/isNil';
import { centerStyle, flexColumnStyle } from '../styles/Style';
import { isPowerCard } from '../utils/helpers';
import { Board, Round } from '../utils/interface';
import { MainDeck } from './Decks';
import { RoundView, Seperator } from './Elements';
import { AnimalGraveyard, PowerGraveyard } from './GraveyardsView';
import { BoardSlots, DeckSlot, ElementSlot } from './Slots';

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
			{isPowerCard(activeCardId) && <ActiveCardSlot cardId={activeCardId!} />}

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

const ActiveCardSlot = ({ cardId }: { cardId: string }) => (
	<div style={{ position: 'absolute', left: '22vw' }}>
		<DeckSlot cardId={cardId} />
	</div>
);
