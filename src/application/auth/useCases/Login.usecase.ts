import type { LoginResponseDTO } from "@/application/auth/dtos/LoginResponseDTO.js";
import { Password } from "@/domain/valueObjects/Password.js";
import { AuthFailureError } from "@/shared/utils/errors/ApiError.js";
import { tokenService } from "@/shared/utils/crypto/TokenServer.js";
import { LoginCommand } from "../commands/LoginCommand.js";
import { userService } from "@/infrastructure/httpclients/userService.js";
import type { TokenPayload } from "@/domain/interfaces/ITokenPayload.js";
import type { IUser } from "@/domain/interfaces/IUserServiceResponse.js";
export class LoginUseCase {
   

    public async execute(credentials: LoginCommand): Promise<LoginResponseDTO> {

        try {
            const user: IUser = await userService.getUser(credentials.emailOrUserName);
            if (!user) {
                throw new AuthFailureError("USER_NOT_FOUND");
            }
            const isPasswordValid = await Password.compare(credentials.password, user.passwordHash as string);
            if (!isPasswordValid) {
                throw new AuthFailureError("INVALID_PASSWORD");
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