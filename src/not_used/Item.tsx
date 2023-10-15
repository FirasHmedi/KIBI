import { Grid, Typography } from '@mui/material';
import { primary, softGrey } from '../styles/Style';
import { ProfileItem } from './ProfileItem';

interface Props {
	story: any;
}

export const StoryItem = ({ story }: Props) => {
	return (
		<Grid
			item
			key={story.id}
			p={1}
			flexDirection='column'
			style={{
				backgroundColor: primary,
				color: softGrey,
				borderRadius: 5,
				display: 'flex',
				width: '19vw',
				justifyContent: 'space-between',
			}}>
			<ProfileItem name={story.wrName} />

			<Typography
				variant='h6'
				fontFamily={'Segoe UI'}
				fontWeight={'400'}
				style={{
					display: 'flex',
					textOverflow: 'ellipsis',
					wordWrap: 'break-word',
					overflow: 'hidden',
					fontSize: '0.91rem',
					userSelect: 'none',
					minHeight: '8rem',
					alignItems: 'center',
				}}>
				{story.summary?.slice(0, 150)}
			</Typography>
		</Grid>
	);
};
