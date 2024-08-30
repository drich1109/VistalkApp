import { get, postForm} from "$lib/api/baseRepo";
import type { CallResultDto } from "../../types/types";
import type { ItemType, PowerUp } from "./type";

export async function getItemType() {
	let result =  await get<CallResultDto<ItemType[]>>(`/getItemType`);
    return result;
}

export async function savePowerup(powerUp: PowerUp) {
    console.log(powerUp)
    const formData = new FormData();

    formData.append('itemID', String(powerUp.itemID));
    formData.append('itemTypeID', powerUp.itemTypeID.toString());
    formData.append('isPremium', powerUp.isPremium.toString());
    formData.append('vcoinPrice', powerUp.vcoinPrice.toString());
    formData.append('name', powerUp.name);
    formData.append('description', powerUp.description);

    if (powerUp.file) {
        const file = new File([powerUp.file], 'image.png', { type: 'image/png' });
        formData.append('itemImageFile', file);
    }

	let result =  await postForm<CallResultDto<object>>(`/saveItemShop`, formData);
    return result;
}