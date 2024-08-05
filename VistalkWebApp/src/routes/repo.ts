import { get } from "$lib/api/baseRepo";
import type { LoggedInUser } from "../types/types";
import { jwtDecode, type JwtPayload } from 'jwt-decode';

export async function login(email:string, password:string) {
	const  response =  await get<LoggedInUser>(`/login`, {email,password});
	const token = response.token;
    const decodedToken = jwtDecode<LoggedInUser>(token);
    return { name: decodedToken.name, token };
}