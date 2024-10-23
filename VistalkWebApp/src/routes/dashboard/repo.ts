import { get, put } from "$lib/api/baseRepo";
import type { CallResultDto } from "../../types/types";
import type { LeaderBoardDto, StatusDto, SubscriptionDto, UserLanguage } from "./types";

export async function getLeaderBoards(){
    return await get<CallResultDto<LeaderBoardDto[]>>('getLeaderBoard');
}

export async function resetLeaderBoard(){
    return await put<CallResultDto<object>>('resetLeaderBoard');
}

export async function getStatusVista(){
    return await get<CallResultDto<StatusDto>>('getStatusVista');
}

export async function getUserLanguage(){
    return await get<CallResultDto<UserLanguage[]>>('getLanguageUsers');
}

export async function getSubscriptionData(){
    return await get<CallResultDto<SubscriptionDto[]>>('getSubscriptionData');
}
