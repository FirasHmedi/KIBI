import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isNotEmpty } from '../../utils/helpers';
import { loginWithEmailPsw, loginWithGoogle } from '../../backend/auth';
import { buttonStyle, signInputStyle, signinContainerStyle, softGrey } from '../../styles/Style';
import { Link } from 'react-router-dom';
import { HOME_PATH, SINGUP_PATH } from '../../utils/data';

export const SignIn = () => {
	const navigate = useNavigate();

	const [email, setEmail] = useState('');
	const [psw, setPsw] = useState('');

	const isSignEnabled = isNotEmpty(psw) && email.includes('@');

	const signIn = async () => {
		try {
			const uid = await loginWithEmailPsw(email, psw);
			navigate(HOME_PATH);
			return uid;
		} catch (error) {
			console.error('Error signing in with email and password:', error);
			return false;
		}
	};

	const signInWithGoogle = async () => {
		try {
			const uid = await loginWithGoogle();
			navigate(HOME_PATH);
			return uid;
		} catch (error) {
			console.error('Error signing in with Google:', error);
		}
	};

	return (
		<div style={signinContainerStyle}>
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
			<button style={buttonStyle} disabled={!isSignEnabled} onClick={() => signIn()}>
				Sign In
			</button>
			<button style={buttonStyle} disabled={isSignEnabled} onClick={() => signInWithGoogle()}>
				Sign In with Google
			</button>
			<Link style={{ color: softGrey }} to={SINGUP_PATH}>
				Want to register? Sign up
			</Link>
		</div>
	);
};
