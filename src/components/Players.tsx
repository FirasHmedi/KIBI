import { flexRowStyle } from '../styles/Style';
import { CurrentPDeck, OpponentPDeck } from './Decks';

interface Props {
  player: any;
  deck: any[];
}

export const CurrentPView = ({ player, deck }: Props) => (
  <div
    style={{
      ...flexRowStyle,
      height: '20vh',
      alignItems: 'center',
    }}>
    <div style={{ width: '7vw', position: 'absolute', left: 10, top: 10 }}>
      <h5>
        {player.playerName} : {player.playerType}
      </h5>
      <h5>Deck: {deck.length} cards</h5>
    </div>
    <CurrentPDeck deck={deck} />
  </div>
);

export const OpponentPView = ({ player, deck }: Props) => (
  <div
    style={{
      ...flexRowStyle,
      height: '20vh',
    }}>
    <div style={{ width: '7vw', position: 'absolute', left: 10, bottom: 10 }}>
      <h5>
        {player.playerName} : {player.playerType}
      </h5>
      <h5>Deck: {deck.length} cards</h5>
    </div>
    <OpponentPDeck deck={deck} />
  </div>
);
