import { FirebaseApp, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import { getDatabase } from 'firebase/database';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAOskHYiGBo3Fu44OoxBYNI8obg1IMcIlU',
  authDomain: 'kibi-143dd.firebaseapp.com',
  databaseURL: 'https://kibi-143dd-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'kibi-143dd',
  storageBucket: 'kibi-143dd.appspot.com',
  messagingSenderId: '423811484583',
  appId: '1:423811484583:web:08e0fec3b92c0017d88482',
  measurementId: 'G-NM25PLZNZ3',
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
export const real_db = getDatabase();
