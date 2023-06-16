import { getDatabase, onValue, ref, set, update } from 'firebase/database';
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

export const addItem = async (path: string, item: any) => {
  try {
    const result = update(ref(db, path), item);
    console.log('Result', result);
    return result;
  } catch (e) {
    console.error('Error adding document: ', e);
    throw e;
  }
};

export const getItems = async (path: string) => {
  try {
    const itemsRef = ref(db, path);
    onValue(itemsRef, snapshot => {
      const data = snapshot.val();
      console.log('data ', data);
      return data;
    });
  } catch (e) {
    console.error('Error getting stories: ', e);
    return [];
  }
};
