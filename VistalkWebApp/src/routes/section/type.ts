export type Section = {
    sectionId: number;
    sectionNumber: number;
    title: string;
    isPremium: boolean;
    description: string;
    languageID:number;
  };
  
export type Unit = {
    unitID: number;
    unitNumber: number;
    title: string;
    description: string;
    sectionID: number;
    totalItems: number;
};

export type QuestionType=
{
  typeID:number;
  typeName:string;
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