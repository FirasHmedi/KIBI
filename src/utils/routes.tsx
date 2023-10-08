import { useEffect, useState } from 'react';
import Game from '../pages/game/Game';
import Home from '../pages/home/Home';
import { appStyle, centerStyle, violet } from '../styles/Style';
import {CARDS_PATH, GAME_PATH, HOME_PATH, SIGNIN_PATH, SINGUP_PATH, WALKTHROUGH_PATH} from './data';
import MenuIcon from '@mui/icons-material/Menu';
import Sidebar from '../components/Sidebar';
import { SignIn } from '../pages/registration/SignIn';
import { SignUp } from '../pages/registration/SignUp';
import { auth, db } from '../firebase';
import { get, ref } from 'firebase/database';
import { SignUpButton } from '../components/SignUpButton';
import { useNavigate } from 'react-router-dom';
import Walkthrough from "../pages/walkthrough/Walkthrough";
import Cards from "../pages/cards/Cards";

const Layout = ({ children }: any) => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [currentUser, setCurrentUser] = useState<any>();
	const navigate = useNavigate();

	const getUsernameByUid = async (uid: string) => {
		const userRef = ref(db, `users/${uid}`);
		const snapshot = await get(userRef);
		if (snapshot.exists()) {
			return snapshot.val().username;
		} else {
			console.error('User does not exist');
			return null;
		}
	};

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	const logOut = async () => await auth.signOut();

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
	}, [currentUser]);

	return (
		<div style={appStyle}>
			<div
				style={{
					width: '100vw',
					color: violet,
					height: '6vh',
					display: 'flex',
					alignItems: 'center',
				}}>
				<button style={{ display: 'flex', alignItems: 'center' }} onClick={toggleSidebar}>
					<MenuIcon style={{ color: violet, paddingLeft: '1vw' }} />
				</button>
				<button onClick={() => navigate('/')}>
					<h4 style={{ paddingLeft: '1vw', margin: 0 }}>KIBI</h4>
				</button>

				<div style={{ marginLeft: 'auto', marginRight: '1vw', display: 'flex', gap: 10 }}>
					<button onClick={() => navigate(CARDS_PATH)}>
						<h4 style={{ paddingLeft: '1vw', margin: 0 }}>Cards</h4>
					</button>
					<button onClick={() => navigate(WALKTHROUGH_PATH)}>
						<h4 style={{ paddingLeft: '1vw', margin: 0 }}>Explanation</h4>
					</button>
					{currentUser ? (
						<button onClick={() => logOut()}>
							<h5 style={{ fontWeight: 'bold' }}>{currentUser.username}</h5>
						</button>
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
];
