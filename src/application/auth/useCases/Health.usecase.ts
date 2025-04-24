import { HealthResponseDTO } from "@/application/shared/dtos/HealthResponseDTO.js";
import { UnprocessableEntityError } from "@/shared/utils/errors/ApiError.js";
import { appLogger } from "@/shared/observability/logger/appLogger.js";

class HealthUseCase {
    private static instance: HealthUseCase;

    private constructor() { }

    public static getInstance(): HealthUseCase {
        if (!HealthUseCase.instance) {
            HealthUseCase.instance = new HealthUseCase();
        }
        return HealthUseCase.instance;
    }

    public async execute(): Promise<HealthResponseDTO> {
        try {
            const uptime = process.uptime();
            const timestamp = new Date().toISOString()
            appLogger.info("health", `Health check successful: uptime ${uptime}, timestamp ${timestamp}`);
            return new HealthResponseDTO({ uptime, timestamp });
        } catch (error) {
            appLogger.error("health", `Error processing health check: ${error}`);
            throw new UnprocessableEntityError("Error processing health check");
        }

    }
}
export const healthUseCase = HealthUseCase.getInstance();