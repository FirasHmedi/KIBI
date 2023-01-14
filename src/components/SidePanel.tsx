import React from 'react';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import { softGrey } from '../styles/Style';

export const SidePanel = () => {
  return (
    <div
      style={{
        width: '5vw',
        display: 'flex',
        flexDirection: 'column',
        height: '25vh',
        justifyContent: 'space-around',
        alignItems: 'center'
      }}>
      <HomeIcon style={{ color: softGrey, width: 25, height: 25 }} />
      <PersonIcon style={{ color: softGrey, width: 25, height: 25 }} />
      <InfoIcon style={{ color: softGrey, width: 25, height: 25 }} />
    </div>
  );
};
