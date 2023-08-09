import { useState } from 'react';
import { buttonStyle, flexColumnStyle, flexRowStyle, violet } from '../styles/Style';
import { isAnimalCard, isPowerCard } from '../utils/helpers';
import { Player, Round } from '../utils/interface';
import { CurrentPDeck, OpponentPDeck } from './Decks';

export const CurrentPView = ({
  player,
  round,
  playCard,
  finishRound,
  attackOpponentAnimal,
  attackOppHp,
  isAttackAnimalEnabled,
  isAttackOwnerEnabled,
  nbCardsToPlay,
}: {
  player: Player;
  round: Round;
  playCard: (cardId?: string) => void;
  finishRound: () => void;
  attackOpponentAnimal: () => void;
  attackOppHp: () => void;
  isAttackAnimalEnabled: boolean;
  isAttackOwnerEnabled: boolean;
  nbCardsToPlay: number;
}) => {
  const { hp, playerType, canAttack, canPlayPowers, isDoubleAP } = player;
  const cardsIds = player.cardsIds ?? [];
  const [selectedId, setSelectedId] = useState<string>();
  const isMyRound = round?.player === playerType;

  const isPlayCardEnabled =
    !!nbCardsToPlay &&
    !!selectedId &&
    isMyRound &&
    (isAnimalCard(selectedId) || (canPlayPowers && isPowerCard(selectedId)));

  return (
    <div
      style={{
        ...flexRowStyle,
        alignItems: 'center',
      }}>
      <div
        style={{
          ...flexColumnStyle,
          position: 'absolute',
          right: '12vw',
          bottom: '4vh',
          justifyContent: 'space-evenly',
          width: '10vw',
          gap: 6,
        }}>
        {!!nbCardsToPlay && isMyRound && (
          <h5 style={{ color: violet }}>Play {nbCardsToPlay} cards</h5>
        )}
        <button
          style={{
            ...buttonStyle,
            fontSize: '0.8em',
            backgroundColor: !isMyRound ? '#95a5a6' : violet,
          }}
          disabled={!isMyRound}
          onClick={() => finishRound()}>
          Finish
        </button>
        <button
          style={{
            ...buttonStyle,
            fontSize: '0.8em',
            backgroundColor: !isPlayCardEnabled ? 'grey' : violet,
          }}
          disabled={!isPlayCardEnabled}
          onClick={() => playCard(selectedId)}>
          Play card
        </button>

        <button
          style={{
            ...buttonStyle,
            fontSize: '0.8em',
            backgroundColor: !isAttackAnimalEnabled || !canAttack ? 'grey' : violet,
          }}
          disabled={!isAttackAnimalEnabled || !canAttack}
          onClick={() => attackOpponentAnimal()}>
          Strike animal
        </button>
        {isAttackOwnerEnabled && canAttack && (
          <button
            style={{
              ...buttonStyle,
              fontSize: '0.8em',
            }}
            onClick={() => attackOppHp()}>
            Strike directly
          </button>
        )}
      </div>
      <PlayerDataView
        name={playerType}
        hp={hp}
        canAttack={canAttack}
        canPlayPowers={canPlayPowers}
        isDoubleAP={isDoubleAP}
      />
      <CurrentPDeck cardsIds={cardsIds} selectedId={selectedId} setSelectedId={setSelectedId} />
    </div>
  );
};

export const OpponentPView = ({ player }: { player: Player }) => {
  const { hp, playerType, canAttack, canPlayPowers, cardsIds, isDoubleAP } = player;
  return (
    <div
      style={{
        ...flexRowStyle,
        alignItems: 'center',
      }}>
      <PlayerDataView
        name={playerType}
        hp={hp}
        canAttack={canAttack}
        canPlayPowers={canPlayPowers}
        isDoubleAP={isDoubleAP}
      />
      <OpponentPDeck cardsIds={cardsIds} />
    </div>
  );
};

const PlayerDataView = ({
  name,
  hp,
  canAttack = false,
  canPlayPowers = false,
  isDoubleAP = false,
}: {
  name?: string;
  hp: number;
  canAttack: boolean;
  canPlayPowers: boolean;
  isDoubleAP?: boolean;
}) => (
  <div
    style={{
      color: violet,
      position: 'absolute',
      left: '2vw',
      fontSize: '0.9em',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'center',
    }}>
    <h5>Player {name?.toUpperCase()}</h5>
    <progress value={hp} max={hp > 8 ? hp : 8} />
    <h4 style={{ fontSize: '0.9em' }}>{hp} HP</h4>
    {canAttack === false && <h5>Can't attack</h5>}
    {canPlayPowers === false && <h5>Can't play power cards</h5>}
    {isDoubleAP && <h5>King AP X 2</h5>}
  </div>
);
