import React, { useEffect, useState } from 'react';
import { Items } from './Items';
import { black } from '../../styles/Style';
import { User } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { SINGUP_PATH } from '../../utils/data';

function Home({ user }: { user?: User }) {
  const navigate = useNavigate();

  return (
    <div style={{ flex: 1, backgroundColor: '#ecf0f1', height: '100vh'}}>
      <Items />
    </div>
  );
}

export default Home;
