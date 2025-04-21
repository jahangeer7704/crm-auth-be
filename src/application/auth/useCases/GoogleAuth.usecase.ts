import type { Request } from 'express';
import { appLogger } from '@/utils/observability/logger/appLogger.js';
import passport from "passport";
import { tokenService } from "@/utils/crypto/TokenServer.js";
import { InternalServerError } from '@/utils/errors/ApiError.js';
import type { AuthResult } from '@/application/shared/dtos/AuthResult.dto.js';
class GoogleAuthUseCase {
    private static instance: GoogleAuthUseCase;
    private constructor() { }
    public static getInstance() {
        if (!GoogleAuthUseCase.instance) {
            GoogleAuthUseCase.instance = new GoogleAuthUseCase();
        }
        return GoogleAuthUseCase.instance;
    }
    public execute = (req: Request): Promise<AuthResult> => {
        appLogger.info('auth', 'GoogleAuthUseCase execution started');
        return new Promise<AuthResult>((resolve, reject) => {
            passport.authenticate(
                'google',
                { session: false },
                async (err, user, info) => {
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
                        appLogger.info('auth', `Generating tokens for authenticated user: ${user.gid}`);

                        const tokens = await tokenService.generateTokens({
                            userId: user.gid,
                            email: user.email,
                        });

                        appLogger.info('auth', `Tokens generated successfully for user: ${user.gid}`);
                        resolve({
                            accessToken: tokens.accessToken,
                            refreshToken: tokens.refreshToken,
                            user: {
                                gid: user.gid,
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

export const googleAuthUseCase = GoogleAuthUseCase.getInstance();
