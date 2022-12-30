import { Box, Modal, Typography } from '@mui/material';
import React from 'react';
import { Tag } from '../../components/Tag';
import { primary, softGrey } from '../../styles/Style';
import { Story } from '../../utils/data';
import { ProfileItem } from '../home/ProfileItem';

interface Props {
  story: Story;
  open: boolean;
  handleClose: () => void;
}

export const StoryModal = ({ story, open, handleClose }: Props) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        style={{
          outline: 'none',
          backgroundColor: primary,
          color: softGrey,
          borderRadius: 5,
          display: 'flex',
          width: '90%',
          height: '90%',
          flexDirection: 'column',
          position: 'absolute',
          top: '5%',
          left: '5%',
          overflowY: 'auto',
        }}
      >
        <Box
          style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
          p={3}
          pl={4}
          pr={4}
        >
          <ProfileItem name={story.wrName} variant={'h6'} />
          <div style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
            {story.tags.map((tag: string) => (
              <Tag key={tag} tag={tag} />
            ))}
          </div>
        </Box>

        <div style={{ flex: 5 }}>
          <Typography
            variant='subtitle1'
            fontFamily={'Segoe UI'}
            fontWeight={'400'}
            fontSize={'1.3vw'}
            lineHeight={1.8}
            p={10}
            pt={0}
            pb={3}
          >
            {story.content}
          </Typography>
        </div>
      </Box>
    </Modal>
  );
};
