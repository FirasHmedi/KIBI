import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  black,
  centerStyle,
  kaki,
  primary,
  signinContainerStyle,
  softGrey,
  softKaki,
} from '../../styles/Style';
import { loginWithEmailPsw } from '../../utils/auth';
import { SINGUP_PATH } from '../../utils/data';
import { isNotEmpty } from '../../utils/helpers';

const inputStyle = {
  height: '3vh',
  borderRadius: 5,
  padding: 3,
  width: '15vw',
  borderWidth: 0,
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
    <div style={signinContainerStyle}>
      <input
        type='text'
        placeholder='Email address'
        required
        style={inputStyle}
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        type='password'
        placeholder='Password'
        required
        style={inputStyle}
        value={psw}
        onChange={e => setPsw(e.target.value)}
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
        onClick={() => signIn()}>
        Sign In
      </button>
      <Link style={{ color: softGrey }} to={SINGUP_PATH}>
        Want to register? Sign up
      </Link>
    </div>
  );
};
