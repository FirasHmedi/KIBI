import { centerStyle, flexColumnStyle } from '../styles/Style';
import { isPowerCard } from '../utils/helpers';
import { Board } from '../utils/interface';
import { MainDeck } from './Decks';
import { Seperator } from './Elements';
import { AnimalGraveyard, PowerGraveyard } from './GraveyardsView';
import { EnvSlot, Slot, BoardSlots } from './Slots';

interface Props {
	board: Board;
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
}: Props) => {
	const { mainDeck, currentPSlots, opponentPSlots, animalGY, powerGY, envType, activeCardId } = board;
	return (
		<div
			style={{
				...centerStyle,
				flexDirection: 'row',
				width: '90vw',
				justifyContent: 'space-between',
			}}>
			<MainDeck nbCards={mainDeck.length} />

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

			<div style={{ position: 'absolute', right: '30vw' }}>
				<EnvSlot envType={envType} />
			</div>

			<div>
				<AnimalGraveyard cardsIds={animalGY} selectCards={setSelectedGYAnimals} selectedIds={selectedGYAnimals} />
				<Seperator />
				<PowerGraveyard cardsIds={powerGY} />
			</div>
		</div>
	);
};

const ActiveCardSlot = ({ cardId }: { cardId: string }) => (
	<div style={{ position: 'absolute', left: '25vw' }}>
		<Slot cardId={cardId} />
	</div>
);
