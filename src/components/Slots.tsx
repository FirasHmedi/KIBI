import attIcon from '../assets/icons/att.png';
import noAttIcon from '../assets/icons/no-att.png';
import {
  centerStyle,
  flexRowStyle,
  neutralColor,
  selectedColor,
  slotStyle,
  violet,
} from '../styles/Style';
import {
  ANIMALS_POINTS,
  CLANS,
  ClanName,
  getAnimalCard,
  getPowerCard,
  rolesIcons,
} from '../utils/data';
import { isAnimalCard, isPowerCard } from '../utils/helpers';
import { SlotType } from '../utils/interface';
import './styles.css';

export const SlotBack = () => (
  <div
    style={{
      borderRadius: 5,
      backgroundColor: violet,
      color: 'white',
      ...centerStyle,
      height: '7vh',
      width: '2.5vw',
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
  isBigStyle,
}: {
  cardId: string;
  select: () => void;
  selected?: boolean;
  isBigStyle?: boolean;
}) => {
  const { name } = getPowerCard(cardId) ?? {};
  const bigStyle: React.CSSProperties = !!isBigStyle
    ? { height: '20vh', width: '8vw', fontSize: '1em' }
    : {};
  return (
    <div
      style={{
        ...slotStyle,
        backgroundColor: violet,
        justifyContent: 'center',
        borderColor: selected ? selectedColor : violet,
        ...bigStyle,
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
      <h6 style={{ fontSize: '0.85em', paddingTop: 4 }}>{name?.toUpperCase()}</h6>
      {ability && <h6 style={{ fontSize: '0.65em' }}>{ability}</h6>}
      <div
        style={{
          ...flexRowStyle,
          width: '100%',
          justifyContent: 'space-around',
          alignItems: 'center',
          paddingBottom: 4,
        }}>
        <h6>{ap} AP</h6>
        <img src={rolesIcons[role]} style={{ width: 22, filter: 'brightness(0) invert(1)' }}></img>
        <h6>{hp} HP</h6>
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
        backgroundColor: neutralColor,
        justifyContent: 'center',
        borderColor: selected ? selectedColor : neutralColor,
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
      height: '1.2vw',
      width: '10vw',
      justifyContent: 'center',
      flexShrink: 0,
      fontSize: '0.6em',
    }}></div>
);

const CanAttackIconsView = ({ slot }: { slot: SlotType }) => {
  return isAnimalCard(slot?.cardId) ? (
    slot?.canAttack ? (
      <img src={attIcon} style={{ width: 20 }}></img>
    ) : (
      <img src={noAttIcon} style={{ width: 20 }}></img>
    )
  ) : (
    <div style={{ height: 20 }} />
  );
};

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
        width: '21vw',
        justifyContent: 'space-evenly',
      }}>
      {compoundSlots.map((slot, index) => (
        <div
          key={index}
          style={{
            marginTop: index === 1 && opponent ? 50 : 0,
            marginBottom: index === 1 && current ? 50 : 0,
          }}
          className={
            slot?.hasAttacked ? (current ? 'up-transition' : 'down-transition') : undefined
          }>
          {current && <CanAttackIconsView slot={slot} />}

          <Slot
            nb={index}
            selectSlot={selectSlot}
            cardId={slot?.cardId}
            selected={selectedSlotNb === index}
          />

          {opponent && <CanAttackIconsView slot={slot} />}
        </div>
      ))}
    </div>
  );
};
