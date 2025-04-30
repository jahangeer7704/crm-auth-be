import { appConfig } from "@/config/readers/appConfig.js";
import { appLogger } from "@/shared/observability/logger/appLogger.js";
import { InternalServerError, NotFoundError } from "@/shared/utils/errors/ApiError.js";
import type { AxiosRequestConfig } from "axios";
import { axiosRequest } from "../http/interceptors/axiosInterceptors.js";
import type { IUserServiceCreate } from "@/domain/interfaces/IUserServiceCreate.js";
import type { IUser } from "@/domain/interfaces/IUserServiceResponse.js";

class UserService {
    private static instance: UserService;
    private readonly userServiceUrl: string = appConfig.auth.clientUrl;
    private readonly serviceKey: string = appConfig.auth.xServiceKey;

    private constructor() { }

    public static getInstance() {
        if (!UserService.instance) {
            UserService.instance = new UserService();
        }
        return UserService.instance;
    }
    public async getUser(userNameOrEmail: string): Promise<IUser | any> {
        const url = `${this.userServiceUrl}/api/users/${userNameOrEmail}`;
        try {
            const config: AxiosRequestConfig = {
                method: "GET",
                url,
                headers: {
                    "Content-Type": "application/json",
                    "x-service": this.serviceKey,
                },
            };
            const response = await axiosRequest.request(config);
            return response?.data?.data;
        } catch (error: any) {
            if (error?.response?.status === 404) {
                appLogger.warn("userService", `User not found: ${userNameOrEmail}`);
                throw new NotFoundError("User not found");
            }

            appLogger.error("userService", `Error fetching user by userName: ${error}`);
            throw new InternalServerError("USER_SERVICE_ERROR");
        }
    }




    public async createUser(user: IUserServiceCreate): Promise<IUser | any> {
        const url = `${this.userServiceUrl}/api/users`;
        try {
            const config: AxiosRequestConfig = {
                method: "POST",
                url,
                data: user,
                headers: {
                    "Content-Type": "application/json",
                    "x-service": this.serviceKey,
                },
            };
            const response = await axiosRequest.request(config);
            return response?.data?.data;
        } catch (error) {
            appLogger.error("userService", `Error creating user: ${error}`);
            throw new InternalServerError("USER_SERVICE_ERROR");
        }
    }
}

export const userService = UserService.getInstance();
