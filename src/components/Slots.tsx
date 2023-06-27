import { centerStyle, violet } from '../styles/Style';
import { AnimalCard, CLANS, Card } from '../utils/data';

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
  card?: Card | AnimalCard;
}

export const Slot = ({ card }: SlotProps) => (
  <div
    style={{
      borderRadius: 5,
      backgroundColor: (card as AnimalCard)?.clan ? CLANS[(card as AnimalCard)?.clan as keyof typeof CLANS]?.color : '#95a5a6',
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
        <h5>{(card as AnimalCard)?.role}</h5>
        <h5>{(card as AnimalCard)?.clan}</h5>
      </div>
    ) : (
      <h5>Empty Slot</h5>
    )}
  </div>
);

export type AllCards = AnimalCard | Card | undefined;

export const OpponentPSlots = ({ opponentPSlots }: { opponentPSlots: AllCards[] } = { opponentPSlots: [] }) => {
  return (
    <div
      style={{
        display: 'flex',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <Slot card={opponentPSlots[0]} />
      <Slot card={opponentPSlots[1]} />
      <Slot card={opponentPSlots[2]} />
    </div>
  );
};

export const CurrentPSlots = ({ currentPSlots }: { currentPSlots: AllCards[] } = { currentPSlots: [] }) => (
  <div
    style={{
      display: 'flex',
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    }}>
    <Slot card={currentPSlots[0]} />
    <Slot card={currentPSlots[1]} />
    <Slot card={currentPSlots[2]} />
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
    <h5>{envCard?.name ?? 'No environment'}</h5>
  </div>
);
