import { Link } from 'react-router-dom';
import { headerStyle, primaryBlue } from '../styles/Style';
import { HOME_PATH } from '../utils/data';

export const Header = ({ loading }: { loading: boolean }) => {
	return (
		<div style={headerStyle}>
			<Link
				style={{
					textDecoration: 'none',
					width: '2vw',
					fontWeight: 'bold',
					color: primaryBlue,
					fontSize: '1vw',
				}}
				to={HOME_PATH}>
				KIBI
			</Link>
		</div>
	);
};
