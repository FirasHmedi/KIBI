import { flexRowStyle, violet } from '../styles/Style';
import { Player } from '../utils/data';
import { CurrentPDeck, OpponentPDeck } from './Decks';

interface Props {
  player: Player;
}

export const CurrentPView = ({ player }: Props) => {
  const deckCardsIds = player.deckCardsIds ?? [];
  return (
    <div
      style={{
        ...flexRowStyle,
        height: '20vh',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <div style={{ color: violet, position: 'absolute', left: 30 }}>
        <h2>
          {player.playerType?.toUpperCase()} : {player.hp} HP
        </h2>
        <h3>{deckCardsIds.length} cards</h3>
      </div>
      <CurrentPDeck deckCardsIds={deckCardsIds} />
    </div>
  );
};

export const OpponentPView = ({ player }: Props) => {
  const deckCardsIds = player.deckCardsIds ?? [];
  return (
    <div
      style={{
        ...flexRowStyle,
        height: '20vh',
        alignItems: 'center',
        padding: 5,
      }}>
      <div style={{ color: violet, position: 'absolute', left: 30 }}>
        <h2>
          {player.playerType?.toUpperCase()} : {player.hp} HP
        </h2>
        <h3>{deckCardsIds.length} cards</h3>
      </div>
      <OpponentPDeck deckCardsIds={deckCardsIds} />
    </div>
  );
};
