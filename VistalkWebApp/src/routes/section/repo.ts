import { post, get } from "$lib/api/baseRepo";
import type { CallResultDto } from "../../types/types";
import type { Section, Unit } from "./type";

export async function saveSection(section:Section) {
	return await post<CallResultDto<object>>(`/saveSection`, {}, section);
}

export async function getSections(languageID:number) {
	let result =  await get<CallResultDto<Section[]>>(`/getSections`, {languageID});
    return result;
}

export async function saveUnit(unit:Unit) {
	return await post<CallResultDto<object>>(`/saveUnit`, {}, unit);
}

export async function getUnits(sectionID:number, pageNo:number, searchString :string | null) {
	let result =  await get<CallResultDto<Unit[]>>(`/getUnits`, {sectionID, pageNo, searchString});
    return result;
}