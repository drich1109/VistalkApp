export interface LoggedInUser {
    id:string;
	name: string;
	token: string;
}

export type CallResultDto<T> = {
	isSuccess: boolean;
	message: string;
	data: T;
	data2: T;
	totalCount:number | null;
};

export type Languages = 
{
    languageID:number,
    name:string;
    place:string;
    native_name:string,
    description:string
}

export type UserDto = 
{
    name:string;
    email:string;
    password:string;
    languageId:number;
}

export type UserProfileDto = {
    id: number;
    name: string;
    email: string;
    imagePath: string | null;
    vCoin: number;
    currentLanguageId: string;
    totalScoreWeekly: number;
    vcoin: number;
  }
  
export type EditProfileVista = {
    name: string;
    email: string;
    userId: number;
    file: File | null;
};

export type Content = {
    contentID: number;
    contentText: string;
    englishTranslation: string;
    audioPath: string;
    languageID: number;
    contentTypeID: number;
    isActive: boolean;
    isInDictionary:boolean;
};

export type ContentSyllable = {
    id: number;
    contentId: number;
    syllableText: string;
    audioPath: string;
    orderNumber: number;
};

export type ContentExample = {
    id: number;
    contentId: number;
    nativeExample: string;
    englishExample: string;
    orderNumber: number;
};

export type ContentDefinition = {
    id: number;
    contentId: number;
    nativeDefinition: string;
    englishDefinition: string;
    orderNumber: number;
};

export type PowerUp = 
{
    itemID: number;
    itemTypeID: number;
    vcoinPrice: number;
    isPremium: boolean;
    filePath: string;
    isActive: boolean;
    name: string;
    description: string;
}