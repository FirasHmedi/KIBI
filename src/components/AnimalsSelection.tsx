import { Grid, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { getItemsOnce, setItem } from '../utils/db';
import { buttonStyle, centerStyle, primaryBlue } from '../styles/Style';
import { CLANS, PlayerType } from '../utils/data';

interface Props {
  playerId: string;
  playerType: PlayerType;
  roomId: string;
}

export type ClanName = 'air' | 'earth' | 'fire' | 'water';

export interface Animal {
  id: string;
  name: string;
  clan: ClanName;
  description: string;
  ability: string;
  role: string;
}

export const AnimalsSelection = ({ playerType, playerId, roomId }: Props) => {
  const [idsSelected, setIdsSelected] = useState<Set<string>>(new Set());
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [disabledBtn, setDisabledBtn] = useState(true);

  useEffect(() => {
    (async function () {
      let animals = await getItemsOnce('animal-cards');
      animals = Object.keys(animals).map((id: string) => ({
        id,
        ...animals[id],
      }));
      setAnimals(animals);
    })();
  }, []);

  useEffect(() => {
    console.log(playerId, playerType);
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
    console.log(playerType, playerId, [...idsSelected]);
    await setItem(`players/${playerType}/${playerId}`, {
      deckCardsId: [...idsSelected],
    });
    await setItem('rooms/' + roomId, {
      [`${playerType}`]: {
        status: 'ready',
      },
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
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        {animals.map(
          ({ id, name, clan, description, role, ability }: Animal) => (
            <div
              key={id}
              style={{
                border: 'solid 7px #95a5a6',
                borderRadius: 5,
                borderColor: idsSelected.has(id) ? '#2c3e50' : '#95a5a6',
                backgroundColor: CLANS[clan].color,
                color: 'white',
                fontSize: 24,
                margin: 5,
                padding: 5,
                ...centerStyle,
                flexDirection: 'column',
                height: '20vh',
                width: '8vw',
              }}
              onClick={() => toggleAnimalSelection(id)}>
              <h4>{name}</h4>
              <h6>{description}</h6>
              <h6>{role}</h6>
              <h6>{ability}</h6>
            </div>
          )
        )}
      </div>
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
