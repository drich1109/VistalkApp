export type Section = {
    sectionId: number;
    sectionNumber: number;
    title: string;
    isPremium: boolean;
    description: string;
    languageID:number;
  };
  
export type Unit = {
    unitID: number;
    unitNumber: number;
    title: string;
    description: string;
    sectionID: number;
    totalItems: number;
};
