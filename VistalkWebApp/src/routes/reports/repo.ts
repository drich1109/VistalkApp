import { get, put } from "$lib/api/baseRepo";
import type { CallResultDto } from "../../types/types";
import type { ReportsDto } from "./type";

export async function getReportList(pageNo:number, hasResponded:boolean, startDate:string, endDate:string, searchString:string |null) {
	let result =  await get<CallResultDto<ReportsDto[]>>(`/getReports`, {pageNo, hasResponded, startDate, endDate, searchString});
    return result;
}

export async function reportResponded(reportID:number) {
	return await put<CallResultDto<object>>(`/reportResponded`, {reportID});
}