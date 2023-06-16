import React, { useEffect, useState } from 'react';
import { Items } from './Items';
import { black } from '../../styles/Style';
import { User } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { SINGUP_PATH } from '../../utils/data';
import { useLocation } from 'react-router-dom';

function Game() {
  const navigate = useNavigate();
  const location = useLocation();
  const roomId = location.state?.roomId;
  const playerName = location.state?.playerName;

  return (
    <div style={{ flex: 1, backgroundColor: '#ecf0f1', height: '100vh' }}>
      <h5>{roomId}</h5>
      <h5>Player {playerName}</h5>
      <Items />
    </div>
  );
}

export default Game;
