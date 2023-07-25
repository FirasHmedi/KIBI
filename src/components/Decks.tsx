import { flexColumnStyle, flexRowStyle, violet } from '../styles/Style';
import { Slot, SlotBack } from './Slots';

interface CurrentPDeckProps {
  cardsIds: string[];
  setSelectedId: (id?: string) => void;
  selectedId?: string;
}

export const CurrentPDeck = ({ cardsIds = [], setSelectedId, selectedId }: CurrentPDeckProps) => {
  const selectCard = (cardId: string) =>
    cardId === selectedId ? setSelectedId(undefined) : setSelectedId(cardId);
  return (
    <div
      style={{
        ...flexRowStyle,
        width: '50vw',
        overflowY: 'auto',
      }}>
      {cardsIds.map((cardId, index) => (
        <div style={{ marginRight: 8 }} key={index} onClick={() => selectCard(cardId)}>
          <Slot cardId={cardId} selected={selectedId === cardId} />
        </div>
      ))}
    </div>
  );
};

export const OpponentPDeck = ({ cardsIds = [] }: { cardsIds: string[] }) => (
  <div
    style={{
      ...flexRowStyle,
      width: '40vw',
      overflowY: 'auto',
    }}>
    {cardsIds.map((_, index) => (
      <div key={index} style={{ marginRight: 8 }}>
        <SlotBack />
      </div>
    ))}
  </div>
);

export const MainDeck = ({ nbCards = 0 }: { nbCards: number }) => {
  return (
    <div style={{ width: '10vw', ...flexColumnStyle, color: violet }}>
      <h5>Main Deck</h5>
      <SlotBack />
      <h5>{nbCards} cards</h5>
    </div>
  );
};
