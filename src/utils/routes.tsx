import { useEffect, useState } from 'react';
import Game from '../pages/game/Game';
import Home from '../pages/home/Home';
import { appStyle, greyBackground, violet } from '../styles/Style';
import { GAME_PATH, HOME_PATH, SIGNIN_PATH, SINGUP_PATH,USER_HOME_PATH } from './data';
import MenuIcon from '@mui/icons-material/Menu';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import { SignIn } from '../not_used/registration/SignIn';
import { UserSignUp } from '../components/SignUp';
import { UserSignIn } from '../components/SignIn';
import { SignUp } from '../not_used/registration/SignUp';
import { auth } from '../firebase';


const Layout = ({ children }: any) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                setCurrentUser(user);
            } else {
                setCurrentUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div style={appStyle}>
            <div style={{
                width: '100vw',
                backgroundColor: violet,
                color: 'white',
                height: '6vh',
                display: 'flex',
                alignItems: 'center',
            }}>
                <button onClick={toggleSidebar}>
                    <MenuIcon style={{ color: 'white', paddingLeft: '1vw' }} />
                </button>
                <h4 style={{ paddingLeft: '1vw', margin: 0 }}>KIBI</h4>
                <div style={{ marginLeft: 'auto', marginRight: '10px', display: 'flex', gap: '10px' }}>
                    {currentUser ? (
                        <>
                            <span>UID: {currentUser.uuid}</span>
                            <button onClick={() => auth.signOut()}>Logout</button>
                        </>
                    ) : (
                        <UserSignUp />
                    )}
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'row', overflow: 'hidden', backgroundColor: greyBackground }}>
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
		element: <Layout>
			<div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh', // Center vertically within the viewport
        }}> <SignUp /> </div>
	
		</Layout>,
	},
	{
		path: SIGNIN_PATH,
		element: <Layout 
		> 
		<div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh', // Center vertically within the viewport
        }}> <SignIn /> </div>
	
				
			 </Layout>,
	},
	


];
