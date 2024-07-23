import { get } from "$lib/api/baseRepo";
import type { SampleType } from "./type";

export async function getSampleItems() {
	return await get<SampleType[]>(`/items`);
}