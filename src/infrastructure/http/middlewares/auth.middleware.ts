import { appConfig } from "@/config/readers/appConfig.js"
import { UnauthorizedError } from "@/shared/utils/errors/ApiError.js"
import type { Request, Response, NextFunction } from "express"
import { AsyncHandler } from "./asyncHandler.js"

class AuthenticationMiddleware {
    private static instance: AuthenticationMiddleware
    private constructor() { }
    public static getInstance(): AuthenticationMiddleware {
        if (!AuthenticationMiddleware.instance) {
            AuthenticationMiddleware.instance = new AuthenticationMiddleware()
        }
        return AuthenticationMiddleware.instance
    }

    public authenticate = AsyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
        const signature = req.headers['x-service'] as string
        if (!signature) {
            throw new UnauthorizedError('Missing x-service header')
        }
       
        
        try {
            if (signature=== appConfig.auth.xServiceKey)
                next()
            else
                throw new UnauthorizedError('Invalid x-service header')
        } catch (err) {
            throw err
        }
    })
}

export const authenticationMiddleware = AuthenticationMiddleware.getInstance()