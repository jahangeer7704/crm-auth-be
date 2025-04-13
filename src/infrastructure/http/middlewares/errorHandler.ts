import { ApiError, InternalServerError } from "@/utils/errors/ApiError.js";
import { appLogger } from "@/utils/observability/logger/appLogger.js";
import { appConfig } from "@/config/readers/appConfig.js";
import type { NextFunction, Request, Response } from "express";
import { StatusCode } from "../responses/ApiResponse.js";
export async function errorHandler(
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
) {
    if (err instanceof ApiError) {
        console.log(err);
        
        ApiError.handleError(err, res);
    } else {
        appLogger.error('g-error', JSON.stringify(err));
        if (appConfig.app.nodeEnv === 'development') {
            return res.status(StatusCode.INTERNAL_SERVER_ERROR).send(err);
        }

        ApiError.handleError(new InternalServerError(), res);
    }
}
