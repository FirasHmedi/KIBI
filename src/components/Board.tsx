import { useState } from 'react';
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
}: Props) => {
  const { mainDeck, currentPSlots, opponentPSlots, animalGY, powerGY, envType, activeCardId } =
    board;
  const [selectedGYPower, selectGYPower] = useState<string>();
  const [selectedGYAnimal, selectGYAnimal] = useState<string>();
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
          selectCard={selectGYAnimal}
          selectedId={selectedGYAnimal}
        />
        <Seperator />
        <PowerGraveyard
          cardsIds={powerGY}
          selectCard={selectGYPower}
          selectedId={selectedGYPower}
        />
      </div>
    </div>
  );
};

const ActiveCardSlot = ({ cardId }: { cardId: string }) => (
  <div style={{ position: 'absolute', left: '25vw' }}>
    <Slot cardId={cardId} />
  </div>
);
