import { flexRowStyle } from '../styles/Style';
import { Slot, SlotBack } from './Slots';

interface Props {
  deckCardsIds: string[];
}

export const CurrentPDeck = ({ deckCardsIds }: Props = { deckCardsIds: [] }) => {
  return (
    <div
      style={{
        ...flexRowStyle,
        width: '70vw',
        justifyContent: 'space-evenly',
        overflowY: 'auto',
      }}>
      {deckCardsIds.map((cardId, index) => (
        <Slot key={index} cardId={cardId} />
      ))}
    </div>
  );
};

export const OpponentPDeck = ({ deckCardsIds }: Props = { deckCardsIds: [] }) => (
  <div
    style={{
      ...flexRowStyle,
      flex: 1,
      justifyContent: 'center',
    }}>
    {deckCardsIds.map((cardId, index) => (
      <SlotBack key={index} id={index} />
    ))}
  </div>
);
