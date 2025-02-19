import axiosInstance from "@/libs/axios";

export const fetcher = (url:string) => axiosInstance.get(url).then(res => res.data)
