import { useNavigate } from 'react-router-dom';
import { CONNECT_PATH } from '../utils/data';

export function SignUpButton() {
	const navigate = useNavigate();

	return (
		<div>
			<button style={{ fontWeight: 'bold' }} onClick={() => navigate(CONNECT_PATH)}>
				Connect
			</button>
		</div>
	);
}
