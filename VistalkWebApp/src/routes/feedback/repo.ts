import { get } from "$lib/api/baseRepo";
import type { CallResultDto } from "../../types/types";
import type { FeedbackDto } from "./type";

export async function getFeedbackList(pageNo:number, startDate:string, endDate:string, searchString:string |null) {
	let result =  await get<CallResultDto<FeedbackDto[]>>(`/getFeedbacks`, {pageNo, startDate, endDate, searchString});
    return result;
}