import { getFromBaseApi, getFromMainApi, postToBaseApi, postToMainApi, putFormBaseApi, putToBaseApi, putToMainApi } from "../../api/apiService";
import { LoggedInUser, CallResultDto, Languages, UserDto, UserProfileDto, EditProfileVista, Content } from "./type";
import CryptoJS from 'crypto-js';
import { VITE_MAIN_API } from '@env';

const baseUrl = VITE_MAIN_API;

export async function loginUser(email:string, password:string)
{
    const hashedPassword = CryptoJS.MD5(password).toString();
    const result =  await getFromBaseApi<CallResultDto<LoggedInUser>>('loginVista', {email, hashedPassword});
    console.log(result)
    return result
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

export async function updatePassword(email:string, password:string, currentPassword:string|null)
{
    const hashedPassword = CryptoJS.MD5(password).toString();
    let currenthashedPassword;
    if(currentPassword)
        currenthashedPassword = CryptoJS.MD5(currentPassword).toString();
    else currenthashedPassword = null

    return await putToBaseApi<CallResultDto<object>>('changePassword', {email, hashedPassword, currenthashedPassword})
}

export async function getUserLanguage(userID:number)
{
    return await getFromMainApi<CallResultDto<Languages>>('getUserLanguage', {userID});
}

export function getUserImageUrl(fileName: string): string {
    const timestamp = Date.now(); 
    return `${baseUrl}/getUserImage?fileName=${fileName}&t=${timestamp}`;
}

export async function getUserDetails(userID:number)
{
    return await getFromMainApi<CallResultDto<UserProfileDto>>('getUserDetails', {userID});
}

export async function getIsEmailUsed(email:string)
{
    return await getFromBaseApi<CallResultDto<object>>('isEmailUse', {email});
}

export async function editVistaProfile(formData: FormData) {
    return await putFormBaseApi<CallResultDto<object>>('/editVistaProfile', formData);
}

export async function deactivateVistaAccount(userId:number) {
    return await putToBaseApi<CallResultDto<object>>('/deactivateVistaAccount', {userId});
}

export async function sendFeedback(userId:number, feedback:string) {
    return await postToMainApi<CallResultDto<object>>('/addfeedback', {userId, feedback});
}
export async function getContent(searchString: string)
{
    return await getFromMainApi<CallResultDto<Content[]>>('getContent', {searchString});
}