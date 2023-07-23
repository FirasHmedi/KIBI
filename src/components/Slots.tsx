import { centerStyle, selectedColor, slotStyle, violet } from '../styles/Style';
import {
  ANIMALS_POINTS,
  AnimalCard,
  CLANS,
  Card,
  ClanName,
  getAnimalCard,
  getPowerCard,
} from '../utils/data';
import { isAnimalCard, isPowerCard } from '../utils/helpers';

export const SlotBack = () => (
  <div
    style={{
      borderRadius: 5,
      backgroundColor: violet,
      color: 'white',
      ...centerStyle,
      height: '12vh',
      width: '4vw',
    }}>
    <h6>KIBI</h6>
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
  const { name } = getPowerCard(cardId) ?? {};
  return (
    <div
      style={{
        ...slotStyle,
        backgroundColor: violet,
        justifyContent: 'center',
        borderColor: selected ? selectedColor : violet,
      }}
      onClick={() => select()}>
      <h6>{name?.toUpperCase()}</h6>
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
  const { clan, name, ability, role } = getAnimalCard(cardId)!;
  const { hp, ap } = ANIMALS_POINTS[role];
  return (
    <div
      style={{
        ...slotStyle,
        backgroundColor: CLANS[clan!]?.color,
        justifyContent: 'space-between',
        borderColor: selected ? selectedColor : CLANS[clan!]?.color,
      }}
      onClick={() => select()}>
      <h5>{name?.toUpperCase()}</h5>
      <h6>{ability}</h6>
      <h6 style={{ fontSize: '0.6em' }}>
        {role?.toUpperCase()} ({ap},{hp})
      </h6>
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
        ...slotStyle,
        backgroundColor: '#95a5a6',
        justifyContent: 'center',
        borderColor: selected ? selectedColor : '#95a5a6',
      }}
      onClick={() => selectSlotPolished()}>
      <h5>EMPTY</h5>
    </div>
  );
};

export const EnvSlot = ({ envType }: { envType?: ClanName }) => (
  <div
    style={{
      ...centerStyle,
      borderRadius: 5,
      backgroundColor: CLANS[envType!]?.color,
      color: 'white',
      flexDirection: 'column',
      height: '4vw',
      width: '4vw',
      transform: 'rotate(90deg)',
      justifyContent: 'center',
      flexShrink: 0,
      fontSize: '0.8em',
    }}>
    <h6 style={{ transform: 'rotate(-90deg)' }}>{envType?.toUpperCase()}</h6>
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
        width: '22vw',
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
