import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { black, kaki, primary, softGrey, softKaki } from '../../styles/Style';
import { isNotEmpty } from '../../utils/helpers';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { registerWithEmailPsw } from '../../utils/auth';

const inputStyle = {
  height: '3vh',
  borderRadius: 5,
  padding: 3,
  width: '15vw',
  borderWidth: 0,
};

export const SignUp = () => {
  const navigate = useNavigate();

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [psw, setPsw] = useState('');
  const [confirmPsw, setConfirmPsw] = useState('');

  const signUp = () => {
    registerWithEmailPsw(email, psw);
    navigate('/');
  };

  const isEnabled = () =>
    psw === confirmPsw && isNotEmpty(psw) && email.includes('@');

  return (
    <div
      style={{
        backgroundColor: primary,
        borderRadius: 5,
        width: '20vw',
        alignSelf: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 30,
        margin: 100,
        padding: 10,
        paddingTop: 25,
        paddingBottom: 25,
      }}
    >
      <input
        type='text'
        placeholder='Username'
        required
        style={inputStyle}
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
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
          backgroundColor: isEnabled() ? kaki : softKaki,
          color: black,
          padding: 7,
          borderRadius: 5,
          fontWeight: 'bold',
          paddingLeft: 13,
          paddingRight: 13,
        }}
        disabled={!isEnabled()}
        onClick={signUp}
      >
        Sign Up
      </button>
      <Link style={{ color: softGrey }} to='/signin'>
        Already have an account? Sign in
      </Link>
    </div>
  );
};
