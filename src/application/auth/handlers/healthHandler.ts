import type { HealthResponseDTO } from "@/application/shared/dtos/HealthResponseDTO.js";
import { healthUseCase } from "../useCases/Health.usecase.js";

class HealthHandler {
    private static instance: HealthHandler;

    private constructor() { }

    public static getInstance(): HealthHandler {
        if (!HealthHandler.instance) {
            HealthHandler.instance = new HealthHandler();
        }
        return HealthHandler.instance;
    }

    public async handle(): Promise<HealthResponseDTO> {
        return await healthUseCase.execute()
    }
}

export const healthHandler = HealthHandler.getInstance();