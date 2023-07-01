import { useState } from 'react';
import { buttonStyle, flexRowStyle, primaryBlue, violet } from '../styles/Style';
import { Player } from '../utils/data';
import { CurrentPDeck, OpponentPDeck } from './Decks';

interface Props {
  player: Player;
}

export const CurrentPView = ({ player }: Props) => {
  const deckCardsIds = player.deckCardsIds ?? [];
  const [selectedId, setSelectedId] = useState<string>();
  const disabledButton = !selectedId;
  const playCard = () => {};

  return (
    <div
      style={{
        ...flexRowStyle,
        height: '20vh',
        alignItems: 'center',
        padding: 5,
      }}>
      <button
        style={{
          ...buttonStyle,
          fontSize: '0.8em',
          position: 'absolute',
          left: '12vw',
          backgroundColor: disabledButton ? '#95a5a6' : primaryBlue,
        }}
        disabled={disabledButton}
        onClick={() => playCard()}>
        Play card
      </button>
      <div style={{ color: violet, position: 'absolute', left: '2vw' }}>
        <h4>
          {player.playerType?.toUpperCase()} : {player.hp} HP
        </h4>
        <h5>{deckCardsIds.length} cards</h5>
      </div>
      <CurrentPDeck deckCardsIds={deckCardsIds} selectedId={selectedId} setSelectedId={setSelectedId} />
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
      <div style={{ color: violet, position: 'absolute', left: '2vw' }}>
        <h4>
          {player.playerType?.toUpperCase()} : {player.hp} HP
        </h4>
        <h5>{deckCardsIds.length} cards</h5>
      </div>
      <OpponentPDeck deckCardsIds={deckCardsIds} />
    </div>
  );
};
