import { airColor, earthColor, fireColor, violet, waterColor } from '../styles/Style';
import { ClanName } from '../utils/data';

export const Seperator = ({ h }: { h?: string }) => {
  const height = h ?? '1vh';
  return <div style={{ height }} />;
};

export const EnvPopup = ({ changeEnv }: { changeEnv: (envType: ClanName) => void }) => (
  <div
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      height: '100%',
      width: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      zIndex: 1,
    }}>
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        margin: 'auto',
        height: '16vw',
        width: '16vw',
        zIndex: 10,
      }}>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div
          style={{ width: '8vw', height: '8vw', backgroundColor: fireColor }}
          onClick={() => changeEnv('fire')}
        />
        <div
          style={{ width: '8vw', height: '8vw', backgroundColor: airColor }}
          onClick={() => changeEnv('air')}
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div
          style={{ width: '8vw', height: '8vw', backgroundColor: waterColor }}
          onClick={() => changeEnv('water')}
        />
        <div
          style={{ width: '8vw', height: '8vw', backgroundColor: earthColor }}
          onClick={() => changeEnv('earth')}
        />
      </div>
    </div>
  </div>
);

export const RoundView = ({ nb }: { nb: number }) => (
  <div
    style={{
      position: 'absolute',
      left: '2%',
      top: 0,
      bottom: 0,
      margin: 'auto',
      height: '4vh',
      fontSize: '1em',
      fontWeight: 'bold',
      color: violet,
    }}>
    Round {nb}
  </div>
);
