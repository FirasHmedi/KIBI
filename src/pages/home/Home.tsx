import React, { useEffect, useState } from 'react';
import { Stories } from './Stories';
import { AddStory } from '../addstory/AddStory';
import { AddStoryForm } from '../addstory/AddStoryForm';
import { black } from '../../styles/Style';
import { User } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { SINGUP_PATH } from '../../utils/data';

function Home({ user }: { user?: User }) {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const openForm = () => (!!user ? setOpen(true) : navigate(SINGUP_PATH));
  const closeForm = () => setOpen(false);

  return (
    <div style={{ backgroundColor: black }}>
      <div onClick={openForm}>
        <AddStory />
      </div>
      <Stories />
      <AddStoryForm open={open} handleClose={closeForm} />
    </div>
  );
}

export default Home;
