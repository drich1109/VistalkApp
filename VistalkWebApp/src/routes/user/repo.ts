import { get } from "$lib/api/baseRepo";
import type { CallResultDto } from "../../types/types";
import type { Language } from "../type";
import type { PowerUpDto, UserDto, UserProfileDto } from "./type";

const baseUrl = import.meta.env.VITE_BASE_API;

export async function getUserList(pageNo:number, searchString :string | null, showInactive:boolean, isShowSubscriber:boolean) {
	let result =  await get<CallResultDto<UserDto[]>>(`/getusers`, {pageNo, searchString, showInactive, isShowSubscriber});
    return result;
}

export async function getUserPowerUp(userId:number) {
	let result =  await get<CallResultDto<PowerUpDto[]>>(`/getuserPowerUps`, {userId});
    return result;
}

export async function getLanguages() {
	let result =  await get<CallResultDto<Language[]>>(`/getLanguages`);
    return result;
}

export async function getUserDetails(userID:number) {
	let result =  await get<CallResultDto<UserProfileDto>>(`/getUserDetails`, {userID});
    return result;
}

export async function getImageUrl(fileName: string): Promise<Blob | null> {
    try {
        const response = await fetch(`${baseUrl}/getUserImage?fileName=${fileName}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/octet-stream'
            }
        });
        if (response.ok) {
            return await response.blob();
        } else {
            console.error(`Failed to fetch file: ${response.statusText}`);
            return null;    
        }
    } catch (error) {
        console.error(`Failed to fetch file:`, error);
        return null;
    }
}