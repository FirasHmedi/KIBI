import { get, onValue, ref, update } from 'firebase/database';
import { db } from '../firebase';

export const setItem = async (path: string, item: any) => {
  try {
    const result = await update(ref(db, path), item);
    console.log('Result', result);
    return result;
  } catch (e) {
    console.error('Error adding item: ', e);
    throw e;
  }
};

export const getItemsOnce = async (path: string) => {
  try {
    const snapshot = await get(ref(db, path));
    console.log('snapshot ', snapshot);
    if (snapshot.exists()) {
      return snapshot.val();
    }
  } catch (e) {
    console.error('Error getting items: ', e);
    return [];
  }
};

export const subscribeToItems = async (path: string, setItemsState: (item: any) => void) => {
  try {
    onValue(ref(db, path), snapshot => {
      console.log('snapshot', snapshot);
      const data = snapshot.val();
      console.log('data ', data);
      setItemsState(data);
    });
  } catch (e) {
    console.error('Error getting items: ', e);
    return [];
  }
};
