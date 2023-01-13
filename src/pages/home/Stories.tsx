import { Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { black, kaki } from '../../styles/Style';
import { Story } from '../../utils/data';
import { getStories } from '../../utils/db';
import { StoryModal } from '../story/StoryModal';
import { StoryItem } from './StoryItem';

interface Props {
  stories: Story[];
}

export const Stories = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [open, setOpen] = useState(false);
  const [openedStory, setOpenedStory] = useState<Story>();

  useEffect(() => {
    async function waitStories() {
      const _stories = (await getStories()) ?? [];
      setStories(_stories);
    }
    waitStories();
  }, []);

  const handleClose = () => setOpen(false);
  const openStory = (story: Story) => {
    setOpenedStory(story);
    setOpen(true);
  };

  const TrendStories = () => (
    <div
      style={{
        padding: 5,
      }}>
      <h2 style={{ color: kaki, fontWeight: 'bold' }}>Trends</h2>
      <Grid container pt={3} columnGap={6} style={{}}>
        {stories.map(story => (
          <div key={story.id} onClick={() => openStory(story)}>
            <StoryItem story={story} />
          </div>
        ))}
      </Grid>
    </div>
  );

  return (
    <div>
      <div style={{ height: '3vh' }} />
      <TrendStories />
      <div style={{ height: '3vh' }} />
      <Grid container pt={3} columnGap={6} style={{}}>
        {stories.map(story => (
          <div key={story.id} onClick={() => openStory(story)}>
            <StoryItem story={story} />
          </div>
        ))}
      </Grid>
      {openedStory && (
        <StoryModal story={openedStory} open={open} handleClose={handleClose} />
      )}
    </div>
  );
};
