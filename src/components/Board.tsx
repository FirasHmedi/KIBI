import { centerStyle, flexColumnStyle, flexRowStyle, violet } from '../styles/Style';
import { AnimalCard, CLANS, EnvCard, getAnimalCard, getPowerCard } from '../utils/data';
import { isPowerCard } from '../utils/helpers';
import { Seperator } from './Elements';
import { EnvSlot, Slot, SlotBack, Slots } from './Slots';

interface Props {
  board: Board;
  selectOpponentSlot: (slotNb?: number, cardId?: string) => void;
  selectCurrentSlot: (slotNb?: number, cardId?: string) => void;
  selectedCurrentPSlotNb?: number;
  selectedOpponentPSlotNb?: number;
}

export interface Board {
  mainDeck: string[];
  currentPSlots: Slot[];
  opponentPSlots: Slot[];
  one?: Slot[];
  two?: Slot[];
  animalGY: string[];
  powerGY: string[];
  envCardId?: string;
  envCard: EnvCard;
  activeCardId?: string;
}

export const BoardView = ({
  board,
  selectCurrentSlot,
  selectOpponentSlot,
  selectedCurrentPSlotNb,
  selectedOpponentPSlotNb,
}: Props) => {
  const { mainDeck, currentPSlots, opponentPSlots, animalGY, powerGY, envCard, activeCardId } =
    board;
  console.log('env card', envCard);
  return (
    <div
      style={{
        ...centerStyle,
        flexDirection: 'row',
        width: '100vw',
        justifyContent: 'space-around',
      }}>
      <MainDeck nbCards={mainDeck.length} />

      {isPowerCard(activeCardId) && <ActiveCardSlot cardId={activeCardId!} />}

      <div
        style={{
          ...centerStyle,
          ...flexColumnStyle,
          backgroundColor:
            envCard?.ability! !== 'neutral' ? CLANS[envCard?.ability!]?.color : 'transparent',
        }}>
        <Slots
          slots={opponentPSlots}
          selectSlot={selectOpponentSlot}
          selectedSlotNb={selectedOpponentPSlotNb}
        />

        <EnvSlot envCard={envCard} />

        <Slots
          slots={currentPSlots}
          selectSlot={selectCurrentSlot}
          selectedSlotNb={selectedCurrentPSlotNb}
        />
      </div>

      <div style={{ width: '15vw' }}>
        <AnimalGraveyard cardsIds={animalGY} />
        <Seperator />
        <PowerGraveyard cardsIds={powerGY} />
      </div>
    </div>
  );
};

const ActiveCardSlot = ({ cardId }: { cardId: string }) => (
  <div style={{ position: 'absolute', left: '25vw' }}>
    <Slot cardId={cardId} />
  </div>
);

const MainDeck = ({ nbCards }: { nbCards: number }) => {
  return (
    <div style={{ width: '15vw', ...flexColumnStyle }}>
      <h5>Main Deck</h5>
      <SlotBack />
      <h5>{nbCards} cards</h5>
    </div>
  );
};

const PowerGraveyard = ({ cardsIds }: { cardsIds: string[] }) => (
  <div style={{ minHeight: '5vh', padding: 5 }}>
    <h4 style={{ color: violet }}>Power graveyard ({cardsIds.length})</h4>
    <div style={{ maxHeight: '15vh', overflowY: 'auto' }}>
      {cardsIds?.map((cardId, index) => {
        const card = getPowerCard(cardId);
        return (
          <div key={index} style={{ ...flexRowStyle, ...centerStyle }}>
            <h5>{card?.name?.toUpperCase()}</h5>
            <div> - </div>
            <h5>{card?.description?.slice(0, 30)}</h5>
          </div>
        );
      })}
    </div>
  </div>
);

const AnimalGraveyard = ({ cardsIds }: { cardsIds: string[] }) => (
  <div style={{ minHeight: '5vh', padding: 5 }}>
    <h4 style={{ color: violet }}>Power graveyard ({cardsIds.length})</h4>
    <div style={{ maxHeight: '15vh', overflowY: 'auto' }}>
      {cardsIds?.map((cardId, index) => {
        const card = getAnimalCard(cardId);
        return (
          <div key={index} style={{ ...flexRowStyle, ...centerStyle }}>
            <h5>{card?.name?.toUpperCase()}</h5>
            <div> - </div>
            <h5>{(card as AnimalCard)?.role?.toUpperCase()}</h5>
          </div>
        );
      })}
    </div>
  </div>
);
