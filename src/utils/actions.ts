import _ from 'lodash';
import {
  cancelAttacks,
  cancelUsingPowerCards,
  draw2Cards,
  returnOneAnimal,
  reviveLastPower,
  sacrifice1HpReviveLastAnimal,
  sacrifice1HpToReturn2animals,
  sacrifice2HpToRevive,
  sacrifice3HpToSteal,
  sacrificeAnimalToGet3Hp,
  shieldOwnerPlus2Hp,
  shieldOwnerPlus3Hp,
  switchDeck,
  switchHealth,
} from './abilities';
import {
  ReviveLastAnimalToDeck,
  add1Hp,
  drawOneCard,
  minus1Hp,
  removePlayerAnimalFromBoardAndAddToGraveYard,
  returnTankToDeck,
} from './animalsAbilities';
import { ANIMALS_POINTS, PlayerType, getAnimalCard, getOriginalCardId, getPowerCard } from './data';
import { getItemsOnce } from './db';
import { waitFor } from './helpers';
import {
  addAnimalToBoard,
  addAnimalToGraveYard,
  addCardToPlayerDeck,
  addInfoToLog,
  addPowerToGraveYard,
  getCardFromMainDeck,
  removeCardFromMainDeck,
  removeCardFromPlayerDeck,
  removeHpFromPlayer,
  removePlayerAnimalFromBoard,
  setActivePowerCard,
} from './unitActions';

export const drawCardFromMainDeck = async (roomId: string, playerType: string) => {
  await addInfoToLog(roomId, 'player ' + playerType + ' draw a card');
  const powerCardId = await getCardFromMainDeck(roomId);
  await removeCardFromMainDeck(roomId);
  await addCardToPlayerDeck(roomId, playerType, powerCardId);
};
export const placeAnimalOnBoard = async (
  roomId: string,
  playerType: string,
  slotNb: number,
  animalId: string,
) => {
  const animal = getAnimalCard(animalId);
  await addInfoToLog(
    roomId,
    'player ' + playerType + ' placed a ' + animal?.name + ' in slot ' + slotNb,
  );
  await removeCardFromPlayerDeck(roomId, playerType, animalId);
  await addAnimalToBoard(roomId, playerType, slotNb, animalId);
};
export const placeKingOnBoard = async (
  roomId: string,
  playerType: string,
  kingId: string,
  sacrificedAnimalId: string,
  slotNb: number,
) => {
  const king = getAnimalCard(kingId);
  const sacrificedAnimal = getAnimalCard(sacrificedAnimalId);
  await addInfoToLog(
    roomId,
    'player ' + playerType + ' sacrificed a ' + sacrificedAnimal?.name + ' to play ' + king?.name,
  );
  const isRemoved = await removePlayerAnimalFromBoard(roomId, playerType, slotNb);
  if (isRemoved) {
    await addAnimalToGraveYard(roomId, sacrificedAnimalId);
    await removeCardFromPlayerDeck(roomId, playerType, kingId);
    await addAnimalToBoard(roomId, playerType, slotNb, kingId);
  }
};
export const attackAnimal = async (
  roomId: string,
  playerAType: PlayerType,
  playerDType: PlayerType,
  animalAId: string,
  animalDId: string,
  slotANumber: number,
  slotDNumber: number,
) => {
  const animalA = getAnimalCard(animalAId);
  const animalD = getAnimalCard(animalDId);
  if (!animalA || !animalD) return;
  if (ANIMALS_POINTS[animalA.role].ap < ANIMALS_POINTS[animalD.role].hp) return;

  await addInfoToLog(roomId, animalA.name + ' killed ' + animalD.name);
  await removePlayerAnimalFromBoard(roomId, playerDType, slotDNumber);
  await addAnimalToGraveYard(roomId, animalDId);
  const env = await getItemsOnce('rooms/' + roomId + '/env');
  if (env == animalD.clan) {
    if (animalD.role == 'attacker') {
      await removePlayerAnimalFromBoardAndAddToGraveYard(
        roomId,
        playerAType,
        slotANumber,
        animalAId,
      );
    } else if (animalD.role == 'tank') {
      await returnTankToDeck(roomId, playerDType, animalDId);
    }
  }
};
export const attackOwner = async (roomId: string, playerDType: string, animalId: string) => {
  const animal = getAnimalCard(animalId);
  await addInfoToLog(roomId, animal?.name + ' has attacked ' + playerDType + ' directly');
  // @ts-ignore
  await removeHpFromPlayer(roomId, playerDType, ANIMALS_POINTS[animal.role].ap);
};
export const jokerAbilities = async (roomId: string, jokerId: string, playerType: string) => {
  const joker = getAnimalCard(jokerId);
  if (!joker) return;
  const env = await getItemsOnce('rooms/' + roomId + '/env');
  if (env != joker.clan) return;
  await addInfoToLog(roomId, joker.name + ' has activated his ability');
  switch (joker.name) {
    case 'Crow':
      await minus1Hp(roomId, playerType);
      break;
    case 'Fox':
      await ReviveLastAnimalToDeck(roomId, playerType);
      break;
    case 'Snake':
      await add1Hp(roomId, playerType);
      break;
    case 'jellyfish':
      await drawOneCard(roomId, playerType);
      break;
  }
};

export const placePowerCard = async (
  roomId: string,
  playerType: string,
  cardId: string,
  animalId?: string,
  animalId2?: string,
  slotNb?: number,
) => {
  const { name } = getPowerCard(cardId) ?? {};

  if (_.isEmpty(name)) {
    console.error('No power card found', cardId);
    return;
  }

  await addInfoToLog(roomId, 'player ' + playerType + ' placed a ' + name);

  await removeCardFromPlayerDeck(roomId, playerType, cardId);

  await setActivePowerCard(roomId, cardId);

  await waitFor(4000);

  await setActivePowerCard(roomId, '');

  switch (getOriginalCardId(cardId)) {
    case '1-p':
      await cancelAttacks(roomId, playerType);
      break;
    case '2-p':
      await reviveLastPower(roomId, playerType);
      break;
    case '3-p':
      await sacrifice2HpToRevive(roomId, playerType, animalId, slotNb);
      break;
    case '4-p':
      await sacrifice3HpToSteal(roomId, playerType, animalId, slotNb);
      break;
    case '5-p':
      await sacrifice1HpReviveLastAnimal(roomId, playerType, slotNb);
      break;
    case '6-p':
      await switchHealth(roomId);
      break;
    case '7-p':
      await switchDeck(roomId);
      break;
    case '8-p':
      break;
    case '9-p':
      await sacrificeAnimalToGet3Hp(roomId, cardId, animalId);
      break;
    case '10-p':
      await shieldOwnerPlus2Hp(roomId, playerType);
      break;
    case '11-p':
      await shieldOwnerPlus3Hp(roomId, playerType);
      break;
    case '12-p':
      await draw2Cards(roomId, playerType);
      break;
    case '13-p':
      await sacrifice1HpToReturn2animals(roomId, playerType, animalId, animalId2);
      break;
    case '14-p':
      break;
    case '15-p':
      break;
    case '16-p':
      break;
    case '17-p':
      await cancelUsingPowerCards(roomId, playerType);
      break;
    case '18-p':
      await returnOneAnimal(roomId, playerType, animalId);
      break;
  }
  await addPowerToGraveYard(roomId, cardId);
};
