import { writable, type Readable, type Writable } from 'svelte/store';
import type { LoggedInUser } from '../types/types';

export const accessToken = writable<string | undefined>(undefined);
export const loggedInUser = writable<LoggedInUser | null>(null);
export const isLocal = writable<boolean>(false);

export const shortcuts = writable<string[]>([]);

export function getValue<T>(writable: Writable<T> | Readable<T>): T {
	let value: T;
	const unsubscribe = writable.subscribe((v) => (value = v));
	unsubscribe();
	return value!;
}
