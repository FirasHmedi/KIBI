import { centerStyle, flexColumnStyle } from '../styles/Style';
import { Card } from '../utils/data';
import { AllCards, CurrentPSlots, EnvSlot, OpponentPSlots, SlotBack } from './Slots';

interface Props {
  board?: Board;
}

export interface Board {
  mainDeck: Card[];
  opponentPSlots: AllCards[];
  currentPSlots: AllCards[];
  animalsGY: AllCards[];
  powersGY: AllCards[];
  envCard?: Card;
}

const DefaultBoard = {
  mainDeck: [],
  opponentPSlots: [],
  currentPSlots: [],
  animalsGY: [],
  powersGY: [],
  envCard: undefined,
};

export const Board = ({ board }: Props) => {
  console.log('board ', board);
  const { mainDeck, opponentPSlots, currentPSlots, animalsGY, powersGY, envCard } = board ?? DefaultBoard;
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
        <OpponentPSlots opponentPSlots={opponentPSlots ?? []} />
        <EnvSlot envCard={envCard} />
        <CurrentPSlots currentPSlots={currentPSlots ?? []} />
      </div>
      <div style={{ width: '15vw', backgroundColor: 'pink' }}>
        <div style={{ minHeight: '5vh' }}>
          <h4>Animals graveyard ({animalsGY?.length} cards)</h4>
          {animalsGY.map((card, index) => (
            <h5 key={index}>{card?.description}</h5>
          ))}
        </div>
        <div style={{ minHeight: '5vh' }}>
          <h4>Power graveyard ({powersGY.length} cards)</h4>
          {powersGY.map((card, index) => (
            <h5 key={index}>{card?.description}</h5>
          ))}
        </div>
      </div>
    </div>
  );
};
