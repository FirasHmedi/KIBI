import { flexRowStyle } from '../styles/Style';
import { Player } from '../utils/data';
import { CurrentPDeck, OpponentPDeck } from './Decks';

interface Props {
  player: Player;
}

export const CurrentPView = ({ player }: Props) => (
  <div
    style={{
      ...flexRowStyle,
      height: '20vh',
      alignItems: 'center',
    }}>
    <div style={{ width: '7vw', position: 'absolute', left: 10, top: 10 }}>
      <h5>
        {player.playerName} : {player.playerType} : {player.hp} hp
      </h5>
      <h5>{player.deckCardsIds?.length ?? 0} cards in Deck</h5>
    </div>
    <CurrentPDeck deckCardsIds={player.deckCardsIds ?? []} />
  </div>
);

export const OpponentPView = ({ player }: Props) => (
  <div
    style={{
      ...flexRowStyle,
      height: '20vh',
    }}>
    <div style={{ width: '7vw', position: 'absolute', left: 10, bottom: 10 }}>
      <h5>
        {player.playerName} : {player.playerType} : {player.hp} hp
      </h5>
      <h5>Deck: {player.deckCardsIds?.length ?? 0} cards</h5>
    </div>
    <OpponentPDeck deckCardsIds={player.deckCardsIds ?? []} />
  </div>
);
