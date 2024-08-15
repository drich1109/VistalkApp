import { get } from "$lib/api/baseRepo";
import { type CallResultDto, type LoggedInUser } from "../types/types";
import { jwtDecode, type JwtPayload } from 'jwt-decode';
import type { Language } from "./type";

export async function login(email:string, password:string) {
	return  await get<CallResultDto<LoggedInUser>>(`/login`, {email,password});
}

export async function getLanguages() {
	let result =  await get<CallResultDto<Language[]>>(`/getLanguages`);
    return result;
}