import { format, parse } from 'date-fns';
import { post } from './baseRepo';

export type SqlParamValue = string | number | boolean | Date | null | undefined;
export type SqlParam = SqlParamValue | SqlParamArray | SqlParamObj;
export type SqlParamArray = [SqlParamValue, SqlParamType];
export type SqlParamObj = { type: SqlParamType | undefined; value: SqlParamValue };
export type SqlParams = { [key: string]: SqlParam };

export type SqlParamType =
	| 'nvarchar'
	| 'int'
	| 'float'
	| 'date'
	| 'datetime'
	| 'time'
	| 'decimal'
	| 'bit';
export type SqlParamAPI = {
	name: string;
	type: SqlParamType;
	value: string | null;
};

export const apiEndpoint = import.meta.env.VITE_BASE_API;
// export const apiEndpoint = import.meta.env.VITE_KIPSYS_API_URL;

export async function getSingleSQLValue<T>(
	sqlString: string,
	params?: SqlParams
): Promise<T | undefined> {
	const result = await getSQLValue<T>(sqlString, params);
	return result[0];
}

export async function getSQLValue<T>(
	sqlString: string,
	params?: SqlParams,
): Promise<T[]> {
	return await post(
		'sqlstring',
		undefined,
		{ sqlString, params: params && getParams(params) },
		apiEndpoint
	);
}

function getParams(params: SqlParams): SqlParamAPI[] {
	return Object.keys(params).map((p) => getParam(p, params[p]));
}

function getParam(paramName: string, param: SqlParam): SqlParamAPI {
	if (Array.isArray(param)) {
		return getParamWithType(paramName, param[0], param[1]);
	} else if ((param as SqlParamObj).value || (param as SqlParamObj).type) {
		return getParamWithType(
			paramName,
			(param as SqlParamObj).value,
			(param as SqlParamObj).type as SqlParamType
		);
	} else {
		return getParamWithType(paramName, param as SqlParamValue, 'nvarchar');
	}
}

function getParamWithType(name: string, value: SqlParamValue, type: SqlParamType): SqlParamAPI {
	if (!name || /[^A-Za-z_]/.test(name)) {
		throw Error(`Invalid param name ${name}`);
	}
	switch (type) {
		case 'nvarchar':
			return { name, type, value: stringParam(value) };
		case 'int':
			return { name, type, value: numberParamOpt(value) };
		case 'float':
			return { name, type, value: numberParamOpt(value) };
		case 'bit':
			return { name, type, value: boolParam(value) };
		case 'date':
			return { name, type, value: dateParamOpt(value) };
		case 'time':
			return { name, type, value: timeParamOpt(value) };
		case 'datetime':
			return { name, type, value: dateTimeParamOpt(value) };
		default:
			throw Error(`Invalid param type ${type}`);
	}
}

function stringParam(input: SqlParamValue): string | null {
	if (!input) {
		return null;
	}
	return `${String(input)
		.replaceAll("'", "''")
		.replaceAll('\r', '')
		.replaceAll('\n', "' + CHAR(10) + '")}`;
}

function boolParam(input: SqlParamValue): string | null {
	return input ? 'true' : 'false';
}

function dateParam(input: SqlParamValue): string | null {
	if (!input) {
		return null;
	}
	const dt = new Date(input as string | number | Date);
	if (isNaN(Number(dt))) {
		throw Error(`Invalid date ${input}`);
	}
	return format(dt, 'yyyy-MM-dd');
}

function dateParamOpt(input?: SqlParamValue): string | null {
	return input ? dateParam(input) : null;
}

function dateTimeParam(input: SqlParamValue): string | null {
	const dt = new Date(input as string | number | Date);
	if (isNaN(Number(dt))) {
		throw Error(`Invalid date ${input}`);
	}
	return dt.toISOString();
}

function timeParamOpt(input?: SqlParamValue): string | null {
	return input ? timeParam(input) : null;
}

function timeParam(input: SqlParamValue): string | null {
	const dt = parse(input as string, "HH:mm", new Date());
	if (isNaN(Number(dt))) {
		throw Error(`Invalid date ${input}`);
	}
	return format(dt, 'HH:mm:ss');
}

function dateTimeParamOpt(input?: SqlParamValue): string | null {
	return input ? dateTimeParam(input) : null;
}

function numberParam(input: SqlParamValue): string | null {
	if (input === undefined || input === null) {
		return null;
	}
	const n = Number(input);
	if (!n && n !== 0) {
		throw Error(`Invalid number ${input}`);
	}
	return String(n);
}

function numberParamOpt(input?: SqlParamValue): string | null {
	return input || input == 0 ? numberParam(input) : null;
}
