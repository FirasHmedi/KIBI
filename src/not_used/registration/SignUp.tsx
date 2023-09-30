import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  black,
  buttonStyle,
  centerStyle,
  primary,
  signupContainerStyle,
  softGrey,
} from '../../styles/Style';
import { isNotEmpty } from '../../utils/helpers';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { HOME_PATH } from '../../utils/data';
import { registerWithEmailPsw, signUpWithGoogle } from '../auth';
import { getDatabase, ref, set } from 'firebase/database';
import { auth, real_db } from '../../firebase';
import { result } from 'lodash';


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

  //  save the user to the realtime database
  const saveUserToDatabase = async (uid: string, email: string, username: string) => {
    try {
      const userRef = ref(real_db, 'users/' + uid); // 'users' is the name of the node where you want to store user data
      await set(userRef, {
        username: username,
        email: email
      });
      console.log('User saved successfully');
    } catch (error) {
      console.error('Error saving user to database: ', error);
    }
  };
  //register with email and password
  const signUp = async () => {
    if (!isEnabled) return;

    try {
        const result = await registerWithEmailPsw(username, email, psw);
        
        const user = auth.currentUser;

        if (user) {
            console.log(user.uid);
            await saveUserToDatabase(user.uid, email, username);
        } else {
            console.log("nothing");
        }

        navigate(HOME_PATH);
        return true;
    } catch (e) {
        console.log('error', e);
    }
};

  
//register with google
const registerWithGoogle = async () => {
  if (!isNotEmpty(username)) {
    throw new Error("Username is empty");
  }

  try {
    const user = await signUpWithGoogle();

    if (user && user.email) {
      await saveUserToDatabase(user.uid, user.email, username);
    } else {
      console.error("No user returned after Google signup");
    }

    navigate(HOME_PATH);
    return true;
  } catch (e) {
    console.error('Error during Google registration:', e);
  }
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
      onChange={e => setUsername(e.target.value)}
    />
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
    <input
      type='password'
      placeholder='Repeat Password'
      required
      style={inputStyle}
      value={confirmPsw}
      onChange={e => setConfirmPsw(e.target.value)}
    />
    <button
      style={{
        ...buttonStyle,
      }}
      //disabled={isEnabled()}
      onClick={() => signUp()}
      >
      Sign Up
    </button>
    <button style={buttonStyle}
    //disabled={isEnabled()} 
    onClick={() => registerWithGoogle()}
    >
      Sign Up with Google
    </button>
    <Link style={{ color: softGrey }} to='/signin'>
      Already have an account? Sign in
    </Link>
  </div>
);
    }