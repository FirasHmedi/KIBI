import { centerStyle, flexColumnStyle } from '../styles/Style';
import { isPowerCard } from '../utils/helpers';
import { Board, Player, PlayerType, Round } from '../utils/interface';
import { MainDeck } from './Decks';
import { RoundView, Seperator } from './Elements';
import { AnimalGraveyard, PowerGraveyard } from './GraveyardsView';
import { ElementSlot, BoardSlots, DeckSlot } from './Slots';

interface Props {
	board: Board;
	round: Round;
	roundNb: number;
	currentPlayer:Player;
	isDoubleCurrentAP?: boolean;
	isDoubleOpponentAP?: boolean;
	selectedCurrentPSlotNb?: number;
	selectedOpponentPSlotNb?: number;
	selectOpponentSlot: (slotNb?: number) => void;
	selectCurrentSlot: (slotNb?: number) => void;
	selectedGYAnimals: string[];
	setSelectedGYAnimals: React.Dispatch<React.SetStateAction<string[]>>;
	selectedGYPower: string[];
	setSelectedGYPower: React.Dispatch<React.SetStateAction<string[]>>;
}

export const BoardView = ({
	board,
	currentPlayer,
	round,
	selectCurrentSlot,
	selectOpponentSlot,
	selectedCurrentPSlotNb,
	selectedOpponentPSlotNb,
	selectedGYAnimals,
	setSelectedGYAnimals,
	roundNb,
	selectedGYPower,
	setSelectedGYPower,
	isDoubleCurrentAP = false,
	isDoubleOpponentAP = false,
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
					elementType={elementType}
					isDoubleAP={isDoubleOpponentAP}
				/>
				<Seperator />
				<BoardSlots
					slots={currentPSlots}
					selectSlot={selectCurrentSlot}
					selectedSlotNb={selectedCurrentPSlotNb}
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
				<AnimalGraveyard currentPlayer={currentPlayer} round={round}  cardsIds={animalGY}  selectIds={setSelectedGYAnimals}  selectedIds={selectedGYAnimals}  />
				<Seperator />
				<PowerGraveyard currentPlayer={currentPlayer} round={round} cardsIds={powerGY}  selectIds={setSelectedGYAnimals}  selectedIds={selectedGYAnimals} />
			</div>
		</div>
	);
};

const ActiveCardSlot = ({ cardId }: { cardId: string }) => (
	<div style={{ position: 'absolute', left: '25vw' }}>
		<DeckSlot cardId={cardId} />
	</div>
);
