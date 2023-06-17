import React, { useEffect, useState } from 'react';
import { black, centerStyle } from '../../styles/Style';
import { User } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { SINGUP_PATH } from '../../utils/data';
import { useLocation } from 'react-router-dom';
import { AnimalsSelection } from '../../components/AnimalsSelection';

function Game() {
  const navigate = useNavigate();
  const location = useLocation();
  const { roomId, playerName, playerType, playerId } = location.state;

  return (
    <div
      style={{
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#ecf0f1',
        height: '100vh',
        textAlign: 'center',
      }}>
      <h5>Room {roomId}</h5>
      <AnimalsSelection playerType={playerType} playerId={playerId} />
      <div style={{ position: 'absolute', bottom: 10, ...centerStyle }}>
        <h5>
          Player {playerName} / Order {playerType}
        </h5>
      </div>
    </div>
  );
}

export default Game;
