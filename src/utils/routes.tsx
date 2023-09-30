import { useEffect, useState } from 'react';
import Game from '../pages/game/Game';
import Home from '../pages/home/Home';
import { appStyle, greyBackground, violet } from '../styles/Style';
import { GAME_PATH, HOME_PATH, SIGNIN_PATH, SINGUP_PATH } from './data';
import MenuIcon from '@mui/icons-material/Menu';
import Sidebar from '../components/Sidebar';
import { SignIn } from '../not_used/registration/SignIn';
import { UserSignUp } from '../components/SignUp';
import { SignUp } from '../not_used/registration/SignUp';
import { auth, real_db } from '../firebase';
import { get, ref } from 'firebase/database';


const Layout = ({ children }: any) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>();
    const getUsernameByUid = async (uid: string) => {
        
        const userRef = ref(real_db, `users/${uid}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          return snapshot.val().username;
        } else {
          console.error("User does not exist");
          return null;
        }
      };

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
                            <span>{currentUser.username}</span>
                            
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
