import type { Cookies } from '@sveltejs/kit';
import type { StateStore } from 'oidc-client-ts';

export default class CookieStateStore implements StateStore {
	constructor(private cookies: Cookies, private prefix: string = 'oidc.') {}

	async set(key: string, value: string): Promise<void> {
		key = encodeURIComponent(this.prefix + key);
		this.cookies.set(key, value, { path: '/' });
	}

	async get(key: string): Promise<string | null> {
		key = encodeURIComponent(this.prefix + key);
		return this.cookies.get(key) || null;
	}

	async remove(key: string): Promise<string | null> {
		key = encodeURIComponent(this.prefix + key);
		this.cookies.delete(key, { path: '/' });
		return null;
	}

	async getAllKeys(): Promise<string[]> {
		throw new Error('Method not implemented.');
	}
}
