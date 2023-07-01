import { centerStyle, flexColumnStyle } from '../styles/Style';
import { ALL_CARDS_OBJECT, Card } from '../utils/data';
import { Seperator } from './Elements';
import { EnvSlot, SlotBack, Slots } from './Slots';

interface Props {
  board?: Board;
  selectOpponentSlot: (slotNb?: number, cardId?: string) => void;
  selectCurrentSlot: (slotNb?: number, cardId?: string) => void;
  selectedCurrentPSlotNb?: number;
  selectedOpponentPSlotNb?: number;
}

export interface Board {
  mainDeck: string[];
  opponentPSlots: string[];
  currentPSlots: string[];
  animalsGY: string[];
  powersGY: string[];
  envCard?: Card;
}

export const NeutralEnvCard: Card = {
  id: '0',
  name: 'Neutral',
  ability: 'neutral',
};

const DefaultBoard = {
  mainDeck: [],
  opponentPSlots: [],
  currentPSlots: [],
  animalsGY: [],
  powersGY: [],
  envCard: NeutralEnvCard,
};

export const Board = ({
  board,
  selectCurrentSlot,
  selectOpponentSlot,
  selectedCurrentPSlotNb,
  selectedOpponentPSlotNb,
}: Props) => {
  const { mainDeck, opponentPSlots, currentPSlots, animalsGY, powersGY, envCard } = {
    ...DefaultBoard,
    ...board,
  };
  return (
    <div
      style={{
        ...centerStyle,
        flexDirection: 'row',
        width: '100vw',
        justifyContent: 'space-around',
      }}>
      <MainDeck nbCards={mainDeck.length} />

      <div style={{ ...centerStyle, ...flexColumnStyle }}>
        <Slots
          slots={opponentPSlots}
          selectSlot={selectOpponentSlot}
          selectedSlotNb={selectedOpponentPSlotNb}
        />
        <EnvSlot envCard={envCard} />
        <Slots
          slots={currentPSlots}
          selectSlot={selectCurrentSlot}
          selectedSlotNb={selectedCurrentPSlotNb}
        />
      </div>

      <div style={{ width: '15vw' }}>
        <Graveyard name='Animal' cardsIds={animalsGY} />
        <Seperator />
        <Graveyard name='Power' cardsIds={powersGY} />
      </div>
    </div>
  );
};

const MainDeck = ({ nbCards }: { nbCards: number }) => {
  return (
    <div style={{ width: '15vw', ...flexColumnStyle }}>
      <h5>Main Deck</h5>
      <SlotBack />
      <h5>{nbCards} cards</h5>
    </div>
  );
};

const Graveyard = ({ name, cardsIds }: { name: string; cardsIds: string[] }) => {
  return (
    <div style={{ minHeight: '5vh' }}>
      <h4>
        {name} graveyard ({cardsIds.length})
      </h4>
      <div style={{ maxHeight: '15vh', overflowY: 'auto' }}>
        {cardsIds?.map((cardId, index) => (
          <h5 key={index}>{ALL_CARDS_OBJECT[cardId.substring(4)]?.name?.toUpperCase()}</h5>
        ))}
      </div>
    </div>
  );
};
