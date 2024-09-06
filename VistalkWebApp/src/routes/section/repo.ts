import { post, get } from "$lib/api/baseRepo";
import type { CallResultDto } from "../../types/types";
import type { Language } from "../type";
import type { Content, MatchingType, MultipleChoice, QuestionDto, QuestionType, Section, Unit } from "./type";

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

export async function getQuestionTypes() {
	let result =  await get<CallResultDto<QuestionType[]>>(`/getQuestionTypes`);
    return result;
}

export async function getChoices(languageID:number) {
	let result =  await get<CallResultDto<Content[]>>(`/getChoices`,{languageID});
    return result;
}

export async function getQuesions(unitId:number, pageNo:number, searchString :string | null) {
	let result =  await get<CallResultDto<QuestionDto[]>>(`/getQuestions`, {unitId, pageNo, searchString});
    return result;
}

export async function getMultipleChoice(questionID:number) {
	let result =  await get<CallResultDto<MultipleChoice>>(`/getMultipleChoice`,{questionID});
	console.log(result)
    return result;
}
export async function getMatchingType(questionMatchingTypeID:number) {
	let result =  await get<CallResultDto<MatchingType>>(`/getMatchingType`,{questionMatchingTypeID});
	console.log(result)
    return result;
}