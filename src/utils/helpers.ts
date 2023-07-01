import { useLocation } from 'react-router-dom';
import { ANIMAL_CARDS_OBJECT, POWER_CARDS_OBJECT, PREPARE, RUNNING } from './data';

export const isNotEmpty = (input: string | Array<any>, minLength = 0) => input.length > minLength;

export const getCurrentPathName = () => {
  const location = useLocation();
  return location.pathname;
};

export const isAnimalCard = (cardId?: string): boolean =>
  !!cardId && ANIMAL_CARDS_OBJECT.hasOwnProperty(cardId.substring(4));
export const isPowerCard = (cardId?: string): boolean =>
  !!cardId && POWER_CARDS_OBJECT.hasOwnProperty(cardId.substring(4));

export const isGameRunning = (status?: string): boolean => !!status && status === RUNNING;
export const isGameInPreparation = (status?: string): boolean => !!status && status === PREPARE;
