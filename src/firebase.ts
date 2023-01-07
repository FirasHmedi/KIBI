import { FirebaseApp, initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDDg52B5IZ4dHiqdkO3R5J1q3q-t3z_er8',
  authDomain: 'kawa-58848.firebaseapp.com',
  projectId: 'kawa-58848',
  storageBucket: 'kawa-58848.appspot.com',
  messagingSenderId: '883525077090',
  appId: '1:883525077090:web:c7bc21bca0b8548fee693b',
  measurementId: 'G-6FX2GG20FJ',
};

let appInstance: FirebaseApp;

// Initialize Firebase
export const getApp = () => {
  if (!appInstance) {
    appInstance = initializeApp(firebaseConfig);
  }
  return appInstance;
};

export const db = getFirestore(getApp());
export const auth = getAuth(getApp());
