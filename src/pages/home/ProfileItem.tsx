import { Typography } from '@mui/material';
import { Variant } from '@mui/material/styles/createTypography';
import React from 'react';
import { kaki } from '../../styles/Style';

interface Props {
  name: string;
  variant?: Variant;
}

export const ProfileItem = ({ name, variant = 'subtitle1' }: Props) => {
  return (
    <div style={{ display: 'flex' }}>
      <Typography
        variant={variant}
        fontFamily={'Segoe UI'}
        fontWeight={'bold'}
        color={kaki}
      >
        {name}
      </Typography>
    </div>
  );
};
