import React, { useState } from 'react';
import { Stories } from './Stories';
import { AddStory } from '../addstory/AddStory';
import { AddStoryForm } from '../addstory/AddStoryForm';
import Snackbar from '@mui/material/Snackbar';

function Home() {
  const [open, setOpen] = useState(false);
  const openForm = () => setOpen(true);
  const [isSnackbar, setIsSnackbar] = useState(false);
  //const openSnackbar = () => setIsSnackbar(true);
  const closeForm = () => setOpen(false);
  return (
    <>
      <div onClick={openForm}>
        <AddStory />
      </div>
      <Stories />
      <AddStoryForm
        open={open}
        handleClose={closeForm}
        openSnackbar={() => {}}
      />
      {/* <Snackbar
          open={false}
          autoHideDuration={2000}
          message={'Story submitted for review!'}
        /> */}
    </>
  );
}

export default Home;
