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
    filePath:string;
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
  unitsUnlocked: number | null;
  highestScore: number | null;
  isSubscribed: boolean;
  expirationDate: Date | null;
  weeklyScoreGraph: { [key: string]: number }; 
};