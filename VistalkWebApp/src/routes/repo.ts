import { get } from "$lib/api/baseRepo";
import type { LoggedInUser } from "../types/types";

export async function login(email:string, password:string) {
	return await get<LoggedInUser>(`/login`, {email,password});
}