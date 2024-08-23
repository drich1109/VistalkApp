export type ContentType = 
{
    contentTypeID:number,
    typeName:string
}

export type SyllableDto = 
{
    contentId:number;
    syllableText:string;
    audioPath:string;
    orderNumber:number;
    isPlaying:boolean;
    audio:HTMLAudioElement | null;
}

export type DefinitionDto = 
{
    contentId:number;
    nativeDefinition:string;
    englishDefinition:string;
    orderNumber:number;
}

export type ExampleDto = 
{
    contentId:number;
    nativeExample:string;
    englishExample:string;
    orderNumber:number;
}

export type Content = 
{
    contentId:number;
    contentText:string;
    englishTranslation:string;
    audioPath:string;
    languageId:number;
    contentTypeId:number;
    audio:HTMLAudioElement | null;
    file:File | null;
}

export type ContentDto = 
{
    content:Content;
    syllables:SyllableDto[];
    definitions:DefinitionDto[];
    examples:ExampleDto[];
}