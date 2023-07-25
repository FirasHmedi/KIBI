import { centerStyle, flexColumnStyle } from '../styles/Style';
import { ClanName } from '../utils/data';
import { isPowerCard } from '../utils/helpers';
import { MainDeck } from './Decks';
import { Seperator } from './Elements';
import { AnimalGraveyard, PowerGraveyard } from './GraveyardsView';
import { EnvSlot, Slot, Slots } from './Slots';

interface Props {
  board: Board;
  selectOpponentSlot: (slotNb?: number) => void;
  selectCurrentSlot: (slotNb?: number) => void;
  selectedCurrentPSlotNb?: number;
  selectedOpponentPSlotNb?: number;
  selectedGYAnimals?: string[];
  setSelectedGYAnimals?: React.Dispatch<React.SetStateAction<string[] | undefined>>;
}

export interface Board {
  mainDeck: string[];
  currentPSlots: Slot[];
  opponentPSlots: Slot[];
  one?: Slot[];
  two?: Slot[];
  animalGY: string[];
  powerGY: string[];
  envType?: ClanName;
  activeCardId?: string;
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
  const { mainDeck, currentPSlots, opponentPSlots, animalGY, powerGY, envType, activeCardId } =
    board;
  return (
    <div
      style={{
        ...centerStyle,
        flexDirection: 'row',
        width: '90vw',
        justifyContent: 'space-around',
      }}>
      <MainDeck nbCards={mainDeck.length} />

      {isPowerCard(activeCardId) && <ActiveCardSlot cardId={activeCardId!} />}

      <div
        style={{
          ...centerStyle,
          ...flexColumnStyle,
        }}>
        <Slots
          slots={opponentPSlots}
          selectSlot={selectOpponentSlot}
          selectedSlotNb={selectedOpponentPSlotNb}
        />
        <Seperator />
        <EnvSlot envType={envType} />
        <Seperator />
        <Slots
          slots={currentPSlots}
          selectSlot={selectCurrentSlot}
          selectedSlotNb={selectedCurrentPSlotNb}
        />
      </div>

      <div>
        <AnimalGraveyard
          cardsIds={animalGY}
          selectCards={setSelectedGYAnimals}
          selectedIds={selectedGYAnimals}
        />
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
