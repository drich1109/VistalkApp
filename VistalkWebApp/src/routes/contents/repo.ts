import { post, get, postForm, getFile, put } from "$lib/api/baseRepo";
import { pt } from "date-fns/locale";
import type { CallResultDto } from "../../types/types";
import type { Content, ContentDto, ContentType, DefinitionDto, ExampleDto, SyllableDto } from "./type";

const baseUrl = import.meta.env.VITE_BASE_API;

export async function getContentTypes() {
	let result =  await get<CallResultDto<ContentType[]>>(`/getContentTypes`);
    return result;
}

export async function saveMainContent(content: ContentDto) {
    const formData = new FormData();

    formData.append('contentId', content.content.contentID.toString());
    formData.append('contentText', content.content.contentText);
    formData.append('englishTranslation', content.content.englishTranslation);
    formData.append('languageId', content.content.languageID.toString());
    formData.append('contentTypeId', content.content.contentTypeId.toString());
    formData.append('audioPath', content.content.audioPath.toString());
    formData.append('isInDictionary', content.content.isInDictionary.toString());
    if (content.content.file) {
        const file = new File([content.content.file], 'audio.wav', { type: 'audio/wav' });
        formData.append('contentAudioFile', file);
    }
    console.log(content.syllables);

    content.syllables.forEach((syllable, index) => {
        formData.append(`syllables[${index}].id`, syllable.id.toString());
        formData.append(`syllables[${index}].contentId`, syllable.contentId.toString());
        formData.append(`syllables[${index}].syllableText`, syllable.syllableText);
        formData.append(`syllables[${index}].audioPath`, syllable.audioPath);
        formData.append(`syllables[${index}].orderNumber`, syllable.orderNumber.toString());

        if (syllable.file) {
            const file = new File([syllable.file], 'audio.wav', { type: 'audio/wav' });
            formData.append(`syllables[${index}].audioFile`, file);
        }
    });
    content.definitions.forEach((definition, index) => {
        formData.append(`definitions[${index}].id`, definition.id.toString());
        formData.append(`definitions[${index}].contentId`, definition.contentID.toString());
        formData.append(`definitions[${index}].nativeDefinition`, definition.nativeDefinition);
        formData.append(`definitions[${index}].englishDefinition`, definition.englishDefinition);
        formData.append(`definitions[${index}].orderNumber`, definition.orderNumber.toString());
    });

    content.examples.forEach((example, index) => {
        formData.append(`examples[${index}].id`, example.id.toString());
        formData.append(`examples[${index}].contentId`, example.contentId.toString());
        formData.append(`examples[${index}].nativeExample`, example.nativeExample);
        formData.append(`examples[${index}].englishExample`, example.englishExample);
        formData.append(`examples[${index}].orderNumber`, example.orderNumber.toString());
    });
    for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
    }

    return await postForm<CallResultDto<object>>(`/saveContent`, formData);
}

export async function getContents(languageID:number, contentTypeID: number | null, searchString:string|null, pageNo:number) {
	return await get<CallResultDto<Content[]>>(`/getContents`, {languageID, contentTypeID, searchString, pageNo});
}

export async function getContentById(contentId:number) {
	return await get<CallResultDto<Content>>(`/getContentById`, {contentId});
}

export async function getSyllablesByContentId(contentId:number) {
	return await get<CallResultDto<SyllableDto[]>>(`/getSyllablesByContentId`, {contentId});
}

export async function getDefinitionByContentId(contentId:number) {
	return await get<CallResultDto<DefinitionDto[]>>(`/getDefinitionByContentId`, {contentId});
}

export async function getExamplesByContentId(contentId:number) {
	return await get<CallResultDto<ExampleDto[]>>(`/getExamplesByContentId`, {contentId});
}

export async function getFileByFileName(fileName: string, isSyllable:boolean): Promise<Blob | null> {
    try {
        const response = await fetch(`${baseUrl}/getFileByFileName?fileName=${fileName}&isSyllable=${isSyllable}`, {
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

export async function contentInactived(contentId:number) {
	return await put<CallResultDto<object>>(`/contentInactive`, {contentId});
}
