import { get, post, postForm } from "$lib/api/baseRepo";
import { da } from "date-fns/locale";
import type { CallResultDto } from "../../types/types";
import type { DailyTaskDto, DailyTaskType } from "./type";

export async function getDailyTask(pageNo:number, startDate:string, endDate:string, searchString:string |null) {
	let result =  await get<CallResultDto<DailyTaskDto[]>>(`/getDailyTask`, {pageNo, startDate, endDate, searchString});
    return result;
}

export async function getDailyTaskTypes() {
	let result =  await get<CallResultDto<DailyTaskType[]>>(`/getDailyTaskTypes`);
    return result;
}

export async function saveDailyTask(daily: DailyTaskDto) {
    const formData = new FormData();
    formData.append('taskID', String(daily.taskID));
    formData.append('rewardCoins', daily.rewardCoins.toString());
    formData.append('taskDate', daily.taskDate.toString());
    formData.append('taskTypeId', daily.taskTypeId.toString());
    formData.append('quantity', daily.quantity.toString());
	let result =  await postForm<CallResultDto<object>>(`/saveDailyTask`, formData);
    return result;
}

/* export async function saveDailyTask(daily: DailyTaskDto) {
	return await post<CallResultDto<object>>(`/saveDailyTask`, {}, daily);
}
 */
