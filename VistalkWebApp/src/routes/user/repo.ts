import { get } from "$lib/api/baseRepo";
import type { CallResultDto } from "../../types/types";
import type { PowerUpDto, UserDto } from "./type";

export async function getUserList(pageNo:number, searchString :string | null, showInactive:boolean, isShowSubscriber:boolean) {
	let result =  await get<CallResultDto<UserDto[]>>(`/getusers`, {pageNo, searchString, showInactive, isShowSubscriber});
    return result;
}

export async function getUserPowerUp(userId:number) {
	let result =  await get<CallResultDto<PowerUpDto[]>>(`/getuserPowerUps`, {userId});
    return result;
}