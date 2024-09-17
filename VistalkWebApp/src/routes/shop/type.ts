export type ItemType = 
{
    itemTypeID:number,
    typeName:string
}

export type PowerUp = 
{
    itemID:number,
    itemTypeID:number,
    vcoinPrice:number,
    isPremium:boolean,
    name:string,
    description:string,
    filePath:string,
    file:File | null,
    isActive:boolean
}

export type BackgroundMusic = 
{
    itemID:number,
    itemTypeID:number,
    vcoinPrice:number,
    isPremium:boolean,
    musicTitle:string,
    musicGenre:string,
    filePath:string,
    file:File | null,
    isActive:boolean;
}

export type CoinBag = 
{
    coinBagId:number,
    quantity:number,
    moneyPrice:number,
    coinBagName:string,
    isActive:boolean
}
