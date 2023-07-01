import { centerStyle, flexColumnStyle, selectedColor, violet } from '../styles/Style';
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

interface SlotProps {
  cardId?: string;
  selected?: boolean;
  selectSlot?: (slotNb?: number, cardId?: string) => void;
  nb?: number;
}

const commonStyle: React.CSSProperties = {
  ...flexColumnStyle,
  borderRadius: 5,
  color: 'white',
  fontSize: '1em',
  height: '17vh',
  width: '7vw',
  flexShrink: 0,
};

export const Slot = ({ cardId, selected, selectSlot, nb }: SlotProps) => {
  const card = cardId ? ANIMAL_CARDS_OBJECT[cardId.substring(4)] : null;
  const selectSlotPolished = () => {
    if (!!selectSlot) selectSlot(nb, cardId);
  };

  return !!card && !!card?.clan ? (
    <div
      style={{
        ...commonStyle,
        backgroundColor: CLANS[card?.clan]?.color,
        justifyContent: 'space-between',
        border: selected ? `solid 4px ${selectedColor}` : '',
      }}
      onClick={() => selectSlotPolished()}>
      <h4>{card?.name?.toUpperCase()}</h4>
      <h5>{card?.ability}</h5>
      <h5>{card?.role?.toUpperCase()}</h5>
    </div>
  ) : (
    <div
      style={{
        ...commonStyle,
        backgroundColor: '#95a5a6',
        justifyContent: 'center',
        border: selected ? `solid 4px ${selectedColor}` : '',
      }}
      onClick={() => selectSlotPolished()}>
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

export const Slots = ({
  slots,
  selectedSlotNb,
  selectSlot,
}: {
  slots: string[];
  selectedSlotNb?: number;
  selectSlot: (slotNb?: number, cardId?: string) => void;
}) => {
  const compoundSlots = [slots[0], slots[1], slots[2]];
  return (
    <div
      style={{
        ...centerStyle,
        width: '24vw',
        justifyContent: 'space-evenly',
      }}>
      {compoundSlots.map((slot, index) => (
        <Slot nb={index} selectSlot={selectSlot} key={index} cardId={slot} selected={selectedSlotNb === index} />
      ))}
    </div>
  );
};
