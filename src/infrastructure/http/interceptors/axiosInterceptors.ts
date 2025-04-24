import axios, { Axios, type AxiosRequestConfig } from "axios"
class AxiosRequest {
    private static instance: AxiosRequest
    private readonly axiosInstance: Axios
    private constructor() {
        this.axiosInstance = axios.create()
    }
    public static getInstance() {
        if (!AxiosRequest.instance) {
            AxiosRequest.instance = new AxiosRequest()
        }
        return AxiosRequest.instance
    }
    private request(config:AxiosRequestConfig){
        
    }

    }