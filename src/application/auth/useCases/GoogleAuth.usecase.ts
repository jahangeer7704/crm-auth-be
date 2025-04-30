import type { Request } from 'express';
import { appLogger } from '@/shared/observability/logger/appLogger.js';
import passport from "passport";
import { tokenService } from "@/shared/utils/crypto/TokenServer.js";
import { InternalServerError, NotFoundError } from '@/shared/utils/errors/ApiError.js';
import type { AuthResult } from '@/application/auth/dtos/AuthResult.dto.js';
import { userService } from '@/infrastructure/httpclients/userService.js';
import type { ICustomUser } from '@/domain/interfaces/ICustomUser.js';
import type { IUser } from '@/domain/interfaces/IUserServiceResponse.js';
export class GoogleAuthUseCase {


    public execute = (req: Request): Promise<AuthResult> => {
        appLogger.info('auth', 'GoogleAuthUseCase execution started');
        return new Promise<AuthResult>((resolve, reject) => {
            passport.authenticate(
                'google',
                { session: false },
                async (err, user: ICustomUser, info) => {
                    if (err) {
                        appLogger.error('auth', `Error during Google authentication: ${err}`);
                        return reject(new InternalServerError('GOOGLE_AUTH_ERROR'));
                    }
                    if (!user) {
                        const code = info?.message?.includes('NotFoundError')
                            ? 'USER_NOT_FOUND'
                            : 'LOGIN_FAILED';
                        appLogger.warn('auth', `Authentication failed: ${code}, info: ${info}`);
                        return reject(new InternalServerError('GOOGLE_AUTH_ERROR'));
                    }
                    try {
                        let getUser: IUser;
                        try {
                            getUser = await userService.getUser(user.email);
                        } catch (error) {
                            if (error instanceof NotFoundError) {
                                try {
                                    getUser = await userService.createUser({
                                        userName: user.name,
                                        email: user.email,
                                        isOAuth: true,
                                        avatarUrl: user.profile
                                    });

                                } catch (createUserError) {
                                    appLogger.error("usecase", `Error while creating guser: ${error}`)

                                    return reject(createUserError);
                                }
                                appLogger.info('auth', `New user created successfully: ${getUser.id}`);
                            } else {
                                appLogger.error('auth', `Unexpected error while fetching user: ${error}`);
                                return reject(new InternalServerError('USER_FETCH_FAILED'));
                            }
                        }

                        const tokens = await tokenService.generateTokens({
                            userId: getUser.id,
                            email: getUser.email,
                            isOAuth: getUser.isOAuth,
                            role: getUser.role,
                            emailVerified: getUser.emailVerified,
                            avatarUrl: getUser.avatarUrl || "",
                        });


                        resolve({
                            accessToken: tokens.accessToken,
                            refreshToken: tokens.refreshToken,
                            user: {
                                name: user.name,
                                email: user.email,
                            },
                        });
                    } catch (tokenError) {
                        appLogger.error('auth', `Error during token generation: ${tokenError}`);
                        reject(new Error('TOKEN_GENERATION_FAILED'));
                    }
                }
            )(req);
        });
    };
}

