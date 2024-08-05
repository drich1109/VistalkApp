import { get } from "$lib/api/baseRepo";
import type { LoggedInUser } from "../types/types";
import { jwtDecode, type JwtPayload } from 'jwt-decode';

export async function login(email:string, password:string) {
	const  response =  await get<LoggedInUser>(`/login`, {email,password});
	const token = response.token;
    return { name: response.name, token };
}