export type UserDto = {
    userPlayerId: number;
    vCoin: number;
    totalScoreWeekly: number;
    isPremium: boolean;
    premiumExpiry: Date | null;
    currentLanguageId: number;
    name: string;
    email: string;
    imagePath: string | null;
    powerUps:PowerUpDto[];
  };

export type PowerUpDto = {
    itemId:number;
    quantity:number;
    name:string;
}