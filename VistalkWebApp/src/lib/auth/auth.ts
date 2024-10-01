import type { Cookies } from '@sveltejs/kit';
import CookieStateStore from './cookieStateStore';
import type { WebStorageStateStore } from 'oidc-client-ts';
import { getLoggedInUser, getUser, getUserFromLocalStorage, oidcClient, saveTokenToLocalStorage, signIn } from './oidcService';
import { accessToken, isLocal, loggedInUser, shortcuts } from '$lib/store';
import { getUserSetting } from '$lib/settings';
import { getMyIP } from '$lib/whoami';
import { browser } from '$app/environment';
import type { LoggedInUser } from '../../types/types';

export async function initAuth(cookies?: Cookies, refreshIfExpired: boolean = true) {
	if (cookies) {
		const cookieStore = new CookieStateStore(cookies);
		const settings = oidcClient.settings as { userStore: WebStorageStateStore };
		settings.userStore = cookieStore as unknown as WebStorageStateStore;
	}

	let user = await getUserFromLocalStorage();

	accessToken.set(user?.token || undefined);

	const decodedUser = await getLoggedInUser();
	loggedInUser.set(decodedUser);
}

