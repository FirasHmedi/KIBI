import { useNavigate } from 'react-router-dom';
import { SINGUP_PATH } from '../utils/data';

export function SignUpButton() {
	const navigate = useNavigate();

	return (
		<div>
			<button style={{ fontWeight: 'bold' }} onClick={() => navigate(SINGUP_PATH)}>
				Sign up
			</button>
		</div>
	);
}
