import { getFromBaseApi, getFromMainApi, postToBaseApi } from "../api/apiService";
import { LoggedInUser, CallResultDto, Languages, UserDto } from "./type";
import CryptoJS from 'crypto-js';

export async function loginUser(email:string, password:string)
{
    const hashedPassword = CryptoJS.MD5(password).toString();
    return await getFromBaseApi<CallResultDto<LoggedInUser>>('loginVista', {email, hashedPassword});
}

export async function getLanguages()
{
    return await getFromMainApi<CallResultDto<Languages[]>>('getLanguages');
}

export async function register(user:UserDto)
{
    return await postToBaseApi<CallResultDto<object>>('registerUser', user)
}