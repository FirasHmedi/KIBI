import { Typography } from '@mui/material';
import { Variant } from '@mui/material/styles/createTypography';
import { softGrey } from '../styles/Style';

interface Props {
  name: string;
  variant?: Variant;
}

export const ProfileItem = ({ name, variant = 'h6' }: Props) => {
  return (
    <div style={{ display: 'flex' }}>
      <Typography
        style={{
          userSelect: 'none',
          fontSize: '0.9rem',
        }}
        variant={variant}
        fontFamily={'Segoe UI'}
        fontWeight={'bold'}
        color={softGrey}>
        {name}
      </Typography>
    </div>
  );
};
