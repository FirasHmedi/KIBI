import { flexRowStyle, violet } from '../styles/Style';
import { Slot } from './Slots';

export const PowerGraveyard = ({ cardsIds }: { cardsIds: string[] }) => (
  <Graveyard name={'Power graveyard'} cardsIds={cardsIds} />
);

export const AnimalGraveyard = ({
  cardsIds,
  selectCards,
  selectedIds,
}: {
  cardsIds: string[];
  selectCards?: React.Dispatch<React.SetStateAction<string[] | undefined>>;
  selectedIds?: string[];
}) => (
  <Graveyard
    name={'Animal graveyard'}
    cardsIds={cardsIds}
    selectCards={selectCards}
    selectedIds={selectedIds}
  />
);

export const Graveyard = ({
  name,
  cardsIds = [],
  selectCards,
  selectedIds = [],
}: {
  name: string;
  cardsIds: string[];
  selectCards?: React.Dispatch<React.SetStateAction<string[] | undefined>>;
  selectedIds?: string[];
}) => {
  const selectCardsPolished = (cardId: string) => {
    if (!selectCards) return;
    selectedIds.includes(cardId)
      ? selectCards(ids => ids?.filter(id => cardId != id))
      : selectCards(ids => [...(ids ?? []), cardId]);
  };

  return (
    <div style={{ minHeight: '5vh', maxWidth: '20vw' }}>
      <h5 style={{ color: violet, marginBottom: 4 }}>
        {name} ({cardsIds.length})
      </h5>
      <div style={{ ...flexRowStyle, overflowY: 'auto' }}>
        {cardsIds.map((cardId, index) => (
          <div style={{ marginRight: 8 }} key={index} onClick={() => selectCardsPolished(cardId)}>
            <Slot cardId={cardId} selected={selectedIds.includes(cardId)} />
          </div>
        ))}
      </div>
    </div>
  );
};
