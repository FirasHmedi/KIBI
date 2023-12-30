import { violet } from '../styles/Style';
import { isGameFinished } from '../utils/helpers';

const GameFinished = ({ status, winner }: { status: string; winner?: string }) => {
	return (
		<div className='game-status'>
			{isGameFinished(status) && (
				<div>
					<h2 style={{ color: violet }}>Game Finished</h2>
					<br />
					<h2 style={{ color: violet }}> {winner?.toUpperCase()} won</h2>
				</div>
			)}
		</div>
	);
};

export default GameFinished;
