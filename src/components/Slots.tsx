import { centerStyle, flexRowStyle, selectedColor, slotStyle, violet } from '../styles/Style';
import { ANIMALS_POINTS, CLANS, ClanName, getAnimalCard, getPowerCard } from '../utils/data';
import { isAnimalCard, isPowerCard } from '../utils/helpers';
import { SlotType } from '../utils/interface';

export const SlotBack = () => (
  <div
    style={{
      borderRadius: 5,
      backgroundColor: violet,
      color: 'white',
      ...centerStyle,
      height: '9vh',
      width: '3vw',
    }}>
    <h6>KIBI</h6>
  </div>
);

interface SlotProps {
  cardId?: string;
  selected?: boolean;
  selectSlot?: (slotNb?: number) => void;
  nb?: number;
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
      <h6 style={{ fontSize: '0.85em' }}>{name?.toUpperCase()}</h6>
      {ability && <h6 style={{ fontSize: '0.6em' }}>{ability}</h6>}
      <div
        style={{
          ...flexRowStyle,
          width: '100%',
          justifyContent: 'space-between',
        }}>
        <h6>{ap}AP</h6>
        <h6>{role?.toUpperCase()}</h6>
        <h6>{hp}HP</h6>
      </div>
    </div>
  );
};

export const Slot = ({ cardId, selected, selectSlot, nb }: SlotProps) => {
  const selectSlotPolished = () => {
    if (!!selectSlot) {
      selected ? selectSlot(undefined) : selectSlot(nb);
    }
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
      <h6>EMPTY</h6>
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
      height: '3vw',
      width: '3vw',
      transform: 'rotate(90deg)',
      justifyContent: 'center',
      flexShrink: 0,
      fontSize: '0.8em',
    }}>
    <h6 style={{ transform: 'rotate(-90deg)' }}>{envType?.toUpperCase()}</h6>
  </div>
);

export const Slots = ({
  slots,
  selectedSlotNb,
  selectSlot,
  opponent,
  current,
}: {
  slots: SlotType[];
  selectedSlotNb?: number;
  selectSlot: (slotNb?: number) => void;
  opponent?: boolean;
  current?: boolean;
}) => {
  const compoundSlots = [slots[0], slots[1], slots[2]];
  return (
    <div
      style={{
        ...centerStyle,
        width: '25vw',
        justifyContent: 'space-evenly',
      }}>
      {compoundSlots.map((slot, index) => (
        <div
          style={{
            marginTop: index === 1 && opponent ? 50 : 0,
            marginBottom: index === 1 && current ? 50 : 0,
          }}>
          <Slot
            nb={index}
            selectSlot={selectSlot}
            key={index}
            cardId={slot?.cardId}
            selected={selectedSlotNb === index}
          />
        </div>
      ))}
    </div>
  );
};
