import { useLocation } from 'react-router-dom';

export const isNotEmpty = (input: string | Array<any>, minLength = 0) => input.length > minLength;

export const getCurrentPathName = () => {
  const location = useLocation();
  return location.pathname;
};
