import { getFromBaseApi, getFromMainApi, postToBaseApi, putToBaseApi } from "../api/apiService";
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

export async function sendCodetoEmail(email:string)
{
    return await getFromBaseApi<CallResultDto<object>>('forgotPassword', {email})
}

export async function verifyCode(email:string, code:string)
{
    return await getFromBaseApi<CallResultDto<object>>('verifyCode', {email, code})
}

export async function updatePassword(email:string, password:string)
{
    const hashedPassword = CryptoJS.MD5(password).toString();
    return await putToBaseApi<CallResultDto<object>>('changePassword', {email, hashedPassword})
}