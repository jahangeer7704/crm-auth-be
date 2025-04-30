import { ApiError, InternalServerError } from "@/shared/utils/errors/ApiError.js";
import { appLogger } from "@/shared/observability/logger/appLogger.js";
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
        appLogger.error('global-error', JSON.stringify(err));

        ApiError.handleError(err, res);
    } else {
        appLogger.error('global-error-uk', JSON.stringify(err));
        if (appConfig.app.nodeEnv === 'development') {
            return res.status(StatusCode.INTERNAL_SERVER_ERROR).send(err);
        }

        ApiError.handleError(new InternalServerError(), res);
    }
}
