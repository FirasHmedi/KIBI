import { useState } from 'react';
import { buttonStyle, flexColumnStyle, flexRowStyle, primaryBlue, violet } from '../styles/Style';
import { Player, Round } from '../utils/data';
import { isAnimalCard, isPowerCard } from '../utils/helpers';
import { CurrentPDeck, OpponentPDeck } from './Decks';

export const CurrentPView = ({
  player,
  round,
  playCard,
  finishRound,
  attackOpponentAnimal,
}: {
  player: Player;
  round: Round;
  playCard: (cardId?: string) => void;
  finishRound: () => void;
  attackOpponentAnimal: () => void;
}) => {
  const cardsIds = player.cardsIds ?? [];
  const [selectedId, setSelectedId] = useState<string>();
  const isMyRound = round?.player === player?.playerType;

  const isPlayButtonEnabled =
    !!selectedId &&
    isMyRound &&
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
      <div style={{ ...flexColumnStyle, position: 'absolute', left: '12vw' }}>
        <button
          style={{
            ...buttonStyle,
            fontSize: '0.8em',
            backgroundColor: !isMyRound ? '#95a5a6' : primaryBlue,
          }}
          disabled={!isMyRound}
          onClick={() => finishRound()}>
          Finish
        </button>
        <button
          style={{
            ...buttonStyle,
            fontSize: '0.8em',
            backgroundColor: !isPlayButtonEnabled ? '#95a5a6' : primaryBlue,
          }}
          disabled={!isPlayButtonEnabled}
          onClick={() => playCard(selectedId)}>
          Play card
        </button>
        <button
          style={{
            ...buttonStyle,
            fontSize: '0.8em',
            backgroundColor: !isMyRound ? '#95a5a6' : primaryBlue,
          }}
          disabled={!isMyRound}
          onClick={() => attackOpponentAnimal()}>
          Attack animal
        </button>
      </div>
      <h4 style={{ color: violet, position: 'absolute', left: '2vw', fontSize: '1.1em' }}>
        Player {player.playerType?.toUpperCase()}
      </h4>
      <CurrentPDeck cardsIds={cardsIds} selectedId={selectedId} setSelectedId={setSelectedId} />
      <div style={{ color: violet, position: 'absolute', right: '2vw', fontSize: '1.2em' }}>
        <h4>{player.hp} HP</h4>
        <h5>{cardsIds.length} cards</h5>
      </div>
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
      <h4 style={{ color: violet, position: 'absolute', left: '2vw', fontSize: '1.1em' }}>
        Player {player.playerType?.toUpperCase()}
      </h4>
      <OpponentPDeck cardsIds={cardsIds} />
      <div style={{ color: violet, position: 'absolute', right: '2vw', fontSize: '1.2em' }}>
        <h4>{player.hp} HP</h4>
        <h5>{cardsIds.length} cards</h5>
      </div>
    </div>
  );
};
