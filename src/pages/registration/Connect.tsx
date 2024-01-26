import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { createUser, getUserByUserName } from '../../backend/db';
import { buttonStyle, flexColumnStyle, homeButtonsStyle, violet } from '../../styles/Style';
import { PLAYER_HASH_KEY, PLAYER_ID_KEY } from '../../utils/data';
import { getHash, isUserConnected, showToast } from '../../utils/helpers';

export const Connect = () => {
	const navigate = useNavigate();

	const [userName, setUserName] = useState('');
	const [psw, setPsw] = useState('');
	const [loading, setLoading] = useState(true);

	const isConnectEnabled = userName?.length > 2 && psw?.length > 2;

	const connect = async () => {
		try {
			const hash = getHash(userName + ':' + psw);

			const user = await getUserByUserName(userName);

			if (isEmpty(user)) {
				await createUser(userName, hash);
				return navigate('/');
			}

			if (user.hash === hash) {
				localStorage.setItem(PLAYER_ID_KEY, user.id);
				localStorage.setItem(PLAYER_HASH_KEY, hash);
				return navigate('/');
			}

			showToast('Username is taken or password is incorrect', 1500);
		} catch (error) {}
	};

	const redirectToHome = async () => {
		const user = await isUserConnected();
		setLoading(false);
		if (!isEmpty(user)) {
			return navigate('/');
		}
	};

	useEffect(() => {
		redirectToHome();
	}, []);

	if (loading) {
		return <></>;
	}

	return (
		<>
			<ToastContainer />
			<div style={{ ...flexColumnStyle, gap: 10 }}>
				<input
					type='text'
					placeholder='Username'
					required
					style={{
						padding: 10,
						margin: 10,
						width: '14vw',
						height: '2vh',
						borderRadius: 5,
						borderWidth: 3,
						borderColor: violet,
						fontSize: '1rem',
						color: violet,
					}}
					value={userName}
					onChange={e => setUserName(e.target.value)}
				/>
				<input
					type='password'
					placeholder='Password'
					required
					style={{
						padding: 10,
						margin: 10,
						width: '14vw',
						height: '2vh',
						borderRadius: 5,
						borderWidth: 3,
						borderColor: violet,
						fontSize: '1rem',
						color: violet,
					}}
					value={psw}
					onChange={e => setPsw(e.target.value)}
				/>
				<button
					style={{ ...buttonStyle, ...homeButtonsStyle, fontSize: '1.2em' }}
					disabled={!isConnectEnabled}
					onClick={() => connect()}>
					CONNECT / REGISTER
				</button>
			</div>
		</>
	);
};
