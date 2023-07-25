import { flexRowStyle, violet } from '../styles/Style';
import { Slot } from './Slots';

export const PowerGraveyard = ({
  cardsIds,
  selectCard,
  selectedId,
}: {
  cardsIds: string[];
  selectCard: (id?: string) => void;
  selectedId?: string;
}) => (
  <Graveyard
    name={'Power graveyard'}
    cardsIds={cardsIds}
    selectCard={selectCard}
    selectedId={selectedId}
  />
);

export const AnimalGraveyard = ({
  cardsIds,
  selectCard,
  selectedId,
}: {
  cardsIds: string[];
  selectCard: (id?: string) => void;
  selectedId?: string;
}) => (
  <Graveyard
    name={'Animal graveyard'}
    cardsIds={cardsIds}
    selectCard={selectCard}
    selectedId={selectedId}
  />
);

export const Graveyard = ({
  name,
  cardsIds,
  selectCard,
  selectedId,
}: {
  name: string;
  cardsIds: string[];
  selectCard: (id?: string) => void;
  selectedId?: string;
}) => {
  const selectCardPolished = (cardId: string) =>
    cardId === selectedId ? selectCard(undefined) : selectCard(cardId);
  return (
    <div style={{ minHeight: '5vh', maxWidth: '12vw' }}>
      <h5 style={{ color: violet, marginBottom: 4 }}>
        {name} ({cardsIds.length})
      </h5>
      <div style={{ ...flexRowStyle, overflowY: 'auto' }}>
        {cardsIds.map((cardId, index) => (
          <div style={{ marginRight: 8 }} key={index} onClick={() => selectCardPolished(cardId)}>
            <Slot cardId={cardId} selected={selectedId === cardId} />
          </div>
        ))}
      </div>
    </div>
  );
};
