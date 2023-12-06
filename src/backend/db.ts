import { get, onValue, ref, update } from 'firebase/database';
import { db } from '../firebase';
import { PlayerType } from '../utils/interface';

export const getBoardPath = (gameId: string) => 'games/' + gameId + '/board/';
export const getGamePath = (gameId: string) => 'games/' + gameId + '/';
export const getPlayerPath = (gameId: string, playerType: PlayerType) =>
	'games/' + gameId + `/${playerType}/`;
export const USERS_PATH = 'users/';

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
