import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import {
  appStyle,
  black,
  primaryBlue,
  buttonStyle,
  centerStyle,
  headerStyle,
} from '../styles/Style';
import { Link } from 'react-router-dom';
import { getCurrentPathName } from '../utils/helpers';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { HOME_PATH, SIGNIN_PATH, SINGUP_PATH } from '../utils/data';

export const Header = ({ loading }: { loading: boolean }) => {
  const path = getCurrentPathName();

  return (
    <div style={headerStyle}>
      <Link
        style={{
          textDecoration: 'none',
          width: '2vw',
          fontWeight: 'bold',
          color: primaryBlue,
          fontSize: '1vw',
        }}
        to={HOME_PATH}>
        KIBI
      </Link>
    </div>
  );
};

export const Layout = ({ children }: any) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {}, []);

  return <div style={appStyle}>{React.cloneElement(children)}</div>;
};
