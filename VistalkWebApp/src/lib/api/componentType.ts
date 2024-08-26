export type QuestionMultipleDto = 
{
    questionID: number;
    imagePath:string|null;
    audioPath:string|null;
    questionText:string;
    file:File | null;
    questionTypeID:number;
    unitId:number;
    choice1: number;
    choice2: number;
    choice3: number;
    choice4: number;
    correctChoice:number;
}