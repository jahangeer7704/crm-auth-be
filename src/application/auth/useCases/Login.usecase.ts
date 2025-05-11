import type { LoginResponseDTO } from "@/application/auth/dtos/LoginResponseDTO.js";
import { Password } from "@/domain/valueObjects/Password.js";
import { AuthFailureError } from "@/shared/utils/errors/ApiError.js";
import { tokenService } from "@/shared/utils/crypto/TokenServer.js";
import { LoginCommand } from "../commands/LoginCommand.js";
import { userService } from "@/infrastructure/httpclients/userService.js";
import type { TokenPayload } from "@/domain/interfaces/ITokenPayload.js";
import type { IUser } from "@/domain/interfaces/IUserServiceResponse.js";
import { z } from "zod";
export class LoginUseCase {


    public async execute(credentials: LoginCommand): Promise<LoginResponseDTO> {



        try {
            const isEmail = z.string().email().safeParse(credentials.emailOrUserName).success;

            let user: IUser;

            if (isEmail) {
                user = await userService.getUserByEmail(credentials.emailOrUserName);
            } else {
                user = await userService.getUserByUserName(credentials.emailOrUserName);
            }
            if (!user) {
                throw new AuthFailureError("USER_NOT_FOUND");
            }
            const isPasswordValid = await Password.compare(user.passwordHash as string, credentials.password,);
            if (!isPasswordValid) {
                throw new AuthFailureError("INVALID_PASSWORD");
            }
            const payload: TokenPayload = {
                userId: user.id,
                email: user.email,
                role: user.role,
                emailVerified: !!user.avatarUrl,
                isOAuth: user.isOAuth,
                avatarUrl: user.avatarUrl,
                userName: user.userName,
            }
            
            const accessToken = tokenService.generateTokens(payload);
            return accessToken;

        } catch (error) {
            throw error
        }

    }

}