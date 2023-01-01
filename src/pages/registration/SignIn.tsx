import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { black, kaki, primary, softGrey, softKaki } from '../../styles/Style';
import { loginWithEmailPsw } from '../../utils/auth';
import { isNotEmpty } from '../../utils/helpers';

const inputStyle = {
  height: '3vh',
  borderRadius: 5,
  padding: 1,
};

export const SignIn = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [psw, setPsw] = useState('');

  const signIn = () => {
    loginWithEmailPsw(email, psw);
    navigate('/');
  };

  const isEnabled = () => isNotEmpty(psw) && email.includes('@');

  return (
    <div
      style={{
        backgroundColor: primary,
        borderRadius: 5,
        height: '40vh',
        width: '20vw',
        alignSelf: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 30,
        margin: 100,
      }}
    >
      <input
        type='text'
        placeholder='Email address'
        required
        style={inputStyle}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type='password'
        placeholder='Password'
        required
        style={inputStyle}
        value={psw}
        onChange={(e) => setPsw(e.target.value)}
      />
      <button
        style={{
          backgroundColor: isEnabled() ? kaki : softKaki,
          color: black,
          padding: 7,
          borderRadius: 5,
          fontWeight: 'bold',
        }}
        disabled={!isEnabled()}
        onClick={signIn}
      >
        Sign In
      </button>
      <Link style={{ color: softGrey }} to='/signup'>
        Want to register? Sign up
      </Link>
    </div>
  );
};
