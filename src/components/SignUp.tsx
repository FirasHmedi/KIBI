import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SINGUP_PATH } from '../utils/data';


export function UserSignUp() {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    if (!isAuthenticated) {
        return (
            <div>
                <button onClick={() => navigate(SINGUP_PATH)}>Sign up</button>
            </div>
        );
    }
}

