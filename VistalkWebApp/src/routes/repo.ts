import { get } from "$lib/api/baseRepo";
import { type CallResultDto, type LoggedInUser } from "../types/types";
import { jwtDecode, type JwtPayload } from 'jwt-decode';

export async function login(email:string, password:string) {
	return  await get<CallResultDto<LoggedInUser>>(`/login`, {email,password});
}