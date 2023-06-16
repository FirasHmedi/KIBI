import { Layout } from '../components/Layout';
import { SignIn } from '../pages/registration/SignIn';
import Home from '../pages/home/Home';
import { SignUp } from '../pages/registration/SignUp';
import { GAME_PATH, HOME_PATH, SIGNIN_PATH, SINGUP_PATH } from './data';
import Game from '../pages/home/Game';

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
    element: (
      <Layout>
      </Layout>
    ),
  },
  {
    path: SIGNIN_PATH,
    element: (
      <Layout>
      </Layout>
    ),
  },
];
