import type { Cookies } from '@sveltejs/kit';
import CookieStateStore from './cookieStateStore';
import type { WebStorageStateStore } from 'oidc-client-ts';
import { getLoggedInUser, getUser, oidcClient, signIn } from './oidcService';
import { accessToken, isLocal, loggedInUser, shortcuts } from '$lib/store';
import { getUserSetting } from '$lib/settings';
import { getMyIP } from '$lib/whoami';
import { browser } from '$app/environment';
import type { LoggedInUser } from '../../types/types';

export async function initAuth(cookies?: Cookies, refreshIfExpired: boolean = true) {
	if (cookies) {
		// Set cookies on server-side
		const cookieStore = new CookieStateStore(cookies);
		const settings = oidcClient.settings as { userStore: WebStorageStateStore };
		settings.userStore = cookieStore as unknown as WebStorageStateStore;
	}

	//todo: refactor this it always expire
	// Fetch logged in user & access token
	let user = await getUser();
	// if (user && user.expires_at && user.expires_at < Math.floor(Date.now() / 1000)) {
	// 	// Token expired - for now, just clear token and make user sign in again
	// 	// TODO: Refresh token
	// 	console.log('Token expired', user.expires_at, Math.floor(Date.now() / 1000));
	// 	if (browser && refreshIfExpired) {
	// 		await signIn();
	// 	}
	// 	oidcClient.removeUser();
	// 	user = null;
	// }
	accessToken.set(user?.access_token || undefined);

	/* const obj = await getMyIP();
	isLocal.set(obj.isLocal); */

	// Decode access token
	const decodedUser = await getLoggedInUser();
	loggedInUser.set(decodedUser);

	//todo:if we need to add Apsettings in db
	// Load user settings
	if (decodedUser) {
		try {
	 		const settings = await getUserSetting('payrollapp:shortcuts');
	 		if (!settings || !Array.isArray(settings)) {
	 			shortcuts.set([]);
	 		} else {
	 			shortcuts.set(settings);
	 		}
	 	} catch {
	 		shortcuts.set([]);
	 	}
	} else {
	 	shortcuts.set([]);
	}
}

