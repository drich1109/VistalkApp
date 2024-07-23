// src/lib/oidcService.ts
import { UserManager, User } from 'oidc-client-ts';
import oidcConfig from './oidcConfig';
import { goto } from '$app/navigation';
import { jwtDecode, type JwtPayload } from 'jwt-decode';
import { browser } from '$app/environment';
import { loggedInUser } from '$lib/store';
import type {LoggedInUser} from'../../types/types';

export type CustomJwtPayload = JwtPayload & LoggedInUser;

const oidcClient = new UserManager(oidcConfig);

export async function signIn(keepExistingUrl: boolean = true): Promise<void> {
	if (keepExistingUrl && browser) {
		window.sessionStorage.setItem('redirectUrl', window.location.href);
	}
	await oidcClient.signinRedirect();
}

export async function signOut(): Promise<void> {
	await oidcClient.signoutRedirect();
}

export async function getUser(): Promise<User | null> {
	const user = await oidcClient.getUser();
	return user;
}

export async function getLoggedInUser(): Promise<CustomJwtPayload | null> {
	const user = await oidcClient.getUser();
	if (!user?.access_token) return null;
	try {
		const decodedToken = jwtDecode(user.access_token) as CustomJwtPayload;
		// Update the store with the decoded token details including userTypeId
		return decodedToken;
	} catch {
		oidcClient.revokeTokens();
		return null;
	}
}

export async function handleCallback(): Promise<void> {
	try {
		await oidcClient.signinRedirectCallback();
		if (browser) {
			const redirectUrl = window.sessionStorage.getItem(`redirectUrl`);
			if (redirectUrl) {
				window.sessionStorage.removeItem(`redirectUrl`);
				goto(redirectUrl);
				return;
			}
		}
		goto('/');
	} catch (error) {
		console.error('Error processing callback:', error);
	}
}

export { oidcConfig, oidcClient };
