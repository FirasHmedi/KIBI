import { Grid, Typography } from '@mui/material';
import React from 'react';
import { primary, softGrey } from '../../styles/Style';
import { Tag } from '../../components/Tag';
import { ProfileItem } from './ProfileItem';
import { Story } from '../../utils/data';

interface Props {
  story: Story;
}

export const StoryItem = ({ story }: Props) => {
  return (
    <Grid
      item
      key={story.id}
      p={1.5}
      flexDirection='column'
      style={{
        backgroundColor: primary,
        color: softGrey,
        borderRadius: 5,
        display: 'flex',
        width: '20vw',
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
          fontSize: '1rem',
          userSelect: 'none',
          minHeight: '9rem',
        }}>
        {story.summary?.slice(0, 150)}
      </Typography>

      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-start',
          gap: 10,
        }}>
        {story.tags.map((tag: string) => (
          <Tag key={tag} tag={tag} />
        ))}
      </div>
    </Grid>
  );
};
