import { useNavigate } from 'react-router-dom';
import { SIGNIN_PATH } from '../utils/data';

export function SignInButton() {
	const navigate = useNavigate();
	return (
		<div>
			<button style={{ fontWeight: 'bold' }} onClick={() => navigate(SIGNIN_PATH)}>
				Sign In
			</button>
		</div>
	);
}
