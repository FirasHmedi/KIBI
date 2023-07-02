import { useState } from 'react';
import { buttonStyle, flexRowStyle, primaryBlue, violet } from '../styles/Style';
import { Player } from '../utils/data';
import { isAnimalCard, isPowerCard } from '../utils/helpers';
import { CurrentPDeck, OpponentPDeck } from './Decks';

export const CurrentPView = ({
  player,
  round,
  playCard,
}: {
  player: Player;
  round: any;
  playCard: (cardId?: string) => void;
}) => {
  const cardsIds = player.cardsIds ?? [];
  const [selectedId, setSelectedId] = useState<string>();

  const isPlayButtonEnabled =
    !!selectedId &&
    round?.player === player?.playerType &&
    ((player?.canPlayAnimals && isAnimalCard(selectedId)) ||
      (player?.canPlayPowers && isPowerCard(selectedId)));

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
          backgroundColor: !isPlayButtonEnabled ? '#95a5a6' : primaryBlue,
        }}
        disabled={!isPlayButtonEnabled}
        onClick={() => playCard(selectedId)}>
        Play card
      </button>
      <div style={{ color: violet, position: 'absolute', left: '2vw', fontSize: '1.2em' }}>
        <h4>
          {player.playerType?.toUpperCase()} : {player.hp} HP
        </h4>
        <h5>{cardsIds.length} cards</h5>
      </div>
      <CurrentPDeck cardsIds={cardsIds} selectedId={selectedId} setSelectedId={setSelectedId} />
    </div>
  );
};

export const OpponentPView = ({ player }: { player: Player }) => {
  const cardsIds = player.cardsIds ?? [];
  return (
    <div
      style={{
        ...flexRowStyle,
        height: '20vh',
        alignItems: 'center',
        padding: 5,
      }}>
      <div style={{ color: violet, position: 'absolute', left: '2vw', fontSize: '1.2em' }}>
        <h4>
          {player.playerType?.toUpperCase()} : {player.hp} HP
        </h4>
        <h5>{cardsIds.length} cards</h5>
      </div>
      <OpponentPDeck cardsIds={cardsIds} />
    </div>
  );
};
