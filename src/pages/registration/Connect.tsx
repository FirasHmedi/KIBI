import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { createUser, getItemsOnce, getUserByUserName } from '../../backend/db';
import { buttonStyle, flexColumnStyle, homeButtonsStyle, violet } from '../../styles/Style';
import { GAMES_PATH, PLAYER_HASH_KEY, PLAYER_ID_KEY } from '../../utils/data';
import { getHash, isUserConnected, showToast } from '../../utils/helpers';
import { JoinType, PlayerType } from '../../utils/interface';
import { joinGameAsPlayerTwoImpl, joinGameAsSpectatorImpl } from '../../utils/join';

export const Connect = () => {
	const location = useLocation();
	const [searchParams, setSearchParams] = useSearchParams();
	const { gameId, playerType, joinType } = location?.state ?? {};
	const navigate = useNavigate();

	const [userName, setUserName] = useState('');
	const [psw, setPsw] = useState('');
	const [loading, setLoading] = useState(true);

	const isConnectEnabled = userName?.length > 2 && psw?.length > 2;

	const connect = async () => {
		try {
			const authHash = getHash(userName + ':' + psw);
			let isAuth = false;
			let user = await getUserByUserName(userName);

			if (isEmpty(user)) {
				user = await createUser(userName, authHash);
				isAuth = true;
			}

			if (user.hash === authHash) {
				localStorage.setItem(PLAYER_ID_KEY, user.id);
				localStorage.setItem(PLAYER_HASH_KEY, authHash);
				isAuth = true;
			}
			console.log({ isAuth, gameId, playerType, joinType, user });

			if (!isAuth) {
				showToast('Username is taken or password is incorrect', 1500);
			}

			const gameIdFromParam = searchParams.get('gameId');
			const { INITIAL_HP, ROUND_DURATION } = (await getItemsOnce('constants')) ?? {};

			if (gameIdFromParam) {
				await joinGameAsPlayerTwoImpl(gameIdFromParam, INITIAL_HP, user, ROUND_DURATION, navigate);
				return;
			}

			if (gameId && playerType === PlayerType.TWO) {
				if (joinType === JoinType.TWO) {
					await joinGameAsPlayerTwoImpl(gameId, INITIAL_HP, user, ROUND_DURATION, navigate);
					return;
				}
			}

			navigate('/');
		} catch (error) {}
	};

	const handleRedirection = async () => {
		const user = await isUserConnected();
		const gameIdFromParam = searchParams.get('gameId');

		if (gameIdFromParam) {
			const gameData = await getItemsOnce(GAMES_PATH + gameIdFromParam);
			if (!gameData) {
				toast.error('Game does not exist.', {
					position: toast.POSITION.TOP_RIGHT,
				});
				return;
			}

			const constants = await getItemsOnce('constants');

			if (gameData.two) {
				await joinGameAsSpectatorImpl(gameIdFromParam, constants.ROUND_DURATION, navigate);
				return;
			}

			if (isEmpty(user?.id)) {
				setLoading(false);
				return;
			}

			await joinGameAsPlayerTwoImpl(
				gameIdFromParam,
				constants.INITIAL_HP,
				user,
				constants.ROUND_DURATION,
				navigate,
			);
			return;
		}
		setLoading(false);
		if (!isEmpty(user)) {
			return navigate('/');
		}
	};

	useEffect(() => {
		handleRedirection();
	}, []);

	if (loading) return <></>;

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
