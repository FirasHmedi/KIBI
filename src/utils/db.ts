import { get, onValue, ref, update } from 'firebase/database';
import { db } from '../firebase';
import { PlayerType } from './interface';

export const getBoardPath = (roomId: string) => 'rooms/' + roomId + '/board/';
export const getRoomPath = (roomId: string) => 'rooms/' + roomId + '/';
export const getPlayerPath = (roomId: string, playerType: PlayerType) => 'rooms/' + roomId + `/${playerType}/`;

export const setItem = async (path: string, item: any) => {
	try {
		const result = await update(ref(db, path), item);
		return result;
	} catch (e) {
		console.error('Error adding item: ', e);
		throw e;
	}
};

export const getItemsOnce = async (path: string) => {
	try {
		const snapshot = await get(ref(db, path));
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
			const data = snapshot.val();
			setItemsState(data);
		});
	} catch (e) {
		console.error('Error getting items: ', e);
		return [];
	}
};
