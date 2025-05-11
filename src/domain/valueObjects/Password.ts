import { appLogger } from "@/shared/observability/logger/appLogger.js";
import { UnprocessableEntityError } from "@/shared/utils/errors/ApiError.js";
import argon2 from "argon2";

export class Password {
    
    static async  compare(hash : string, password : string): Promise<boolean> {
       try {
        const match = await argon2.verify(hash,password);
        return match;
       } catch (error) {
        appLogger.error("password", `Error while comparing password: ${error}`);
        throw new UnprocessableEntityError("PASSWORD_COMPARING_ERROR");
       }
    }
    static async hash(password: string): Promise<string> {
       try {
        appLogger.info("password", `Hashing password: ${password}`);
        const hash = await argon2.hash(password);
        return hash;
       } catch (error) {
        appLogger.error("password", `Error while hashing password: ${error}`);
        throw new UnprocessableEntityError("PASSWORD_HASHING_ERROR");
       }
    }
}