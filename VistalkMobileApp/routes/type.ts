export interface LoggedInUser {
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