import React from 'react';
import { black, coffee, kaki, primary, softGrey } from '../../styles/Style';
import KeyboardIcon from '@mui/icons-material/Keyboard';

export const AddStory = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8,
      }}>
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
          width: '25vw',
          backgroundColor: primary,
        }}>
        <h4 style={{ fontWeight: '400', userSelect: 'none' }}>
          Share with us your story...
        </h4>
        <KeyboardIcon style={{ color: softGrey }} fontSize={'large'} />
      </div>
    </div>
  );
};
