import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import argon2 from 'argon2';
import { redisClient } from '@/infrastructure/database/redis/redisClient.js';
import { appConfig } from '../../../../../crm-auth-be/src/config/readers/appConfig.js';
import { appLogger } from '../../observability/logger/appLogger.js';
import { UnprocessableEntityError } from '../errors/ApiError.js';

import type { LoginRequestDTO } from '../../../../../crm-auth-be/src/application/auth/dtos/LoginRequestDTO.js';
import type { LoginResponseDTO } from '../../../../../crm-auth-be/src/application/auth/dtos/LoginResponseDTO.js';
import type { TokenPayload } from '@/domain/interfaces/ITokenPayload.js';
class TokenService {
    private static instance: TokenService;
    private constructor() { }
    public static getInstance(): TokenService {
        if (!TokenService.instance) {
            TokenService.instance = new TokenService();
        }
        return TokenService.instance;
    }
    public async generateTokens(payload: TokenPayload): Promise<LoginResponseDTO> {
        try {
            await TokenService.instance.deleteUserTokens(payload.userId);
            return await TokenService.instance.createAndStoreTokens(payload.userId, payload);
        } catch (error) {
            appLogger.error('token-service', `Error generating tokens: ${error}`);
            throw new UnprocessableEntityError('Failed to generate tokens');
        }
    }

    public async rotateRefreshToken(userId: string, incomingRefreshToken: string) {
        try {
            const keys = await this.getUserRefreshKeys(userId);

            for (const key of keys) {
                const hashedToken = await redisClient.get(key);
                if (hashedToken && await argon2.verify(hashedToken, incomingRefreshToken)) {
                    await redisClient.delete(key);
                    return await this.createAndStoreTokens(userId, { userId });
                }
            }

            throw new Error('Invalid or expired refresh token');
        } catch (error) {
            appLogger.error('token-service', `Error rotating refresh token: ${error}`);
            throw new UnprocessableEntityError('Failed to rotate refresh token');
        }
    }

    private async createAndStoreTokens(userId: string, payload: any) {
        const accessToken = jwt.sign(payload, appConfig.auth.jwtSecret, { expiresIn: '5m' });
        const refreshToken = crypto.randomBytes(64).toString('hex');
        const hashedToken = await argon2.hash(refreshToken);
        const redisKey = `refresh:${userId}:${crypto.randomUUID()}`;

        await redisClient.set(redisKey, hashedToken, 7 * 24 * 60 * 60);
        return { accessToken, refreshToken };
    }

    private async getUserRefreshKeys(userId: string): Promise<string[]> {
        const pattern = `refresh:${userId}:*`;
        const keys: string[] = [];
        let cursor = '0';

        do {
            const [nextCursor, foundKeys] = await redisClient.getClient().scan(cursor, 'MATCH', pattern, 'COUNT', 100);

            keys.push(...foundKeys);
            cursor = nextCursor;
        } while (cursor !== '0');
        return keys;
    }





    private async deleteUserTokens(userId: string): Promise<void> {
        const keys = await this.getUserRefreshKeys(userId);
        if (keys?.length > 0) {
            await redisClient.delete(...keys);
        }
    }
}

export const tokenService = TokenService.getInstance();