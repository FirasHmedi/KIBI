import { useState } from 'react';
import { buttonStyle, flexColumnStyle, flexRowStyle, violet } from '../styles/Style';
import { INITIAL_HP } from '../utils/data';
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
  const { playerType, canPlayPowers } = player;
  const cardsIds = player.cardsIds ?? [];
  const [selectedId, setSelectedId] = useState<string>();
  const isMyRound = round?.player === playerType;
  console.log(isAttackOwnerEnabled, player);
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
            backgroundColor: !isAttackAnimalEnabled ? 'grey' : violet,
          }}
          disabled={!isAttackAnimalEnabled}
          onClick={() => attackOpponentAnimal()}>
          Strike animal
        </button>
        <button
          style={{
            ...buttonStyle,
            fontSize: '0.8em',
            backgroundColor: !isAttackOwnerEnabled ? 'grey' : violet,
          }}
          disabled={!isAttackOwnerEnabled}
          onClick={() => attackOppHp()}>
          Strike directly
        </button>
      </div>
      <PlayerDataView player={player} />
      <CurrentPDeck cardsIds={cardsIds} selectedId={selectedId} setSelectedId={setSelectedId} />
    </div>
  );
};

export const OpponentPView = ({ player }: { player: Player }) => {
  return (
    <div
      style={{
        ...flexRowStyle,
        alignItems: 'center',
      }}>
      <PlayerDataView player={player} />
      <OpponentPDeck cardsIds={player.cardsIds} />
    </div>
  );
};

const PlayerDataView = ({ player }: { player: Player }) => {
  const { hp, playerType, canPlayPowers, isDoubleAP, canAttack } = player;
  return (
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
      <h5>Player {playerType?.toUpperCase()}</h5>
      <progress value={hp} max={hp > INITIAL_HP ? hp : INITIAL_HP} />
      <h4 style={{ fontSize: '0.9em' }}>{hp} HP</h4>
      {canAttack === false && <h5>Can't attack</h5>}
      {canPlayPowers === false && <h5>Can't play power cards</h5>}
      {isDoubleAP && <h5>King AP X 2</h5>}
    </div>
  );
};
