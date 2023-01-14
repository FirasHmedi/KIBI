import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { appStyle, black, headerStyle, kaki } from '../styles/Style';
import { Link } from 'react-router-dom';
import { getCurrentPathName } from '../utils/helpers';
import { auth } from '../firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

export const Header = () => {
  const path = getCurrentPathName();
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);

  const linkPath = path === '/signup' ? '/signin' : '/signup';
  const linkName = path === '/signup' ? 'Sign In' : 'Sign Up';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, _user => {
      if (_user) {
        setUser(_user);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [auth]);

  return (
    <div style={headerStyle}>
      <Link
        style={{
          textDecoration: 'none',
          width: '4vw',
          fontWeight: 'bold',
          color: kaki,
          fontSize: '1.8vw',
        }}
        to={'/'}>
        KAWA
      </Link>
      {loading ? null : !!user ? (
        <h5>{user.uid}</h5>
      ) : (
        <Link
          style={{
            textDecoration: 'none',
            fontSize: '1.1vw',
            fontWeight: 'bold',
            color: kaki,
          }}
          to={linkPath}>
          {linkName}
        </Link>
      )}
    </div>
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
