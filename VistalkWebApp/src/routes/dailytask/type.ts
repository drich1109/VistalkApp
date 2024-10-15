export type DailyTaskDto ={
    taskID: number;
    typeName: string;
    rewardCoins: number;
    taskDate: string;
    taskTypeId: number;
    quantity: number;
}

export type DailyTaskType = {
    id: number;
    typeName: string;
    description: string;
    powerupId: number;
}