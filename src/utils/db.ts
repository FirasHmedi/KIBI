import { addDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../main';

import { Story } from './data';

const STORIES = 'stories';

const validateStory = (story: Partial<Story>): boolean =>
  !!story.id &&
  !!story.content &&
  !!story.tags &&
  !!story.summary &&
  !!story.wrName &&
  !!story.wrId;

export const addStory = async (story: Partial<Story>) => {
  try {
    const docRef = await addDoc(collection(db, STORIES), story);
    console.log('Document written with ID: ', docRef.id);
  } catch (e) {
    console.error('Error adding document: ', e);
    throw e;
  }
};

export const getStories = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, STORIES));
    return querySnapshot.docs
      .map((doc) => ({ ...doc.data(), id: doc.id } as Partial<Story>))
      .filter((story: Partial<Story>) => validateStory(story)) as Story[];
  } catch (e) {
    console.error('Error getting stories: ', e);
    return [];
  }
};
