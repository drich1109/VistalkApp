// types.ts

export interface LoggedInUser {
	uid: string;
	name: string;
	preferred_username: string;
	scope: string[];
	role: string[];
	userTypeId: string; 
}

export type DateInput = string | number | Date;

export type PagedListViewModel<T> = {
	totalCount: number;
	items: T[];
};

export type SortConfig<T> = {
	sortBy: T;
	sortAsc: boolean;
};

export type CallResultDto<T> = {
	isSuccess: boolean;
	message: string;
	data: T;
	data2: T;
	totalCount:number | null;
};
