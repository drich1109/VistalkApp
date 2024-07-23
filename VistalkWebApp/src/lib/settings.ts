import { get } from './api/baseRepo';
import { getSQLValue } from './api/sqlService';

export async function getUserSetting(settingName: string): Promise<string | null> {
	return await get("/AppSettings/GetAppSetting", { settingName });
	// const result = await getSingleSQLValue<{ Value: string }>(
	// 	`SELECT Value FROM AppSettings WHERE PersonID = @userId AND SettingName = @settingName`,
	// 	{
	// 		userId: { type: 'int', value: userId },
	// 		settingName: { type: 'nvarchar', value: settingName }
	// 	}
	// );
	// return result?.Value || null;
}

export async function setUserSetting(userId: number, settingName: string, settingValue: string) {
	await getSQLValue(
		`
    IF EXISTS (SELECT ID FROM AppSettings WHERE PersonID = @userId AND SettingName = @settingName)
        UPDATE AppSettings SET Value = @settingValue WHERE PersonID = @userId AND SettingName = @settingName;
    ELSE
        INSERT INTO AppSettings (PersonID, SettingName, Value) VALUES (@userId, @settingName, @settingValue);
    `,
		{
			userId: { type: 'int', value: userId },
			settingName: { type: 'nvarchar', value: settingName },
			settingValue: { type: 'nvarchar', value: settingValue }
		}
	);
}
