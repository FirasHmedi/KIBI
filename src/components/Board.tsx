import { centerStyle, flexColumnStyle, flexRowStyle, violet } from '../styles/Style';
import { AnimalCard, ClanName, getAnimalCard, getPowerCard } from '../utils/data';
import { isPowerCard } from '../utils/helpers';
import { MainDeck } from './Decks';
import { Seperator } from './Elements';
import { EnvSlot, Slot, Slots } from './Slots';

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
  envType?: ClanName;
  activeCardId?: string;
}

export const BoardView = ({
  board,
  selectCurrentSlot,
  selectOpponentSlot,
  selectedCurrentPSlotNb,
  selectedOpponentPSlotNb,
}: Props) => {
  const { mainDeck, currentPSlots, opponentPSlots, animalGY, powerGY, envType, activeCardId } =
    board;
  return (
    <div
      style={{
        ...centerStyle,
        flexDirection: 'row',
        width: '90vw',
        justifyContent: 'space-around',
      }}>
      <MainDeck nbCards={mainDeck.length} />

      {isPowerCard(activeCardId) && <ActiveCardSlot cardId={activeCardId!} />}

      <div
        style={{
          ...centerStyle,
          ...flexColumnStyle,
        }}>
        <Slots
          slots={opponentPSlots}
          selectSlot={selectOpponentSlot}
          selectedSlotNb={selectedOpponentPSlotNb}
        />
        <Seperator />
        <EnvSlot envType={envType} />
        <Seperator />
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

const PowerGraveyard = ({ cardsIds }: { cardsIds: string[] }) => (
  <div style={{ minHeight: '5vh', padding: 5 }}>
    <h4 style={{ color: violet }}>Power graveyard ({cardsIds.length})</h4>
    <div style={{ maxHeight: '15vh', overflowY: 'auto' }}>
      {cardsIds?.map((cardId, index) => {
        const card = getPowerCard(cardId);
        return (
          <div key={index} style={{ ...flexRowStyle, ...centerStyle, maxWidth: '15vw' }}>
            <h5>{card?.name?.toUpperCase()}</h5>
          </div>
        );
      })}
    </div>
  </div>
);

const AnimalGraveyard = ({ cardsIds }: { cardsIds: string[] }) => (
  <div style={{ minHeight: '5vh', padding: 5 }}>
    <h4 style={{ color: violet }}>Animal graveyard ({cardsIds.length})</h4>
    <div style={{ maxHeight: '15vh', overflowY: 'auto' }}>
      {cardsIds?.map((cardId, index) => {
        const card = getAnimalCard(cardId);
        return (
          <div key={index} style={{ ...flexRowStyle, ...centerStyle }}>
            <h5>
              {card?.name?.toUpperCase()}-{(card as AnimalCard)?.role?.toUpperCase()}
            </h5>
          </div>
        );
      })}
    </div>
  </div>
);
