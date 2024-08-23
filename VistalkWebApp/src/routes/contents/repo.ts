import { post, get } from "$lib/api/baseRepo";
import type { CallResultDto } from "../../types/types";
import type { Content, ContentDto, ContentType } from "./type";

export async function getContentTypes() {
	let result =  await get<CallResultDto<ContentType[]>>(`/getContentTypes`);
    return result;
}

export async function saveMainContent(formData: FormData) {
    return await post<CallResultDto<object>>(`/saveContent`, {}, formData);
}

export async function getContents(languageID:number, contentTypeID: number | null, searchString:string|null, pageNo:number) {
	return await get<CallResultDto<Content[]>>(`/getContents`, {languageID, contentTypeID, searchString, pageNo});
}