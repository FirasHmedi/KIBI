import {
  ReviveLastAnimalToDeck,
  add1Hp,
  drawOneCard,
  minus1Hp,
  removePlayerAnimalFromBoardAndAddToGraveYard,
  returnTankToDeck,
} from './animalsAbilities';
import { ANIMALS_POINTS, PlayerType, getAnimalCard } from './data';
import { getItemsOnce, setItem } from './db';
import { waitFor } from './helpers';
import {
  addAnimalToBoard,
  addAnimalToGraveYard,
  addCardsToPlayerDeck,
  addInfoToLog,
  getCardFromMainDeck,
  removeCardFromMainDeck,
  removeCardFromPlayerDeck,
  removeHpFromPlayer,
  removePlayerAnimalFromBoard,
  setActivePowerCard,
} from './unitActions';

export const enableAttackingAndPlayingPowerCards = async (roomId: string, playerType: string) => {
  await setItem('rooms/' + roomId + '/' + playerType, { canAttack: true, canPlayPowers: true });
};

export const drawCardFromMainDeck = async (roomId: string, playerType: string) => {
  await addInfoToLog(roomId, 'player ' + playerType + ' draw a card');
  const powerCardId = await getCardFromMainDeck(roomId);
  await removeCardFromMainDeck(roomId);
  await addCardsToPlayerDeck(roomId, playerType, [powerCardId]);
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
  if (!king || !sacrificedAnimal) return;
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
  const env = await getItemsOnce('rooms/' + roomId + '/envType');
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

export const activateJokerAbility = async (roomId: string, jokerId: string, playerType: string) => {
  const joker = getAnimalCard(jokerId);
  if (!joker) return;
  const envType = await getItemsOnce('rooms/' + roomId + '/board/envType');
  if (envType != joker.clan) return;
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

export const setPowerCardAsActive = async (
  roomId: string,
  playerType: PlayerType,
  cardId: string,
  name: string,
) => {
  await addInfoToLog(roomId, 'player ' + playerType + ' placed a ' + name);
  await removeCardFromPlayerDeck(roomId, playerType, cardId);
  await setActivePowerCard(roomId, cardId);
  await waitFor(2000);
  await setActivePowerCard(roomId, '');
};
