import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { IoIosMenu } from 'react-icons/io';
import { Navigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { SignUpButton } from '../components/SignUpButton';
import Cards from '../pages/cards/Cards';
import Game from '../pages/game/Game';
import Home from '../pages/home/Home';
import { Connect } from '../pages/registration/Connect';
import Walkthrough from '../pages/walkthrough/Walkthrough';
import { appStyle, centerStyle, violet } from '../styles/Style';
import { CARDS_PATH, CONNECT_PATH, GAME_PATH, HOME_PATH, WALKTHROUGH_PATH } from './data';
import { isNotEmpty, isUserConnected } from './helpers';
import { User } from './interface';

const Layout = ({ children }: any) => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [currentUser, setCurrentUser] = useState<User>();
	let location = useLocation();

	const setUser = async () => {
		const user = await isUserConnected();
		if (isNotEmpty(user.userName)) {
			console.log('user ', user);
			setCurrentUser(user);
			return;
		}
		setCurrentUser(undefined);
	};

	useEffect(() => {
		setUser();
	}, [location]);

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	/*const logOut = async () => await auth.signOut();

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged(async user => {
			if (user) {
				const username = user.displayName;
				setCurrentUser({ uid: user.uid, username: username });
			} else {
				setCurrentUser(null);
			}
		});

		return () => unsubscribe();
	}, [currentUser]);*/

	console.log(currentUser);

	return (
		<div style={appStyle}>
			<div
				style={{
					width: '100vw',
					color: violet,
					height: '4vh',
					display: 'flex',
					alignItems: 'center',
				}}>
				<button
					style={{ display: 'flex', alignItems: 'center', fontSize: '1.6em' }}
					onClick={toggleSidebar}>
					<IoIosMenu style={{ color: violet, paddingLeft: '1vw' }} />
				</button>
				<a href={'/'} style={{ color: violet }}>
					<h4 style={{ paddingLeft: '1vw', margin: 0 }}>KIBI</h4>
				</a>

				<div
					style={{
						marginLeft: 'auto',
						marginRight: '1vw',
					}}>
					{!isEmpty(currentUser?.userName) ? (
						<h5 style={{ fontWeight: 'bold', color: violet }}>{currentUser!.userName}</h5>
					) : (
						<SignUpButton />
					)}
				</div>
			</div>

			<div style={{ display: 'flex', flexDirection: 'row', overflow: 'hidden' }}>
				{isSidebarOpen && <Sidebar />}
				<div style={{ height: '94vh', width: isSidebarOpen ? '85vw' : '100vw' }}>{children}</div>
			</div>
		</div>
	);
};

export const routes = [
	{
		path: HOME_PATH,
		element: (
			<Layout>
				<Home />
			</Layout>
		),
	},
	{
		path: GAME_PATH,
		element: (
			<Layout>
				<Game />
			</Layout>
		),
	},
	{
		path: CONNECT_PATH,
		element: (
			<Layout>
				<div
					style={{
						...centerStyle,
						height: '100vh',
					}}>
					<Connect />
				</div>
			</Layout>
		),
	},
	{
		path: WALKTHROUGH_PATH,
		element: (
			<Layout>
				<Walkthrough />
			</Layout>
		),
	},
	{
		path: CARDS_PATH,
		element: (
			<Layout>
				<Cards />
			</Layout>
		),
	},
	{
		path: '*',
		element: <Navigate to={HOME_PATH} replace />,
	},
];

/*
	{
		path: SINGUP_PATH,
		element: (
			<Layout>
				<div
					style={{
						...centerStyle,
						height: '100vh',
					}}>
					<SignUp />
				</div>
			</Layout>
		),
	},
	{
		path: SIGNIN_PATH,
		element: (
			<Layout>
				<div
					style={{
						...centerStyle,
						height: '100vh',
					}}>
					<SignIn />
				</div>
			</Layout>
		),
	},
*/
