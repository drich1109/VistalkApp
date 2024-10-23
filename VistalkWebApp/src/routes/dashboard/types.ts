export type LeaderBoardDto = 
{
    id:number;
    name: string;
    totalScoreWeekly: number;
    imagePath: string;
}

export type StatusDto = 
{
    active:number;
    inactive: number;
}

export type UserLanguage = 
{
    languageName:string;
    userCount: number;
}

export type SubscriptionDto = 
{
    type:string;
    month: number;
    subscriptionCount:number;
}