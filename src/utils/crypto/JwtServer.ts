import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import argon2 from 'argon2';
import { redisClient } from '@/infrastructure/database/redis/redisClient.js';
import { appConfig } from '@/config/readers/appConfig.js';
export class TokenService {
    async generateTokens(payload: any) {
        const accessToken = jwt.sign(
            payload,
            appConfig.auth.jwtSecret,
            { expiresIn: '15m' }
        );

        const refreshToken = crypto.randomBytes(64).toString('hex');
        const hashedToken = await argon2.hash(refreshToken);

        // Store in Redis
        await redisClient.set(
            `refresh:${payload.userId}:${crypto.randomUUID()}`,
            hashedToken,
            7 * 24 * 60 * 60
        );

        return { accessToken, refreshToken };
    }
}