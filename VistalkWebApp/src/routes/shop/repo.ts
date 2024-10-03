import { get, postForm, put} from "$lib/api/baseRepo";
import type { CallResultDto } from "../../types/types";
import type { BackgroundMusic, CoinBag, ItemType, PowerUp } from "./type";

const baseUrl = import.meta.env.VITE_BASE_API;

export async function getItemType() {
	let result =  await get<CallResultDto<ItemType[]>>(`/getItemType`);
    return result;
}

export async function savePowerup(powerUp: PowerUp) {
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
export async function saveBackgroundMusic(BackgroundMusic: BackgroundMusic) {
    const formData = new FormData();

    formData.append('itemID', String(BackgroundMusic.itemID));
    formData.append('itemTypeID', BackgroundMusic.itemTypeID.toString());
    formData.append('isPremium', BackgroundMusic.isPremium.toString());
    formData.append('vcoinPrice', BackgroundMusic.vcoinPrice.toString());
    formData.append('musicTitle', BackgroundMusic.musicTitle);
    formData.append('musicGenre', BackgroundMusic.musicGenre);

    if (BackgroundMusic.file) {
        const file = new File([BackgroundMusic.file], 'mp3', { type: 'mp3' });
        formData.append('itemAudioFile', file);
    }

	let result =  await postForm<CallResultDto<object>>(`/saveItemShop`, formData);
    return result;
}
export async function saveCoinbag(CoinBag: CoinBag, typeId:number) {
    const formData = new FormData();

    formData.append('coinBagId', String(CoinBag.coinBagId));
    formData.append('itemTypeID', String(typeId));

    formData.append('quantity', CoinBag.quantity.toString());
    formData.append('moneyPrice', CoinBag.moneyPrice.toString());
    formData.append('coinBagName', CoinBag.coinBagName.toString());

	let result =  await postForm<CallResultDto<object>>(`/saveItemShop`, formData);
    return result;
}

export async function getItemList(itemTypeID: number | null, pageNo: number, searchString: string | null) {
    let result;

    if (itemTypeID === 1) {
        result = await get<CallResultDto<PowerUp[]>>(`/getItemList`, { itemTypeID, pageNo, searchString });
    } 
    else if (itemTypeID === 2) {
        result = await get<CallResultDto<BackgroundMusic[]>>(`/getItemList`, { itemTypeID, pageNo, searchString });
    }
    else if (itemTypeID === 3) {
        result = await get<CallResultDto<CoinBag[]>>(`/getItemList`, { itemTypeID, pageNo, searchString });
    }
    return result;
}

export async function getItemFileByFileName(fileName: string, itemType:number): Promise<Blob | null> {
    try {
        const response = await fetch(`${baseUrl}/getShopFileByFileName?fileName=${fileName}&itemType=${itemType}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/octet-stream'
            }
        });
        if (response.ok) {
            return await response.blob();
        } else {
            console.error(`Failed to fetch file: ${response.statusText}`);
            return null;    
        }
    } catch (error) {
        console.error(`Failed to fetch file:`, error);
        return null;
    }
}

export async function setItemInactive(itemId:number) {
	let result =  await put<CallResultDto<object>>(`/itemInactive`, {itemId});
    return result;
}

export async function coinBagInactive(coinBagId:number) {
	let result =  await put<CallResultDto<object>>(`/coinBagInactive`, {coinBagId});
    return result;
}


