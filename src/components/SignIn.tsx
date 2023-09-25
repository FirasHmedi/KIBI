import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SignIn } from '../not_used/registration/SignIn';
import { SIGNIN_PATH } from '../utils/data';

export function UserSignIn() {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    if (!isAuthenticated) {
        return (
            <div>
                <button onClick={() => navigate(SIGNIN_PATH)}>Sign In</button>
            </div>
        );
    }
}