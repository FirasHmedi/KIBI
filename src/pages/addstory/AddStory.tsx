import React from 'react';
import { black, centerStyle, coffee, kaki, primary, softGrey } from '../../styles/Style';
import KeyboardIcon from '@mui/icons-material/Keyboard';

export const AddStory = () => {
  return (
    <div
      style={centerStyle}>
      <div
        style={{
          borderRadius: 10,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: softGrey,
          borderColor: kaki,
          paddingLeft: 15,
          paddingRight: 15,
          paddingTop: 10,
          paddingBottom: 10,
          width: '20vw',
          backgroundColor: primary,
        }}>
        <h4 style={{ fontWeight: '400', userSelect: 'none' }}>
          Write it ...
        </h4>
        <KeyboardIcon style={{ color: softGrey }} fontSize={'large'} />
      </div>
    </div>
  );
};
