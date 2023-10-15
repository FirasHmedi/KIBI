import isNil from 'lodash/isNil';
import { centerStyle, flexColumnStyle } from '../styles/Style';
import { isPowerCard } from '../utils/helpers';
import { Board } from '../utils/interface';
import { MainDeck } from './Decks';
import { RoundView, Seperator } from './Elements';
import { AnimalGraveyard, PowerGraveyard } from './GraveyardsView';
import { BoardSlots, DeckSlot, ElementSlot } from './Slots';

interface Props {
	board: Board;
	roundNb: number;
	isMyRound: boolean;
	isDoubleCurrentAP?: boolean;
	isDoubleOpponentAP?: boolean;
	selectedCurrentPSlotNb?: number;
	selectedOppSlotsNbs?: number[];
	selectOppSlotsNbs: (slotNb: number) => void;
	selectCurrentSlot: (slotNb: number) => void;
	selectedGYAnimals: string[];
	setSelectedGYAnimals: React.Dispatch<React.SetStateAction<string[]>>;
	selectedGYPower: string[];
	setSelectedGYPower: React.Dispatch<React.SetStateAction<string[]>>;
}

export const BoardView = ({
	board,
	isMyRound,
	selectCurrentSlot,
	selectOppSlotsNbs,
	selectedOppSlotsNbs = [],
	selectedCurrentPSlotNb,
	selectedGYAnimals,
	setSelectedGYAnimals,
	roundNb,
	selectedGYPower,
	setSelectedGYPower,
	isDoubleCurrentAP = false,
	isDoubleOpponentAP = false,
}: Props) => {
	const { mainDeck, currentPSlots, opponentPSlots, animalGY, powerGY, elementType, activeCardId } = board;
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
					isDoubleAP={isDoubleOpponentAP}
				/>
				<Seperator />
				<BoardSlots
					slots={currentPSlots}
					selectSlot={selectCurrentSlot}
					selectedSlots={selectedCurrSlots}
					current={true}
					elementType={elementType}
					isDoubleAP={isDoubleCurrentAP}
				/>
			</div>

			<div style={{ position: 'absolute', left: '34vw' }}>
				<ElementSlot elementType={elementType} />
			</div>

			<div style={{ position: 'absolute', right: '3vw' }}>
				<RoundView nb={roundNb} />
				<Seperator />
				<MainDeck nbCards={mainDeck.length} />
				<Seperator />
				<AnimalGraveyard
					isMyRound={isMyRound}
					cardsIds={animalGY}
					selectIds={setSelectedGYAnimals}
					selectedIds={selectedGYAnimals}
				/>
				<Seperator />
				<PowerGraveyard
					isMyRound={isMyRound}
					cardsIds={powerGY}
					selectIds={setSelectedGYPower}
					selectedIds={selectedGYPower}
				/>
			</div>
		</div>
	);
};

const ActiveCardSlot = ({ cardId }: { cardId: string }) => (
	<div style={{ position: 'absolute', left: '25vw' }}>
		<DeckSlot cardId={cardId} />
	</div>
);
