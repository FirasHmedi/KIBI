import { centerStyle, flexColumnStyle } from '../styles/Style';
import { CLANS } from '../utils/data';
import { CurrentPSlots, EnvSlot, OpponentPSlots, SlotBack } from './Slots';

export const Board = () => {
  return (
    <div
      style={{
        ...centerStyle,
        flexDirection: 'row',
        width: '100vw',
        height: '50vh',
        backgroundColor: 'pink',
        justifyContent: 'space-around',
      }}>
      <div>
        <div>Main Deck</div>
        <SlotBack nb='1' />
        <div>10 cards</div>
      </div>
      <div style={{ ...centerStyle, ...flexColumnStyle }}>
        <OpponentPSlots />
        <EnvSlot name={'Water'} color={CLANS.water.color} />
        <CurrentPSlots />
      </div>
      <div>
        <div>Animals graveyard</div>
        <div>Powers graveyard</div>
      </div>
    </div>
  );
};
