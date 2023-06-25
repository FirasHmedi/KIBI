import { centerStyle, flexColumnStyle } from '../styles/Style';
import { CLANS } from '../utils/data';
import { CurrentPSlots, EnvSlot, OpponentPSlots, SlotBack } from './Slots';

interface Props {
  mainDeck?: any[];
  opponentPSlots?: any[];
  currentPSlots?: any[];
  animalsGY: any[];
  powersGY: any[];
}

const DefaultProps = {
  mainDeck: [],
  opponentPSlots: [],
  currentPSlots: [],
  animalsGY: [],
  powersGY: [],
};

export const Board = ({ mainDeck, opponentPSlots, currentPSlots, animalsGY, powersGY }: Props = DefaultProps) => {
  return (
    <div
      style={{
        ...centerStyle,
        flexDirection: 'row',
        width: '100vw',
        height: '50vh',
        justifyContent: 'space-around',
      }}>
      <div style={{ width: '15vw', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div>Main Deck</div>
        <SlotBack nb='1' />
        <div>{mainDeck?.length ?? 0} cards</div>
      </div>
      <div style={{ ...centerStyle, ...flexColumnStyle }}>
        <OpponentPSlots />
        <EnvSlot name={'Water'} color={CLANS.water.color} />
        <CurrentPSlots />
      </div>
      <div style={{ width: '15vw', backgroundColor: 'pink' }}>
        <div style={{ minHeight: '5vh' }}>
          <h4>Animals graveyard ({animalsGY.length} cards)</h4>
          {animalsGY.map(card => (
            <h5>{card.text}</h5>
          ))}
        </div>
        <div style={{ minHeight: '5vh' }}>
          <h4>Power graveyard ({powersGY.length} cards)</h4>
          {powersGY.map(card => (
            <h5>{card.text}</h5>
          ))}
        </div>
      </div>
    </div>
  );
};
