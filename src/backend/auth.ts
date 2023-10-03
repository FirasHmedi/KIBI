import {
	GoogleAuthProvider,
	signInWithEmailAndPassword,
	signInWithPopup,
	createUserWithEmailAndPassword,
	updateProfile,
} from 'firebase/auth';
import { auth } from '../firebase';

export const registerWithEmailPsw = async (username: string, email: string, password: string) => {
	try {
		const userCredential = await createUserWithEmailAndPassword(auth, email, password);
		await updateProfile(userCredential.user, { displayName: username });
		return true;
	} catch (e) {
		console.log('error registering', e);
		return false;
	}
};

export const signUpWithGoogle = async () => {
	try {
		const provider = new GoogleAuthProvider();
		const result = await signInWithPopup(auth, provider);
		if (!!result?.user) {
			return result.user; // This is the user's data from Google
		}
		throw new Error('No user from Google popup result');
	} catch (error) {
		console.error('Error signing up with Google: ', error);
		return false;
	}
};

//this function is not used but it still there in case we use firestore
/*
const addUser = async (uid: string, username: string, email: string) => {
  try {
    const docRef = await setDoc(doc(db, "users", uid), { username, email });
    return docRef;
  } catch (e) {vconsole.log('error ', e); }
}; 
*/

export const loginWithEmailPsw = async (email: string, psw: string) => {
	const userCredential = await signInWithEmailAndPassword(auth, email, psw);
	return userCredential.user.uid;
};

export const loginWithGoogle = async () => {
	try {
		const provider = new GoogleAuthProvider();
		const result = await signInWithPopup(auth, provider);
		// const credential = GoogleAuthProvider.credentialFromResult(result);
		const user = result.user;
		return user;
	} catch (e) {
		console.error(e);
		return false;
	}
};
