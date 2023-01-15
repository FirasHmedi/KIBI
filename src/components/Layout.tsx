import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import {
  appStyle,
  black,
  buttonStyle,
  centerStyle,
  headerStyle,
  kaki,
} from '../styles/Style';
import { Link } from 'react-router-dom';
import { getCurrentPathName } from '../utils/helpers';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { HOME_PATH, SIGNIN_PATH, SINGUP_PATH } from '../utils/data';
import { signOutUser } from '../utils/auth';

export const Header = ({
  user,
  loading,
}: {
  user?: User;
  loading: boolean;
}) => {
  const path = getCurrentPathName();
  const linkPath = path === SINGUP_PATH ? SIGNIN_PATH : SINGUP_PATH;
  const linkName = path === SINGUP_PATH ? 'Sign In' : 'Sign Up';

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
        to={HOME_PATH}>
        KAWA
      </Link>
      {loading ? null : !!user ? (
        <div style={{ ...centerStyle, flexDirection: 'row', gap: '1vw' }}>
          <h5>{user.displayName}</h5>
          <button
            style={{
              ...buttonStyle,
              backgroundColor: kaki,
              padding: 5,
              fontSize: '0.8rem',
            }}
            onClick={() => signOutUser()}>
            Sign Out
          </button>
        </div>
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
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, _user => {
      if (_user) {
        setUser(_user);
      } else {
        setUser(undefined);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [auth]);

  return (
    <div style={appStyle}>
      <Header user={user} loading={loading} />
      {React.cloneElement(children, { user })}
    </div>
  );
};
