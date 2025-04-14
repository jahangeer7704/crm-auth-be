import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import argon2 from 'argon2';
import { redisClient } from '@/infrastructure/database/redis/redisClient.js';
import { appConfig } from '@/config/readers/appConfig.js';
import type { LoginResponseDTO } from '@/application/shared/dtos/LoginRequestDTO.js';
export class TokenService {
    static async generateTokens(payload: any) : Promise<LoginResponseDTO> {
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