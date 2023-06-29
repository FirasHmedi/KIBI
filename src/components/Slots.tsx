import { centerStyle, violet } from '../styles/Style';
import { ANIMAL_CARDS_OBJECT, AnimalCard, CLANS, Card } from '../utils/data';

export const SlotBack = ({ id }: { id: number }) => (
  <div
    style={{
      borderRadius: 5,
      backgroundColor: violet,
      color: 'white',
      fontSize: 24,
      margin: 10,
      padding: 1,
      ...centerStyle,
      flexDirection: 'column',
      height: '16vh',
      width: '6vw',
      fontWeight: 'bold',
    }}>
    KIBI
  </div>
);

interface SlotProps {
  cardId?: string;
}

export const Slot = ({ cardId }: SlotProps) => {
  const card = cardId ? ANIMAL_CARDS_OBJECT[cardId] : null;
  return (
    <div
      style={{
        borderRadius: 5,
        backgroundColor: card?.clan ? CLANS[card?.clan as keyof typeof CLANS]?.color : '#95a5a6',
        color: 'white',
        fontSize: 24,
        margin: 10,
        padding: 1,
        ...centerStyle,
        flexDirection: 'column',
        height: '16vh',
        width: '6vw',
      }}>
      {card ? (
        <div>
          <h5>{card?.name}</h5>
          <h5>{card?.ability}</h5>
          <h5>{card?.role}</h5>
          <h5>{card?.clan}</h5>
        </div>
      ) : (
        <h5>Empty</h5>
      )}
    </div>
  );
};

export type AllCards = AnimalCard | Card | undefined;

export const OpponentPSlots = ({ opponentPSlots }: { opponentPSlots: string[] } = { opponentPSlots: ['0', '1', '2'] }) => {
  return (
    <div
      style={{
        display: 'flex',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <Slot cardId={opponentPSlots[0]} />
      <Slot cardId={opponentPSlots[1]} />
      <Slot cardId={opponentPSlots[2]} />
    </div>
  );
};

export const CurrentPSlots = ({ currentPSlots }: { currentPSlots: string[] } = { currentPSlots: ['0', '1', '2'] }) => (
  <div
    style={{
      display: 'flex',
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    }}>
    <Slot cardId={currentPSlots[0]} />
    <Slot cardId={currentPSlots[1]} />
    <Slot cardId={currentPSlots[2]} />
  </div>
);

// name={'Water'} color={CLANS.water.color}

interface Props {
  envCard?: Card;
}

export const EnvSlot = ({ envCard }: Props) => (
  <div
    style={{
      ...centerStyle,
      borderRadius: 5,
      backgroundColor: CLANS[envCard?.ability as keyof typeof CLANS]?.color ?? '#95a5a6',
      color: 'white',
      fontSize: 24,
      margin: 10,
      padding: 1,
      flexDirection: 'column',
      width: '16vh',
      height: '6vw',
    }}>
    <h5>{envCard?.name ?? 'Neutral'}</h5>
  </div>
);
