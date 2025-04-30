import axios, { Axios, type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from "axios"
class AxiosRequest {
    private static instance: AxiosRequest
    private readonly axiosInstance: AxiosInstance
    private constructor() {
        this.axiosInstance = axios.create()
    }
    public static getInstance() {
        if (!AxiosRequest.instance) {
            AxiosRequest.instance = new AxiosRequest()
        }
        return AxiosRequest.instance
    }
    public async request(config: AxiosRequestConfig): Promise<AxiosResponse<any, any>> {
        return await this.axiosInstance(config)
    }

}
export const axiosRequest = AxiosRequest.getInstance()