import { get, onValue, ref, update } from 'firebase/database';
import short from 'short-uuid';
import { db } from '../firebase';
import { PLAYER_HASH_KEY, PLAYER_ID_KEY } from '../utils/data';
import { PlayerType } from '../utils/interface';
import { User } from './../utils/interface';

export const getBoardPath = (gameId: string) => 'games/' + gameId + '/board/';
export const getGamePath = (gameId: string) => 'games/' + gameId + '/';
export const getPlayerPath = (gameId: string, playerType: PlayerType) =>
	'games/' + gameId + `/${playerType}/`;
export const USERS_PATH = 'users/';

export const getUserById = async (id: string): Promise<User> => {
	const userRef = ref(db, `users/${id}`);
	const snapshot = await get(userRef);
	if (snapshot.exists()) {
		return snapshot.val() as User;
	}
	console.error('User does not exist');
	return {} as User;
};

export const getUserByUserName = async (userName: string): Promise<User> => {
	const usersRef = ref(db, `users`);
	const snapshot = await get(usersRef);
	if (snapshot.exists()) {
		const users: User[] = Object.values(snapshot?.val() ?? {});
		return users.find(user => user.userName === userName) as User;
	}
	console.error('User does not exist');
	return {} as User;
};

export const createUser = async (userName: string, hash: string) => {
	const userId = short.generate();

	const user = {
		id: userId,
		userName,
		hash,
		score: 1000,
		wins: 0,
		losses: 0,
	} as User;

	await setItem(USERS_PATH + userId, user);

	localStorage.setItem(PLAYER_ID_KEY, userId);
	localStorage.setItem(PLAYER_HASH_KEY, hash);

	return user;
};

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
		return null;
	}
};
