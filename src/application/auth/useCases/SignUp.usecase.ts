import type { LoginResponseDTO } from "@/application/auth/dtos/LoginResponseDTO.js";
import { Password } from "@/domain/valueObjects/Password.js";
import { AuthFailureError, ConflictError, InternalServerError, NotFoundError } from "@/shared/utils/errors/ApiError.js";
import { tokenService } from "@/shared/utils/crypto/TokenServer.js";
import { userService } from "@/infrastructure/httpclients/userService.js";
import type { TokenPayload } from "@/domain/interfaces/ITokenPayload.js";
import type { IUser } from "@/domain/interfaces/IUserServiceResponse.js";
import type { CreateUserCommand } from "../commands/CreateUserCommand.js";
import { appLogger } from "@/shared/observability/logger/appLogger.js";
export class CreateUser {


    public async execute(credentials: CreateUserCommand): Promise<LoginResponseDTO> {

        try {
            let user: IUser;
            try {
                await userService.checkUserExists({ email: credentials.email, userName: credentials.userName });
                try {
                    const password = await Password.hash(credentials.password);
                    user = await userService.createUser({
                        email: credentials.email,
                        isOAuth: false,
                        passwordHash: password,
                        userName: credentials.userName,
                    });

                } catch (createUserError) {
                    appLogger.error("usecase", `Error while creating in user: ${createUserError}`)

                    throw createUserError
                }
            } catch (error) {
                if (error instanceof ConflictError) {
                    appLogger.error("usecase", `User already exists: ${error}`)
                    throw error

                }
                appLogger.error("usecase", `Internal server error while checking existance: ${error}`)

                throw error
            }


            const playLoad: TokenPayload = {
                userId: user.id,
                email: user.email,
                role: user.email,
                emailVerified: !!user.avatarUrl,
                isOAuth: user.isOAuth,
                avatarUrl: user.avatarUrl,
                userName: user.userName,

            }
            const accessToken = tokenService.generateTokens(playLoad);
            return accessToken;

        } catch (error) {
            throw error
        }

    }

}