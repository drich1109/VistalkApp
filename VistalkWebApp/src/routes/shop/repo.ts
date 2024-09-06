import { get, postForm} from "$lib/api/baseRepo";
import type { CallResultDto } from "../../types/types";
import type { BackgroundMusic, CoinBag, ItemType, PowerUp } from "./type";

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
export async function saveBackgroundMusic(BackgroundMusic: BackgroundMusic) {
    console.log(BackgroundMusic)
    const formData = new FormData();

    formData.append('itemID', String(BackgroundMusic.itemID));
    formData.append('itemTypeID', BackgroundMusic.itemTypeID.toString());
    formData.append('isPremium', BackgroundMusic.isPremium.toString());
    formData.append('vcoinPrice', BackgroundMusic.vcoinPrice.toString());
    formData.append('musicTitle', BackgroundMusic.musicTitle);
    formData.append('musicGenre', BackgroundMusic.musicGenre);

    if (BackgroundMusic.file) {
        const file = new File([BackgroundMusic.file], 'mp3', { type: 'mp3' });
        formData.append('mp3', file);
    }

	let result =  await postForm<CallResultDto<object>>(`/saveItemShop`, formData);
    return result;
}
export async function saveCoinbag(CoinBag: CoinBag, typeId:number) {
    console.log(CoinBag)
    const formData = new FormData();

    formData.append('coinBagId', String(CoinBag.coinBagId));
    formData.append('itemTypeID', String(typeId));

    formData.append('quantity', CoinBag.quantity.toString());
    formData.append('moneyPrice', CoinBag.moneyPrice.toString());
    formData.append('coinBagName', CoinBag.coinBagName.toString());

	let result =  await postForm<CallResultDto<object>>(`/saveItemShop`, formData);
    return result;
}

