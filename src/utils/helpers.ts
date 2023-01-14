import { useLocation, matchRoutes } from 'react-router-dom';
import { routes } from './routes';

export const isNotEmpty = (input: string | Array<any>, minLength = 0) =>
  input.length > minLength;

export const getCurrentPathName = () => {
  const location = useLocation();
  return location.pathname;
};
