import { useEffect, useState } from 'react';
import {
  buttonStyle,
  centerStyle,
  flexColumnStyle,
  flexRowStyle,
  selectedColor,
  violet,
} from '../styles/Style';
import { ANIMALS_CARDS, ANIMALS_POINTS, CLANS, READY, rolesIcons } from '../utils/data';
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
    if (disabledBtn && idsSelected.size > 0) return;
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
        top: 100,
        flexDirection: 'column',
        width: '100vw',
        gap: 12,
      }}>
      <div
        style={{
          ...centerStyle,
          justifyContent: 'space-between',
          gap: 4,
        }}>
        {ANIMALS_CARDS.filter((_, index) => index >= 0 && index < 4).map(
          (animal: AnimalCard, index: number) => (
            <AnimalSelectionSlot
              key={index}
              animal={animal}
              idsSelected={idsSelected}
              toggleAnimalSelection={toggleAnimalSelection}
            />
          ),
        )}
      </div>
      <div
        style={{
          ...centerStyle,
          justifyContent: 'space-between',
          gap: 4,
        }}>
        {ANIMALS_CARDS.filter((_, index) => index >= 4 && index < 8).map(
          (animal: AnimalCard, index: number) => (
            <AnimalSelectionSlot
              key={index}
              animal={animal}
              idsSelected={idsSelected}
              toggleAnimalSelection={toggleAnimalSelection}
            />
          ),
        )}
      </div>
      <div
        style={{
          ...centerStyle,
          justifyContent: 'space-between',
          gap: 4,
        }}>
        {ANIMALS_CARDS.filter((_, index) => index >= 8 && index < 16).map(
          (animal: AnimalCard, index: number) => (
            <AnimalSelectionSlot
              key={index}
              animal={animal}
              idsSelected={idsSelected}
              toggleAnimalSelection={toggleAnimalSelection}
            />
          ),
        )}
      </div>
      <h4>{idsSelected.size} cards</h4>
      <button
        style={{
          ...buttonStyle,
          backgroundColor: disabledBtn ? '#95a5a6' : violet,
          padding: 12,
          fontSize: 26,
        }}
        disabled={disabledBtn}
        onClick={() => submitAnimalCards()}>
        GO
      </button>
    </div>
  );
};

const AnimalSelectionSlot = ({ animal, idsSelected, toggleAnimalSelection }: any) => {
  const { id, name, clan, role, ability }: AnimalCard = animal;
  return (
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
        justifyContent: 'space-between',
        marginRight: 10,
      }}
      onClick={() => toggleAnimalSelection(id)}>
      <h6>{name?.toUpperCase()}</h6>
      {ability && <h6 style={{ fontSize: '0.65em' }}>{ability}</h6>}
      <div
        style={{
          ...flexRowStyle,
          width: '100%',
          justifyContent: 'space-around',
          alignItems: 'center',
          paddingBottom: 4,
        }}>
        <h6>{ANIMALS_POINTS[role].ap} AP</h6>
        <img src={rolesIcons[role]} style={{ width: 22, filter: 'brightness(0) invert(1)' }}></img>
        <h6>{ANIMALS_POINTS[role].hp} HP</h6>
      </div>
    </div>
  );
};
