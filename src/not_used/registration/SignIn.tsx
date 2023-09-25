import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isNotEmpty } from '../../utils/helpers';
import { loginWithEmailPsw, loginWithGoogle } from '../auth';
import { black, buttonStyle, signinContainerStyle, softGrey } from '../../styles/Style';
import { Link } from 'react-router-dom';
import { SINGUP_PATH } from '../../utils/data';



const inputStyle = {
	height: '3vh',
	borderRadius: 5,
	padding: 3,
	width: '15vw',
	borderWidth: 0,
};
function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}
export const SignIn = () => {
	const navigate = useNavigate();

	const [email, setEmail] = useState('');
	const [psw, setPsw] = useState('');
//sign in with email and password

	const signIn = async () => {
		loginWithEmailPsw(email, psw);
    await delay(2000)
		navigate('/');
	};
//signInWithGoogle
const signInWithGoogle = async () => {
  await loginWithGoogle();
  navigate('/');
  
};

const isEnabled = () => isNotEmpty(psw) && email.includes('@');

return (
<div style={signinContainerStyle} >
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
        style={buttonStyle}
        disabled={!isEnabled()}
        onClick={() => signIn()}>
        Sign In
      </button>
      <button
        style={buttonStyle}
        disabled={isEnabled()}
        onClick={() => signInWithGoogle()}>
        Sign In with Google
      </button>
      <Link style={{ color: softGrey }} to={SINGUP_PATH}>
        Want to register? Sign up
      </Link>
    </div>
  ); 
};