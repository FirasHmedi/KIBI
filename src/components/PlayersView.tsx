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
  const { hp, playerType, canAttack, canPlayPowers } = player;
  const cardsIds = player.cardsIds ?? [];
  const [selectedId, setSelectedId] = useState<string>();
  const isMyRound = round?.player === playerType;

  const isPlayCardEnabled =
    !!selectedId &&
    isMyRound &&
    (isAnimalCard(selectedId) || (canPlayPowers && isPowerCard(selectedId)));

  const isAttackAnimalEnabled = !!selectedId && isMyRound && canAttack && isAnimalCard(selectedId);

  return (
    <div
      style={{
        ...flexRowStyle,
        alignItems: 'center',
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
        {isPlayCardEnabled && (
          <button
            style={{
              ...buttonStyle,
              fontSize: '0.8em',
              backgroundColor: primaryBlue,
            }}
            onClick={() => playCard(selectedId)}>
            Play card
          </button>
        )}
        {isAttackAnimalEnabled && (
          <button
            style={{
              ...buttonStyle,
              fontSize: '0.8em',
              backgroundColor: primaryBlue,
            }}
            onClick={() => attackOpponentAnimal()}>
            Attack animal
          </button>
        )}
      </div>
      <PlayerNameView name={playerType} />
      <CurrentPDeck cardsIds={cardsIds} selectedId={selectedId} setSelectedId={setSelectedId} />
      <HealthAndCardsNbView hp={hp} cardsNb={cardsIds.length} />
    </div>
  );
};

export const OpponentPView = ({ player }: { player: Player }) => {
  const { hp, playerType } = player;
  const cardsIds = player.cardsIds ?? [];
  return (
    <div
      style={{
        ...flexRowStyle,
        alignItems: 'center',
      }}>
      <PlayerNameView name={playerType} />
      <OpponentPDeck cardsIds={cardsIds} />
      <HealthAndCardsNbView hp={hp} cardsNb={cardsIds.length} />
    </div>
  );
};

const PlayerNameView = ({ name }: { name?: string }) => (
  <h4 style={{ color: violet, position: 'absolute', left: '2vw', fontSize: '1.1em' }}>
    Player {name?.toUpperCase()}
  </h4>
);

const HealthAndCardsNbView = ({ hp, cardsNb }: { hp: number; cardsNb: number }) => (
  <div style={{ color: violet, position: 'absolute', right: '8vw', fontSize: '1.2em' }}>
    <h4>{hp} HP</h4>
    <h5>{cardsNb} cards</h5>
  </div>
);
