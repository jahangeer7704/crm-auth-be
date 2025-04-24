import { AsyncHandler } from "@/infrastructure/http/middlewares/asyncHandler.js";
import type { Request, Response } from "express";
import { SuccessResponse } from "../responses/ApiResponse.js";
import { LoginAttempts } from "@/shared/observability/metrics.js";
import type { HealthResponseDTO } from "@/application/shared/dtos/HealthResponseDTO.js";
import { healthUseCase } from "@/application/auth/useCases/Health.usecase.js";

class HealthController {
    private static instance: HealthController
    private constructor() { }
    public control = AsyncHandler(async (_req: Request, res: Response) => {
        LoginAttempts.inc({status:"success"});
        const healthReport :HealthResponseDTO= await healthUseCase.execute()
        return new SuccessResponse("Health check successful", healthReport).send(res)
    })

    public static getInstance() {
        if (!HealthController.instance) {
            HealthController.instance = new HealthController()
        }
        return HealthController.instance
    }
}

export const healthController = HealthController.getInstance()