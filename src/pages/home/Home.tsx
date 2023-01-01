import React, { useEffect, useState } from 'react';
import { Stories } from './Stories';
import { AddStory } from '../addstory/AddStory';
import { AddStoryForm } from '../addstory/AddStoryForm';
import { auth } from '../../main';

function Home() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState({});
  const openForm = () => setOpen(true);
  const [isSnackbar, setIsSnackbar] = useState(false);
  //const openSnackbar = () => setIsSnackbar(true);
  
  const closeForm = () => setOpen(false);

  useEffect(() => {
    console.log(auth)
    return () => {};
  }, []);

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
