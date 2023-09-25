import { useState } from 'react';
import Game from '../pages/game/Game';
import Home from '../pages/home/Home';
import { appStyle, greyBackground, violet } from '../styles/Style';
import { GAME_PATH, HOME_PATH, SIGNIN_PATH, SINGUP_PATH } from './data';
import MenuIcon from '@mui/icons-material/Menu';
import Sidebar from '../components/Sidebar';

const Layout = ({ children }: any) => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	return (
		<div style={{ ...appStyle, backgroundColor: greyBackground }}>
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
				<h4 style={{ paddingLeft: '1vw' }}>KIBI</h4>
			</div>
			<div style={{ display: 'flex', flexDirection: 'row' }}>
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
		element: <Layout></Layout>,
	},
	{
		path: SIGNIN_PATH,
		element: <Layout></Layout>,
	},
];
