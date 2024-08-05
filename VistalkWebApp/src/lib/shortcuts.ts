import { goto } from '$app/navigation';
import { getLoggedInUser } from '$lib/auth/oidcService'; // Adjust the import path as needed
import type { LoggedInUser } from '../types/types';

/**
 * Redirects to a specific page if the user is logged in.
 * @param {string} route - The route to navigate to.
 */
export async function redirectIfLoggedIn(route: string): Promise<void> {
    const user: LoggedInUser | null = await getLoggedInUser();
    if (user) {
        goto(route);
    } else {
        goto('/');
    }
}