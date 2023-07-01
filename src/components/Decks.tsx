import { flexRowStyle, selectedColor } from '../styles/Style';
import { Slot, SlotBack } from './Slots';

interface CurrentPDeckProps {
  deckCardsIds: string[];
  setSelectedId: (id?: string) => void;
  selectedId?: string;
}

export const CurrentPDeck = ({ deckCardsIds, setSelectedId, selectedId }: CurrentPDeckProps) => {
  const selectCard = (cardId: string) => (cardId === selectedId ? setSelectedId(undefined) : setSelectedId(cardId));
  return (
    <div
      style={{
        ...flexRowStyle,
        width: '50vw',
        overflowY: 'auto',
      }}>
      {deckCardsIds.map((cardId, index) => (
        <div
          style={{
            marginRight: 15,
            borderRadius: 5,
            border: selectedId === cardId ? `solid 4px ${selectedColor}` : '',
          }}
          onClick={() => selectCard(cardId)}>
          <Slot key={index} cardId={cardId} />
        </div>
      ))}
    </div>
  );
};

export const OpponentPDeck = ({ deckCardsIds }: { deckCardsIds: string[] }) => (
  <div
    style={{
      ...flexRowStyle,
      width: '50vw',
      overflowY: 'auto',
    }}>
    {deckCardsIds.map((_, index) => (
      <div style={{ marginRight: 15 }}>
        <SlotBack key={index} />
      </div>
    ))}
  </div>
);
