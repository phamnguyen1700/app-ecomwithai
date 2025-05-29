import { HTTP_CONTENT_TYPE } from "@/constants/httpUtil";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const httpRequest = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: false,
    headers: {
        "Content-Type": HTTP_CONTENT_TYPE,
    },
});

export const get = async <T = unknown>(
  url: string,
  option: AxiosRequestConfig = {}
): Promise<T> => {
  const res: AxiosResponse<T> = await httpRequest.get(url, option);
  return res.data;
};

export const post = async <T = unknown>(
  url: string,
  data: unknown = {},
  option: AxiosRequestConfig = {}
): Promise<T> => {
  const res: AxiosResponse<T> = await httpRequest.post(url, data, option);
  return res.data;
};

export const put = async <T = unknown>(
  url: string,
  data: unknown = {},
  option: AxiosRequestConfig = {}
): Promise<T> => {
  const res: AxiosResponse<T> = await httpRequest.put(url, data, option);
  return res.data;
};

export const remove = async <T = unknown>(
  url: string,
  option: AxiosRequestConfig = {}
): Promise<T> => {
  const res: AxiosResponse<T> = await httpRequest.delete(url, option);
  return res.data;
};
