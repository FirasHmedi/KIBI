import { useEffect, useState } from 'react';
import { buttonStyle, centerStyle, primaryBlue } from '../styles/Style';
import { ANIMALS_CARDS, AnimalCard, CLANS, PlayerType } from '../utils/data';
import { setItem } from '../utils/db';

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
    await setItem('rooms/' + roomId + `/${playerType}`, {
      deckCardsId: [...idsSelected].map(id => `${playerType}-${id}`),
      status: 'ready',
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
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          maxWidth: '90%',
          overflowY: 'scroll',
        }}>
        {ANIMALS_CARDS.map(({ id, name, clan, description, role, ability }: AnimalCard) => (
          <div
            key={id}
            style={{
              display: 'flex',
              border: 'solid 7px #95a5a6',
              borderRadius: 5,
              borderColor: idsSelected.has(id) ? '#2c3e50' : '#95a5a6',
              backgroundColor: CLANS[clan].color,
              color: 'white',
              fontSize: 24,
              margin: 5,
              padding: 15,
              flexDirection: 'column',
              height: '18vh',
              width: '8vw',
              flexShrink: 0,
              justifyContent: 'space-between',
            }}
            onClick={() => toggleAnimalSelection(id)}>
            <h4>{name?.toUpperCase()}</h4>
            <h6>{ability}</h6>
            <h6>{role}</h6>
          </div>
        ))}
      </div>
      <h5>{idsSelected.size} cards</h5>
      <button
        style={{
          ...buttonStyle,
          backgroundColor: disabledBtn ? '#95a5a6' : primaryBlue,
        }}
        disabled={disabledBtn}
        onClick={() => submitAnimalCards()}>
        Submit
      </button>
    </div>
  );
};
