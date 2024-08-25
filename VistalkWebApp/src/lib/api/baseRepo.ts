import { browser } from '$app/environment';
import { signIn, signOut } from '$lib/auth/oidcService';
import { accessToken, getValue } from '$lib/store';
import type { AxiosError, AxiosRequestConfig } from 'axios';
import axios from 'axios';

export const getEndpoint = () => import.meta.env.VITE_BASE_API;

const axiosInstance = axios.create({
	headers: {}
});

export async function authenticatedRequest<T>(config: AxiosRequestConfig): Promise<T> {
	const access_token = getValue(accessToken);

	if (!config.baseURL) {
		config.baseURL = getEndpoint();
	}

	try {
		if (access_token) {
			config.headers = {
				...config.headers,
				Authorization: `Bearer ${access_token}`
			};
		}

		const response = await axiosInstance(config);
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			const axiosError = error as AxiosError;

			if (axiosError.response && axiosError.response.status === 401) {
				console.error('Unauthorized access:', axiosError.response.data);
				if (browser) {
					// signOut()
					// signIn();
				}
			} else {
				console.error('Error:', axiosError.message);
			}
		} else {
			console.error('Unknown error:', error);
		}
		throw error;
	}
}

export async function get<TResponse, TParams = unknown>(
	url: string,
	params?: TParams,
	baseURL?: string
): Promise<TResponse> {
	return await authenticatedRequest({
		method: 'get',
		baseURL,
		url,
		headers: { 'Content-Type': 'application/json' },
		params
	});
}

export async function post<TResponse, TParams = unknown, TBody = unknown>(
	url: string,
	params?: TParams,
	data?: TBody,
	baseURL?: string
): Promise<TResponse> {
	return await authenticatedRequest({
		method: 'post',
		url,
		baseURL,
		headers: { 'Content-Type': 'application/json' },
		params,
		data
	});
}

export async function put<TResponse, TParams = unknown, TBody = unknown>(
	url: string,
	params?: TParams,
	data?: TBody,
	baseURL?: string
): Promise<TResponse> {
	return await authenticatedRequest({
		method: 'put',
		url,
		baseURL,
		headers: { 'Content-Type': 'application/json' },
		params,
		data
	});
}

export async function postForm<TResponse>(
	url: string,
	data: FormData,
	baseURL?: string
): Promise<TResponse> {
	return await authenticatedRequest({
		method: 'post',
		url,
		baseURL,
		headers: { 'Content-Type': 'multipart/form-data' },
		data
	});
}

export async function putForm<TResponse, TParams = unknown, TBody = unknown>(
	url: string,
	params?: TParams,
	data?: TBody,
	baseURL?: string
): Promise<TResponse> {
	return await authenticatedRequest({
		method: 'put',
		url,
		baseURL,
		headers: { 'Content-Type': 'multipart/form-data' },
		params,
		data
	});
}

export async function postMultipart<TResponse, TParams = unknown, TBody = unknown>(
	url: string,
	params?: TParams,
	data?: TBody,
	baseURL?: string
): Promise<TResponse> {
	return await authenticatedRequest({
		method: 'post',
		url,
		baseURL,
		headers: { 'Content-Type': 'multipart/form-data' },
		params,
		data
	});
}

export async function getFile<TResponse, TParams = unknown>(
	url: string,
	params?: TParams,
	baseURL?: string
): Promise<TResponse> {
	return await authenticatedRequest({
		method: 'get',
		baseURL,
		url,
		headers: {	'Content-Type': 'application/octet-stream'
		},
		params
	});
}
