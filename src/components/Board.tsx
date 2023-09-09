import { centerStyle, flexColumnStyle } from '../styles/Style';
import { isPowerCard } from '../utils/helpers';
import { Board } from '../utils/interface';
import { MainDeck } from './Decks';
import { RoundView, Seperator } from './Elements';
import { AnimalGraveyard, PowerGraveyard } from './GraveyardsView';
import { ElementSlot, BoardSlots, DeckSlot } from './Slots';

interface Props {
	board: Board;
	roundNb: number;
	selectOpponentSlot: (slotNb?: number) => void;
	selectCurrentSlot: (slotNb?: number) => void;
	selectedCurrentPSlotNb?: number;
	selectedOpponentPSlotNb?: number;
	selectedGYAnimals?: string[];
	setSelectedGYAnimals?: React.Dispatch<React.SetStateAction<string[] | undefined>>;
}

export const BoardView = ({
	board,
	selectCurrentSlot,
	selectOpponentSlot,
	selectedCurrentPSlotNb,
	selectedOpponentPSlotNb,
	selectedGYAnimals,
	setSelectedGYAnimals,
	roundNb,
}: Props) => {
	const { mainDeck, currentPSlots, opponentPSlots, animalGY, powerGY, elementType, activeCardId } = board;
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
					selectSlot={selectOpponentSlot}
					selectedSlotNb={selectedOpponentPSlotNb}
					opponent={true}
				/>
				<Seperator />
				<BoardSlots
					slots={currentPSlots}
					selectSlot={selectCurrentSlot}
					selectedSlotNb={selectedCurrentPSlotNb}
					current={true}
				/>
			</div>

			<div style={{ position: 'absolute', left: '31vw' }}>
				<ElementSlot elementType={elementType} />
			</div>

			<div style={{ position: 'absolute', right: '3vw' }}>
				<RoundView nb={roundNb} />
				<Seperator />
				<MainDeck nbCards={mainDeck.length} />
				<Seperator />
				<AnimalGraveyard cardsIds={animalGY} selectCards={setSelectedGYAnimals} selectedIds={selectedGYAnimals} />
				<Seperator />
				<PowerGraveyard cardsIds={powerGY} />
			</div>
		</div>
	);
};

const ActiveCardSlot = ({ cardId }: { cardId: string }) => (
	<div style={{ position: 'absolute', left: '25vw' }}>
		<DeckSlot cardId={cardId} />
	</div>
);
