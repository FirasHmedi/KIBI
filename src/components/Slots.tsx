import { centerStyle, flexColumnStyle, violet } from '../styles/Style';
import { ANIMAL_CARDS_OBJECT, AnimalCard, CLANS, Card } from '../utils/data';

export const SlotBack = () => (
  <div
    style={{
      borderRadius: 5,
      backgroundColor: violet,
      color: 'white',
      fontSize: '1em',
      margin: 4,
      ...centerStyle,
      height: '14vh',
      width: '5vw',
    }}>
    <h5>KIBI</h5>
  </div>
);

export const Slot = ({ cardId }: { cardId?: string }) => {
  const card = cardId ? ANIMAL_CARDS_OBJECT[cardId.substring(4)] : null;
  return !!card && !!card?.clan ? (
    <div
      style={{
        ...flexColumnStyle,
        borderRadius: 5,
        backgroundColor: CLANS[card?.clan]?.color,
        color: 'white',
        fontSize: '1em',
        height: '17vh',
        width: '7vw',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}>
      <h4>{card?.name?.toUpperCase()}</h4>
      <h5>{card?.ability}</h5>
      <h5>{card?.role?.toUpperCase()}</h5>
    </div>
  ) : (
    <div
      style={{
        ...flexColumnStyle,
        borderRadius: 5,
        backgroundColor: '#95a5a6',
        color: 'white',
        fontSize: '1em',
        height: '17vh',
        width: '7vw',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
      <h5>EMPTY</h5>
    </div>
  );
};

export const EnvSlot = ({ envCard }: { envCard?: Card }) => (
  <div
    style={{
      ...centerStyle,
      borderRadius: 5,
      backgroundColor: CLANS[(envCard?.ability ?? 'neutral') as keyof typeof CLANS]?.color,
      color: 'white',
      fontSize: '1em',
      flexDirection: 'column',
      height: '17vh',
      width: '7vw',
      transform: 'rotate(90deg)',
      justifyContent: 'center',
      flexShrink: 0,
    }}>
    <h5 style={{ transform: 'rotate(-90deg)' }}>{envCard?.name ?? 'Neutral'}</h5>
  </div>
);

export type AllCards = AnimalCard | Card | undefined;

export const OpponentPSlots = ({ opponentPSlots }: { opponentPSlots: string[] }) => <Slots slots={opponentPSlots} />;

export const CurrentPSlots = ({ currentPSlots }: { currentPSlots: string[] }) => <Slots slots={currentPSlots} />;

const Slots = ({ slots }: { slots: string[] }) => (
  <div
    style={{
      ...centerStyle,
      width: '24vw',
      justifyContent: 'space-evenly',
    }}>
    <Slot cardId={slots[0]} />
    <Slot cardId={slots[1]} />
    <Slot cardId={slots[2]} />
  </div>
);
