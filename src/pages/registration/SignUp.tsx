import { ref, set } from 'firebase/database';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerWithEmailPsw, signUpWithGoogle } from '../../backend/auth';
import { USERS_PATH } from '../../backend/db';
import { auth, db } from '../../firebase';
import { buttonStyle, signInputStyle, signupContainerStyle, softGrey } from '../../styles/Style';
import { HOME_PATH } from '../../utils/data';
import { isNotEmpty } from '../../utils/helpers';

export const SignUp = () => {
	const navigate = useNavigate();
	const [username, setUsername] = useState('');
	const [showUserNameError, setShowUserNameError] = useState(false);
	const [email, setEmail] = useState('');
	const [psw, setPsw] = useState('');
	const [confirmPsw, setConfirmPsw] = useState('');

	const saveUserToDB = async (uid: string, email: string, username: string) => {
		try {
			const userRef = ref(db, USERS_PATH + uid);
			await set(userRef, {
				username: username,
				email: email,
			});
			return true;
		} catch (error) {
			console.error('Error saving user to database: ', error);
			return false;
		}
	};

	const signUpWithEmailAndPassword = async () => {
		try {
			if (!isNotEmpty(username)) {
				setShowUserNameError(true);
				return;
			}

			await registerWithEmailPsw(username, email, psw);
			const user = auth.currentUser;

			if (user) {
				await saveUserToDB(user.uid, email, username);
			} else {
				throw new Error('No user returned after normal signup');
			}

			navigate(HOME_PATH);
			return true;
		} catch (e) {
			console.log('error', e);
			return false;
		}
	};

	const registerWithGoogle = async () => {
		if (!isNotEmpty(username)) {
			setShowUserNameError(true);
			return;
		}

		try {
			const user = await signUpWithGoogle();
			if (user && user.email) {
				await saveUserToDB(user.uid, user.email, username);
			} else {
				throw new Error('No user returned after Google signup');
			}
			navigate(HOME_PATH);
			return true;
		} catch (e) {
			console.error('Error during Google registration:', e);
			return false;
		}
	};

	return (
		<div style={signupContainerStyle}>
			<input
				type='text'
				placeholder='Username'
				required
				style={signInputStyle}
				value={username}
				onChange={e => setUsername(e.target.value)}
			/>
			{showUserNameError && <h6 style={{ color: 'white' }}>Set a user name</h6>}
			<input
				type='text'
				placeholder='Email address'
				required
				style={signInputStyle}
				value={email}
				onChange={e => setEmail(e.target.value)}
			/>
			<input
				type='password'
				placeholder='Password'
				required
				style={signInputStyle}
				value={psw}
				onChange={e => setPsw(e.target.value)}
			/>
			<input
				type='password'
				placeholder='Repeat Password'
				required
				style={signInputStyle}
				value={confirmPsw}
				onChange={e => setConfirmPsw(e.target.value)}
			/>
			<button
				style={{
					...buttonStyle,
				}}
				onClick={() => signUpWithEmailAndPassword()}>
				Sign Up
			</button>
			<button style={buttonStyle} onClick={() => registerWithGoogle()}>
				Sign Up with Google
			</button>
			<Link style={{ color: softGrey }} to='/signin'>
				Already have an account? Sign in
			</Link>
		</div>
	);
};
