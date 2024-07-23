import { WebStorageStateStore, type UserManagerSettings } from 'oidc-client-ts';
import { CookieStorage } from 'cookie-storage';

export const cookieStorage = new CookieStorage({
	expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
});

export const userStore = new WebStorageStateStore({ store: cookieStorage });

const oidcConfig: UserManagerSettings = {
	authority: import.meta.env.VITE_OIDC_AUTHORITY,
	client_id: import.meta.env.VITE_OIDC_CLIENT_ID,
	redirect_uri: import.meta.env.VITE_OIDC_REDIRECT_URI,
	response_type: 'code',
	scope: 'openid arsapi',
	userStore
};

export default oidcConfig;
