import { appConfig } from "@/config/readers/appConfig.js";
import { appLogger } from "@/shared/observability/logger/appLogger.js";
import { ConflictError, InternalServerError, NotFoundError } from "@/shared/utils/errors/ApiError.js";
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
    private async fetchUser(endpoint: string): Promise<IUser> {
        const url = `${this.userServiceUrl}/api/users/${endpoint}`;
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
                appLogger.warn("userService", `User not found: ${endpoint}`);
                throw new NotFoundError("User not found");
            }
            appLogger.error("userService", `Error fetching user from ${endpoint}: ${error}`);
            throw new InternalServerError("USER_SERVICE_ERROR");
        }
    }
    public async checkUserExists(params: { userName?: string; email?: string }): Promise<void> {
        const url = `${this.userServiceUrl}/api/users`;
        try {
            const config: AxiosRequestConfig = {
                method: "GET",
                url,
                headers: {
                    "Content-Type": "application/json",
                    "x-service": this.serviceKey,
                },
                params: {
                    userName: params.userName,
                    email: params.email
                }
            };

            await axiosRequest.request(config);

            return;

        } catch (error: any) {
            if (error?.status === 409) {
                appLogger.warn("userService", `User already exists: ${params.userName || params.email}`);
                throw new ConflictError(error?.response?.data?.message || "User already exists");
            }

            appLogger.error("userService", `Error checking user existence: ${error}`);
            throw new InternalServerError("USER_SERVICE_ERROR");
        }
    }

    public async getUserByEmail(email: string): Promise<IUser> {
        return this.fetchUser(`email/${encodeURIComponent(email)}`);
    }

    public async getUserByUserName(userName: string): Promise<IUser> {
        return this.fetchUser(`username/${encodeURIComponent(userName)}`);
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
