import { centerStyle, flexColumnStyle, flexRowStyle, violet } from '../styles/Style';
import { ALL_CARDS_OBJECT, AnimalCard, Card } from '../utils/data';
import { Seperator } from './Elements';
import { EnvSlot, Slot, SlotBack, Slots } from './Slots';

interface Props {
  board: Board;
  selectOpponentSlot: (slotNb?: number, cardId?: string) => void;
  selectCurrentSlot: (slotNb?: number, cardId?: string) => void;
  selectedCurrentPSlotNb?: number;
  selectedOpponentPSlotNb?: number;
}

export interface Board {
  mainDeck: string[];
  currentPSlots: Slot[];
  opponentPSlots: Slot[];
  animalGY: string[];
  powerGY: string[];
  envCard: Card;
  activeCardId?: string;
}

export const Board = ({
  board,
  selectCurrentSlot,
  selectOpponentSlot,
  selectedCurrentPSlotNb,
  selectedOpponentPSlotNb,
}: Props) => {
  const { mainDeck, currentPSlots, opponentPSlots, animalGY, powerGY, envCard, activeCardId } =
    board;
  return (
    <div
      style={{
        ...centerStyle,
        flexDirection: 'row',
        width: '100vw',
        justifyContent: 'space-around',
      }}>
      <MainDeck nbCards={mainDeck.length} />

      {!!activeCardId && (
        <div style={{ position: 'absolute', left: '25vw' }}>
          <Slot cardId={activeCardId} />
        </div>
      )}

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
        <Graveyard name='Animal' cardsIds={animalGY} />
        <Seperator />
        <Graveyard name='Power' cardsIds={powerGY} />
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

const Graveyard = ({ name, cardsIds }: { name: string; cardsIds: string[] }) => (
  <div style={{ minHeight: '5vh', padding: 5 }}>
    <h3 style={{ color: violet }}>
      {name} graveyard ({cardsIds.length})
    </h3>
    <div style={{ maxHeight: '15vh', overflowY: 'auto' }}>
      {cardsIds?.map((cardId, index) => {
        const card = ALL_CARDS_OBJECT[cardId.substring(4)] ?? ({} as AnimalCard);
        return (
          <div key={index} style={{ ...flexRowStyle, ...centerStyle }}>
            <h4>{card?.name?.toUpperCase()}</h4>
            <div> --- </div>
            {'role' in card ? (
              <h5>{(card as AnimalCard)?.role?.toUpperCase()}</h5>
            ) : (
              <h5>{card?.description?.toUpperCase()}</h5>
            )}
          </div>
        );
      })}
    </div>
  </div>
);
