import React from 'react';
import Game from '../pages/game/Game';
import Home from '../pages/home/Home';
import { appStyle } from '../styles/Style';
import { GAME_PATH, HOME_PATH, SIGNIN_PATH, SINGUP_PATH } from './data';

const Layout = ({ children }: any) => {
  return <div style={appStyle}>{React.cloneElement(children)}</div>;
};

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
