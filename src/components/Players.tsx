import { flexRowStyle } from '../styles/Style';
import { CurrentPDeck, OpponentPDeck } from './Decks';

export const CurrentPView = ({ player, deck }: { player: any; deck: any }) => (
  <div
    style={{
      ...flexRowStyle,
      height: '20vh',
    }}>
    <h5>
      Player {player.playerName} / {player.playerType}
    </h5>
    <CurrentPDeck deck={[]} />
  </div>
);

export const OpponentPView = ({ player, deck }: { player: any; deck: any }) => (
  <div
    style={{
      ...flexRowStyle,
      height: '20vh',
    }}>
    <h5>
      Player {player.playerName} / {player.playerType}
    </h5>
    <OpponentPDeck deck={[]} />
  </div>
);
