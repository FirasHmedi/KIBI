import { flexRowStyle } from '../styles/Style';
import { Slot, SlotBack } from './Slots';

export const CurrentPDeck = ({ deck }: { deck: any }) => (
  <div
    style={{
      ...flexRowStyle,
    }}>
    <Slot nb='1' />
    <Slot nb='2' />
    <Slot nb='3' />
  </div>
);

export const OpponentPDeck = ({ deck }: { deck: any }) => (
  <div
    style={{
      ...flexRowStyle,
    }}>
    <SlotBack nb='1' />
    <SlotBack nb='2' />
    <SlotBack nb='3' />
  </div>
);
