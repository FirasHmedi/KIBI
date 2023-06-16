import {  getDatabase, onValue, ref, set } from 'firebase/database';
import { db } from '../firebase';

export const STORIES = 'stories';
export const USERS = 'users';

const validateStory = (story: Partial<any>): boolean =>
  !!story.id &&
  !!story.content &&
  !!story.tags &&
  !!story.summary &&
  !!story.wrName &&
  !!story.wrId;

export const addItem = async (story: Partial<any>) => {
  try {
   const result = set(ref(db, 'users/' + 'id'), {
    test: 10
  });
    console.log('Result', result);
  } catch (e) {
    console.error('Error adding document: ', e);
    throw e;
  }
};

export const getItems = async () => {
  try {
    const itemsRef = ref(db, 'items/' + 'test');
    onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      console.log('data ', data);
    });
  } catch (e) {
    console.error('Error getting stories: ', e);
    return [];
  }
};
