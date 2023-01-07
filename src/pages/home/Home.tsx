import React, { useEffect, useState } from 'react';
import { Stories } from './Stories';
import { AddStory } from '../addstory/AddStory';
import { AddStoryForm } from '../addstory/AddStoryForm';
import { auth } from '../../firebase';
import { black } from '../../styles/Style';

function Home() {
  const [open, setOpen] = useState(false);
  const openForm = () => setOpen(true);
  const [isSnackbar, setIsSnackbar] = useState(false);
  //const openSnackbar = () => setIsSnackbar(true);

  const closeForm = () => setOpen(false);

  useEffect(() => {
    console.log(auth);
    return () => {};
  }, []);

  return (
    <div style={{backgroundColor: black}} >
      <div onClick={openForm}>
        <AddStory />
      </div>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div style={{ width: '10vw'}}></div>
        <Stories />
      </div>
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
    </div>
  );
}

export default Home;
