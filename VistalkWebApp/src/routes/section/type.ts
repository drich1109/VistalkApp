import type { NumericRange } from "@sveltejs/kit";

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

export type QuestionDto = {
  questionID: number;
  questionText: string;
  imagePath: string;
  audioPath: string;
  questionTypeID: number;
  unitId: number;
  typeName: string
}

export type MultipleChoice = {
  questionChoiceID: number,
  questionID: number,
  correctChoice: number,
  choice1: number,
  choice2: number,
  choice3: number,
  choice4: number,
}

export type MatchingType = {
  questionMatchingTypeID: number;
  questionID: number;
  word1: number;
  match1: number;
  word2: number;
  match2: number;
  word3: number;
  match3: number;
  word4: number;
  match4: number;
}