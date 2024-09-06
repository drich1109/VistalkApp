import { getFromBaseApi, getFromMainApi, postToBaseApi } from "../api/apiService";
import { LoggedInUser, CallResultDto, Languages, UserDto } from "./type";

export async function loginUser(email:string, password:string)
{
    return await getFromBaseApi<CallResultDto<LoggedInUser>>('loginVista', {email, password});
}

export async function getLanguages()
{
    return await getFromMainApi<CallResultDto<Languages[]>>('getLanguages');
}

export async function register(user:UserDto)
{
    return await postToBaseApi<CallResultDto<object>>('registerUser', user)
}