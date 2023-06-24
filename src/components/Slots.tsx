import { centerStyle, violet } from '../styles/Style';

export const SlotBack = ({ nb }: { nb: string }) => (
  <div
    key={nb}
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

export const Slot = ({ nb }: { nb: string }) => (
  <div
    key={nb}
    style={{
      borderRadius: 5,
      backgroundColor: '#95a5a6',
      color: 'white',
      fontSize: 24,
      margin: 10,
      padding: 1,
      ...centerStyle,
      flexDirection: 'column',
      height: '16vh',
      width: '6vw',
    }}>
    Slot {nb}
  </div>
);

export const OpponentPSlots = () => (
  <div
    style={{
      display: 'flex',
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    }}>
    <Slot nb='1' />
    <Slot nb='2' />
    <Slot nb='3' />
  </div>
);

export const CurrentPSlots = () => (
  <div
    style={{
      display: 'flex',
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    }}>
    <Slot nb='1' />
    <Slot nb='2' />
    <Slot nb='3' />
  </div>
);

export const EnvSlot = ({ name, color }: { name: string; color: string }) => (
  <div
    style={{
      ...centerStyle,
      borderRadius: 5,
      backgroundColor: color ?? '#95a5a6',
      color: 'white',
      fontSize: 24,
      margin: 10,
      padding: 1,
      flexDirection: 'column',
      width: '16vh',
      height: '6vw',
    }}>
    {name}
  </div>
);
