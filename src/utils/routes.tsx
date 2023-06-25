import { Layout } from '../components/Layout';
import Game from '../pages/home/Game';
import Home from '../pages/home/Home';
import { GAME_PATH, HOME_PATH, SIGNIN_PATH, SINGUP_PATH } from './data';

export const routes = [
  {
    path: HOME_PATH,
    element: (
      <Layout>
        <Home />
      </Layout>
    ),
  },
  {
    path: GAME_PATH,
    element: (
      <Layout>
        <Game />
      </Layout>
    ),
  },
  {
    path: SINGUP_PATH,
    element: <Layout></Layout>,
  },
  {
    path: SIGNIN_PATH,
    element: <Layout></Layout>,
  },
];
