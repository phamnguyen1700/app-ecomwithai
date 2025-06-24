import { AxiosRequestConfig, AxiosResponse } from "axios";
import http from "./axiosInterceptor";

export const get = async <T = unknown>(
    url: string,
    option: AxiosRequestConfig = {}
): Promise<AxiosResponse<T>> => {
    const res: AxiosResponse<T> = await http.get(url, option);
    return res;
};

export const post = async <T = unknown>(
    url: string,
    data: unknown = {},
    option: AxiosRequestConfig = {}
): Promise<AxiosResponse<T>> => {
    const res: AxiosResponse<T> = await http.post(url, data, option);
    return res;
};

export const put = async <T = unknown>(
    url: string,
    data: unknown = {},
    option: AxiosRequestConfig = {}
): Promise<AxiosResponse<T>> => {
    const res: AxiosResponse<T> = await http.put(url, data, option);
    return res;
};

export const remove = async <T = unknown>(
    url: string,
    option: AxiosRequestConfig = {}
): Promise<AxiosResponse<T>> => {
    const res: AxiosResponse<T> = await http.delete(url, option);
    return res;
};

export const patch = async <T = unknown>(
    url: string,
    data: unknown = {},
    option: AxiosRequestConfig = {}
): Promise<AxiosResponse<T>> => {
    const res: AxiosResponse<T> = await http.patch(url, data, option);
    return res;
};