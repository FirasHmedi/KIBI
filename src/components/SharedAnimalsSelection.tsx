import { useState } from 'react';
import {
  buttonStyle,
  centerStyle,
  flexColumnStyle,
  flexRowStyle,
  neutralColor,
  selectedColor,
  violet,
} from '../styles/Style';
import { ANIMALS_CARDS, ANIMALS_POINTS, CLANS, rolesIcons } from '../utils/data';
import { getRoomPath, setItem } from '../utils/db';
import { getOpponentIdFromCurrentId } from '../utils/helpers';
import { AnimalCard, PlayerType } from '../utils/interface';

interface Props {
  playerType: PlayerType;
  roomId: string;
  oneCards: string[];
  twoCards: string[];
  playerToSelect?: PlayerType;
}

export const SharedAnimalsSelection = ({
  playerType,
  roomId,
  oneCards,
  twoCards,
  playerToSelect,
}: Props) => {
  const [idSelected, setIdSelected] = useState<string>();
  const myCards = playerType === PlayerType.ONE ? oneCards : twoCards;
  const oppCards = playerType === PlayerType.ONE ? twoCards : oneCards;
  console.log(playerToSelect, playerType);
  const selectCard = (id: string) => {
    if (myCards.includes(id) || oppCards.includes(id)) return;
    setIdSelected(selectedId => (selectedId === id ? undefined : id));
  };

  const submitCard = async () => {
    if (!idSelected || myCards.includes(idSelected) || oppCards.includes(idSelected)) return;

    await setItem(getRoomPath(roomId) + `${playerType}`, {
      cardsIds: [...myCards, idSelected],
    });
    await setItem(getRoomPath(roomId), {
      playerToSelect: getOpponentIdFromCurrentId(playerType),
    });
    setIdSelected(undefined);
  };

  return (
    <div
      style={{
        ...centerStyle,
        flexDirection: 'column',
        width: '100vw',
        gap: 12,
        marginTop: 5,
      }}>
      {playerToSelect === playerType ? (
        <h5>Your turn to choose a card</h5>
      ) : (
        <h5>Opponent turn to choose a card</h5>
      )}
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
              idSelected={idSelected}
              toggleAnimalSelection={selectCard}
              myCards={myCards}
              oppCards={oppCards}
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
              idSelected={idSelected}
              toggleAnimalSelection={selectCard}
              myCards={myCards}
              oppCards={oppCards}
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
              idSelected={idSelected}
              toggleAnimalSelection={selectCard}
              myCards={myCards}
              oppCards={oppCards}
            />
          ),
        )}
      </div>
      <button
        style={{
          ...buttonStyle,
          backgroundColor: playerToSelect !== playerType || !idSelected ? neutralColor : violet,
          padding: 8,
          fontSize: 16,
        }}
        disabled={playerToSelect !== playerType && !!idSelected}
        onClick={() => submitCard()}>
        CHOOSE
      </button>
    </div>
  );
};

const AnimalSelectionSlot = ({
  animal,
  idSelected,
  toggleAnimalSelection,
  myCards = [],
  oppCards = [],
}: any) => {
  const { id, name, clan, role, ability }: AnimalCard = animal;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {myCards.includes(id) ? (
        <h5>For me</h5>
      ) : oppCards.includes(id) ? (
        <h5>For Opponent</h5>
      ) : (
        <h5></h5>
      )}
      <div
        key={id}
        style={{
          ...flexColumnStyle,
          border: 'solid 4px #95a5a6',
          borderRadius: 5,
          borderColor:
            idSelected === id
              ? selectedColor
              : myCards.includes(id) || oppCards.includes(id)
              ? violet
              : neutralColor,
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
          <img
            src={rolesIcons[role]}
            style={{ width: 22, filter: 'brightness(0) invert(1)' }}></img>
          <h6>{ANIMALS_POINTS[role].hp} HP</h6>
        </div>
      </div>
    </div>
  );
};
