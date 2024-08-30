export type ContentType = 
{
    contentTypeID:number,
    typeName:string
}

export type SyllableDto = 
{
    id:number,
    contentId:number;
    syllableText:string;
    audioPath:string;
    orderNumber:number;
    isPlaying:boolean;
    audio:HTMLAudioElement | null;
    file:File | null;
}

export type DefinitionDto = 
{
    id:number,
    contentID:number;
    nativeDefinition:string;
    englishDefinition:string;
    orderNumber:number;
}

export type ExampleDto = 
{
    id:number,
    contentId:number;
    nativeExample:string;
    englishExample:string;
    orderNumber:number;
}

export type Content = 
{
    contentID:number;
    contentText:string;
    englishTranslation:string;
    audioPath:string;
    languageID:number;
    contentTypeId:number;
    audio:HTMLAudioElement | null;
    file:File | null;
    isPlaying:boolean
}

export type ContentDto = 
{
    content:Content;
    syllables:SyllableDto[];
    definitions:DefinitionDto[];
    examples:ExampleDto[];
}