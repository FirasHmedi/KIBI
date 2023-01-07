import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  black,
  buttonStyle,
  centerStyle,
  kaki,
  primary,
  signupContainerStyle,
  softGrey,
  softKaki,
} from '../../styles/Style';
import { isNotEmpty } from '../../utils/helpers';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { loginWithGoogle, registerWithEmailPsw } from '../../utils/auth';

const inputStyle = {
  height: '3vh',
  borderRadius: 5,
  padding: 3,
  width: '15vw',
  borderWidth: 0,
};

export const SignUpfss = () => {
  return <></>;
};

export const SignUp = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [psw, setPsw] = useState('');
  const [confirmPsw, setConfirmPsw] = useState('');

  const signUp = async () => {
    try {
      if (!isNotEmpty(username)) return;
      const isUserRegistered = await registerWithEmailPsw(username, email, psw);
      if (isUserRegistered) navigate('/');
    } catch (e) {}
  };

  const signUpWithGoogle = async () => {
    try {
      if (!isNotEmpty(username)) return;
      const isUserRegistered = await loginWithGoogle(username);
      if (isUserRegistered) navigate('/');
    } catch (e) {}
  };

  const isEnabled = () =>
    true ||
    (isNotEmpty(username, 2) &&
      psw === confirmPsw &&
      isNotEmpty(psw) &&
      email.includes('@'));

  return (
    <div style={signupContainerStyle}>
      <input
        type='text'
        placeholder='Username'
        required
        style={inputStyle}
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
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
      <input
        type='password'
        placeholder='Repeat Password'
        required
        style={inputStyle}
        value={confirmPsw}
        onChange={(e) => setConfirmPsw(e.target.value)}
      />
      <button
        style={{
          ...buttonStyle,
          backgroundColor: isEnabled() ? kaki : softKaki,
        }}
        disabled={!isEnabled()}
        onClick={signUp}
      >
        Sign Up
      </button>
      <button style={buttonStyle} onClick={signUpWithGoogle}>
        Sign Up with Google
      </button>
      <Link style={{ color: softGrey }} to='/signin'>
        Already have an account? Sign in
      </Link>
    </div>
  );
};
