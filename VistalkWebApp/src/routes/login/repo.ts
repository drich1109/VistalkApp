import { get } from "$lib/api/baseRepo";
import CryptoJS from 'crypto-js';
import type { CallResultDto, LoggedInUser } from "../../types/types";


export async function login(email:string, password:string) {
	const hashedPassword = CryptoJS.MD5(password).toString();
	return  await get<CallResultDto<LoggedInUser>>(`/login`, {email, hashedPassword});
}