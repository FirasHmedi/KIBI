import { flexRowStyle } from '../styles/Style';
import { AllCards, Slot, SlotBack } from './Slots';

interface Props {
  deck: AllCards[];
}

export const CurrentPDeck = ({ deck }: Props = { deck: [] }) => (
  <div
    style={{
      ...flexRowStyle,
      flex: 1,
      justifyContent: 'center',
    }}>
    {deck.map((card, index) => (
      <Slot key={index} card={card} />
    ))}
  </div>
);

export const OpponentPDeck = ({ deck }: Props = { deck: [] }) => (
  <div
    style={{
      ...flexRowStyle,
      flex: 1,
      justifyContent: 'center',
    }}>
    {deck.map((card, index) => (
      <SlotBack key={index} id={index} />
    ))}
  </div>
);
