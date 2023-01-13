import { Typography } from '@mui/material';
import { Variant } from '@mui/material/styles/createTypography';
import React from 'react';
import { softGrey } from '../../styles/Style';

interface Props {
  name: string;
  variant?: Variant;
}

export const ProfileItem = ({ name, variant = 'subtitle2' }: Props) => {
  return (
    <div style={{ display: 'flex' }}>
      <Typography
        style={{ userSelect: 'none' }}
        variant={variant}
        fontFamily={'Segoe UI'}
        fontWeight={'bold'}
        color={softGrey}>
        {name}
      </Typography>
    </div>
  );
};
