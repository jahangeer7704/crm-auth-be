import type { LoginResponseDTO } from "@/application/auth/dtos/LoginResponseDTO.js";
import { rabbitMQClient } from "@/infrastructure/messaging/rabbitmq/rabbitmqClient.js"
import { appLogger } from "@/shared/observability/logger/appLogger.js";
import { Password } from "@/domain/valueObjects/Password.js";
import { AuthFailureError } from "@/shared/utils/errors/ApiError.js";
import { tokenService } from "@/shared/utils/crypto/TokenServer.js";
import { LoginCommand } from "../commands/LoginCommand.js";
 class LoginUseCase {
    private static instance: LoginUseCase;

    private constructor() { }

    public static getInstance(): LoginUseCase {
        if (!LoginUseCase.instance) {
            LoginUseCase.instance = new LoginUseCase();
        }
        return LoginUseCase.instance;
    }

    public async execute(credentials:LoginCommand): Promise<LoginResponseDTO> {

        try {

        } catch (error) {

        }

    }

}
export const loginUseCase=LoginUseCase.getInstance()