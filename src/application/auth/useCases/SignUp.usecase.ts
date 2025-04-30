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
                user = await userService.getUser(credentials.email);
                if (user)
                    throw new ConflictError("USER_MAIL_ALREADY_EXISTS");
                user = await userService.getUser(credentials.userName);
                if (user)
                    throw new ConflictError("USER_NAME_ALREADY_EXISTS");
            } catch (error) {
                if (error instanceof NotFoundError) {
                    try {
                        const password = await Password.hash(credentials.password);
                        user = await userService.createUser({
                            email: credentials.email,
                            isOAuth: false,
                            passwordHash: password,
                            userName: credentials.userName,
                        });

                    } catch (createUserError) {
                        appLogger.error("usecase", `Error while creating in user: ${error}`)

                        throw createUserError
                    }
                    appLogger.info('auth', `New user created successfully: ${user.id}`);
                } else {
                    appLogger.error('auth', `Unexpected error while fetching user: ${error}`);
                    throw error
                }
            }


            const playLoad: TokenPayload = {
                userId: user.id,
                email: user.email,
                role: user.email,
                emailVerified: !!user.avatarUrl,
                isOAuth: user.isOAuth,
                avatarUrl: user.avatarUrl,

            }
            const accessToken = tokenService.generateTokens(playLoad);
            return accessToken;

        } catch (error) {
            throw error
        }

    }

}