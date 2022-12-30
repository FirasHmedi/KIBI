import React from 'react';
import { Box } from '@mui/material';
import { appStyle, black, headerStyle, kaki } from '../styles/Style';
import { Link } from 'react-router-dom';

export const Header = () => {
  return (
    <Box p={1} style={headerStyle} pl={4} pr={4}>
      <Link
        style={{
          textDecoration: 'none',
          width: '4vw',
          fontWeight: 'bold',
          color: kaki,
          fontSize: '1.8vw',
        }}
        to={'/'}
      >
        KAWA
      </Link>
      <Link
        style={{
          textDecoration: 'none',
          fontSize: '1.1vw',
          fontWeight: 'bold',
          color: kaki,
        }}
        to={'/signup'}
      >
        Sign Up
      </Link>
    </Box>
  );
};

export const Layout = ({ children }: any) => {
  return (
    <div style={appStyle}>
      <Header />
      {children}
    </div>
  );
};
