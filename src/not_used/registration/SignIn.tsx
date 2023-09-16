import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isNotEmpty } from '../../utils/helpers';
import { loginWithEmailPsw, loginWithGoogle } from '../auth';

const inputStyle = {
	height: '3vh',
	borderRadius: 5,
	padding: 3,
	width: '15vw',
	borderWidth: 0,
};

export const SignIn = () => {
	const navigate = useNavigate();

	const [email, setEmail] = useState('');
	const [psw, setPsw] = useState('');

	const signIn = () => {
		loginWithEmailPsw(email, psw);
		navigate('/');
	};

	//signInWithGoogle
	const signInWithGoogle = () => {
		loginWithGoogle();
		navigate('/');
	};

	const isEnabled = () => isNotEmpty(psw) && email.includes('@');

	/* return (
    <div style={signinContainerStyle}>
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
        style={{
          color: black,
          padding: 7,
          borderRadius: 5,
          fontWeight: 'bold',
        }}
        disabled={!isEnabled()}
        onClick={() => signIn()}>
        Sign In
      </button>
      <button
        style={{
          backgroundColor: isEnabled() ? kaki : softKaki,
          color: black,
          padding: 7,
          borderRadius: 5,
          fontWeight: 'bold',
        }}
        disabled={!isEnabled()}
        onClick={() => signInWithGoogle()}>
        Sign In with Google
      </button>
      <Link style={{ color: softGrey }} to={SINGUP_PATH}>
        Want to register? Sign up
      </Link>
    </div>
  ); */
};

/*
const ElementCard = ({ loadNb = 0 }: any) => {
	const disableUsage = loadNb !== 3;
	return (
		<div
			style={{
				...deckSlotStyle,
				justifyContent: 'center',
				flexShrink: 0,
				borderColor: violet,
				flex: 1,
			}}>
			<div style={{ backgroundColor: disableUsage ? 'grey' : violet, width: '100%', flex: 1 }}> </div>
			<div
				style={{
					backgroundColor: loadNb >= 2 ? violet : 'grey',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					width: '100%',
					flex: 1,
				}}>
				{disableUsage ? <h5>Element loading</h5> : <h5>Element ready</h5>}
			</div>
			<div style={{ flex: 1, backgroundColor: loadNb >= 1 ? violet : 'grey', width: '100%' }}> </div>
		</div>
	);
};
*/
