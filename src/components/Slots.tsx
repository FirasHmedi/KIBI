import { centerStyle, commonStyle, selectedColor, violet } from '../styles/Style';
import { AnimalCard, CLANS, Card, EnvCard, getAnimalCard, getPowerCard } from '../utils/data';
import { isAnimalCard, isPowerCard } from '../utils/helpers';

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

export interface Slot {
  cardId: string;
  canAttack: boolean;
}

export const PowerSlot = ({
  cardId,
  select,
  selected,
}: {
  cardId: string;
  select: () => void;
  selected?: boolean;
}) => {
  const { name, ability } = getPowerCard(cardId) ?? {};
  return (
    <div
      style={{
        ...commonStyle,
        backgroundColor: violet,
        justifyContent: 'flex-start',
        borderColor: selected ? selectedColor : violet,
      }}
      onClick={() => select()}>
      <h4>{name?.toUpperCase()}</h4>
      <h5>{ability}</h5>
    </div>
  );
};

export const AnimalSlot = ({
  cardId,
  select,
  selected,
}: {
  cardId: string;
  select: () => void;
  selected?: boolean;
}) => {
  const { clan, name, ability, role } = getAnimalCard(cardId) ?? {};
  return (
    <div
      style={{
        ...commonStyle,
        backgroundColor: CLANS[clan!]?.color,
        justifyContent: 'space-between',
        borderColor: selected ? selectedColor : CLANS[clan!]?.color,
      }}
      onClick={() => select()}>
      <h4>{name?.toUpperCase()}</h4>
      <h5>{ability}</h5>
      <h5>{role?.toUpperCase()}</h5>
    </div>
  );
};

export const Slot = ({ cardId, selected, selectSlot, nb }: SlotProps) => {
  const selectSlotPolished = () => {
    if (!!selectSlot) selectSlot(nb, cardId);
  };

  if (cardId && isAnimalCard(cardId)) {
    return <AnimalSlot cardId={cardId} select={selectSlotPolished} selected={selected} />;
  }

  if (cardId && isPowerCard(cardId)) {
    return <PowerSlot cardId={cardId} select={selectSlotPolished} selected={selected} />;
  }

  return (
    <div
      style={{
        ...commonStyle,
        backgroundColor: '#95a5a6',
        justifyContent: 'center',
        borderColor: selected ? selectedColor : '#95a5a6',
      }}
      onClick={() => selectSlotPolished()}>
      <h5>EMPTY</h5>
    </div>
  );
};

export const EnvSlot = ({ envCard }: { envCard?: EnvCard }) => (
  <div
    style={{
      ...centerStyle,
      borderRadius: 5,
      backgroundColor: CLANS[envCard?.ability!]?.color,
      color: 'white',
      fontSize: '1em',
      flexDirection: 'column',
      height: '17vh',
      width: '7vw',
      transform: 'rotate(90deg)',
      justifyContent: 'center',
      flexShrink: 0,
    }}>
    <h5 style={{ transform: 'rotate(-90deg)' }}>{envCard?.name?.toUpperCase()}</h5>
  </div>
);

export type AllCards = AnimalCard | Card;

export const Slots = ({
  slots,
  selectedSlotNb,
  selectSlot,
}: {
  slots: Slot[];
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
        <Slot
          nb={index}
          selectSlot={selectSlot}
          key={index}
          cardId={slot?.cardId}
          selected={selectedSlotNb === index}
        />
      ))}
    </div>
  );
};
