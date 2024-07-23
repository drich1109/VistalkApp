import { get } from './api/baseRepo';

const baseUrl = import.meta.env.VITE_BASE_URL;

export async function getMyIP() {
	return await get<{ isLocal: boolean; requestIP: string }>(`whoami`, undefined, baseUrl);
}
