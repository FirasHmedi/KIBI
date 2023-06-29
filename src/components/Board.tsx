import { centerStyle, flexColumnStyle } from '../styles/Style';
import { ANIMAL_CARDS_OBJECT, Card, POWER_CARDS_OBJECT } from '../utils/data';
import { CurrentPSlots, EnvSlot, OpponentPSlots, SlotBack } from './Slots';

interface Props {
  board?: Board;
}

export interface Board {
  mainDeck: string[];
  opponentPSlots: string[];
  currentPSlots: string[];
  animalsGY: string[];
  powersGY: string[];
  envCard?: Card;
}

export const NeutralEnvCard: Card = {
  id: '0',
  name: 'Neutral',
  ability: 'neutral',
};

const DefaultBoard = {
  mainDeck: [],
  opponentPSlots: [],
  currentPSlots: [],
  animalsGY: [],
  powersGY: [],
  envCard: NeutralEnvCard,
};

export const Board = ({ board }: Props) => {
  const { mainDeck, opponentPSlots, currentPSlots, animalsGY, powersGY, envCard } = { ...DefaultBoard, ...board };
  return (
    <div
      style={{
        ...centerStyle,
        flexDirection: 'row',
        width: '100vw',
        height: '50vh',
        justifyContent: 'space-around',
      }}>
      <div style={{ width: '15vw', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div>Main Deck</div>
        <SlotBack id={1} />
        <div>{mainDeck?.length ?? 0} cards</div>
      </div>
      <div style={{ ...centerStyle, ...flexColumnStyle }}>
        <OpponentPSlots opponentPSlots={opponentPSlots} />
        <EnvSlot envCard={envCard} />
        <CurrentPSlots currentPSlots={currentPSlots} />
      </div>
      <div style={{ width: '15vw', backgroundColor: 'pink' }}>
        <div style={{ minHeight: '5vh' }}>
          <h4>Animals graveyard ({animalsGY.length} cards)</h4>
          {animalsGY?.map((cardId, index) => (
            <h5 key={index}>{ANIMAL_CARDS_OBJECT[cardId]?.description}</h5>
          ))}
        </div>
        <div style={{ minHeight: '5vh' }}>
          <h4>Power graveyard ({powersGY.length} cards)</h4>
          {powersGY?.map((cardId, index) => (
            <h5 key={index}>{POWER_CARDS_OBJECT[cardId]?.description}</h5>
          ))}
        </div>
      </div>
    </div>
  );
};
