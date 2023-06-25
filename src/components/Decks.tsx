import { flexRowStyle } from '../styles/Style';
import { Slot, SlotBack } from './Slots';

interface Props {
  deck: any[];
}

export const CurrentPDeck = ({ deck = [] }: Props) => (
  <div
    style={{
      ...flexRowStyle,
      flex: 1,
      justifyContent: 'center',
    }}>
    {deck.map(card => (
      <Slot nb={card.id} />
    ))}
  </div>
);

export const OpponentPDeck = ({ deck = [] }: Props) => (
  <div
    style={{
      ...flexRowStyle,
      flex: 1,
      justifyContent: 'center',
    }}>
    {deck.map(card => (
      <SlotBack nb={card.id} />
    ))}
  </div>
);
