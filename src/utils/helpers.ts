import _ from 'lodash';
import { useLocation } from 'react-router-dom';
import { POWER_CARDS_OBJECT, PREPARE, PlayerType, RUNNING, getAnimalCard } from './data';

export const isNotEmpty = (input: string | Array<any>, minLength = 0) => input.length > minLength;

export const getCurrentPathName = () => {
  const location = useLocation();
  return location.pathname;
};

export const isAnimalCard = (cardId?: string): boolean =>
  !!cardId && !_.isEmpty(getAnimalCard(cardId));
export const isPowerCard = (cardId?: string): boolean =>
  !!cardId && POWER_CARDS_OBJECT.hasOwnProperty(cardId.substring(4));

export const isGameRunning = (status?: string): boolean => !!status && status === RUNNING;
export const isGameInPreparation = (status?: string): boolean => !!status && status === PREPARE;

export const getOpponentId = (currentId: PlayerType): PlayerType =>
  currentId === PlayerType.ONE ? PlayerType.TWO : PlayerType.ONE;
