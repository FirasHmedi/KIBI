import { FirebaseError } from '@firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
  signOut,
} from 'firebase/auth';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { USERS } from './db';

export const registerWithEmailPsw = async (
  username: string,
  email: string,
  password: string
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await updateProfile(userCredential.user, { displayName: username });
    await addUser(userCredential.user.uid, username, email);
    return true;
  } catch (e) {
    console.log('error registering', e);
  }
};

export const loginWithGoogle = async (username: string) => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const user = result.user;
    await updateProfile(user, { displayName: username });
    if (user.email) await addUser(user.uid, username, user.email);
    return true;
  } catch (e) {
    console.log('error registering', e);
    if (e instanceof FirebaseError) {
      const errorCode = e.code;
      const errorMessage = e.message;
      const email = e.customData?.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(e);
    }
    // ...
    return false;
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
    return true;
  } catch (e) {
    console.log('error registering', e);
  }
};

const addUser = async (uid: string, username: string, email: string) => {
  try {
    const docRef = await setDoc(doc(db, USERS, uid), {
      username,
      email,
    });
    return docRef;
  } catch (e) {
    console.log('error ', e);
  }
};

export const loginWithEmailPsw = (email: string, password: string) => {
  signInWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      // Signed in
      const user = userCredential.user;
      // ...
    })
    .catch(error => {
      console.log('error logging in', error);
    });
};
