import { useEffect, useState } from 'react';
import {
  buttonStyle,
  centerStyle,
  flexColumnStyle,
  primaryBlue,
  selectedColor,
} from '../styles/Style';
import { ANIMALS_CARDS, CLANS, READY } from '../utils/data';
import { getRoomPath, setItem } from '../utils/db';
import { AnimalCard, PlayerType } from '../utils/interface';

interface Props {
  playerType: PlayerType;
  roomId: string;
}

export const AnimalsSelection = ({ playerType, roomId }: Props) => {
  const [idsSelected, setIdsSelected] = useState<Set<string>>(new Set());
  const [disabledBtn, setDisabledBtn] = useState(true);

  useEffect(() => {
    setDisabledBtn(idsSelected.size === 0);
  }, [idsSelected.size]);

  const toggleAnimalSelection = (id: string) => {
    setIdsSelected(idsSelected => {
      const _idsSelected = new Set(idsSelected);
      _idsSelected.has(id) ? _idsSelected.delete(id) : _idsSelected.add(id);
      return _idsSelected;
    });
  };

  const submitAnimalCards = async () => {
    setDisabledBtn(true);
    await setItem(getRoomPath(roomId) + `${playerType}`, {
      cardsIds: [...idsSelected].map(id => `${playerType}-${id}`),
      status: READY,
    });
  };

  return (
    <div
      style={{
        ...centerStyle,
        position: 'absolute',
        bottom: 50,
        flexDirection: 'column',
        width: '100vw',
      }}>
      <div
        style={{
          ...centerStyle,
          justifyContent: 'space-between',
          width: '85vw',
          overflowX: 'auto',
        }}>
        {ANIMALS_CARDS.map(({ id, name, clan, role, ability }: AnimalCard) => (
          <div
            key={id}
            style={{
              ...flexColumnStyle,
              border: 'solid 4px #95a5a6',
              borderRadius: 5,
              borderColor: idsSelected.has(id) ? selectedColor : '#95a5a6',
              backgroundColor: CLANS[clan].color,
              color: 'white',
              fontSize: '1.2em',
              height: '20vh',
              width: '8vw',
              flexShrink: 0,
              justifyContent: 'space-around',
              marginRight: 10,
            }}
            onClick={() => toggleAnimalSelection(id)}>
            <h4>{name?.toUpperCase()}</h4>
            <h6>{ability}</h6>
            <h6>{role?.toUpperCase()}</h6>
          </div>
        ))}
      </div>
      <h4>{idsSelected.size} cards</h4>
      <button
        style={{
          ...buttonStyle,
          backgroundColor: disabledBtn ? '#95a5a6' : primaryBlue,
          padding: 15,
          fontSize: 26,
        }}
        disabled={disabledBtn}
        onClick={() => submitAnimalCards()}>
        GO
      </button>
    </div>
  );
};
