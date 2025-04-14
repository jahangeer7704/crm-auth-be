import { z } from "zod"

export const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production']).default('development'),
    PORT: z.string().transform(Number).pipe(z.number().min(1).max(65535)),
    RABBITMQ_URI: z.string().url(),
    REDIS_HOST: z.string(),
    REDIS_PORT: z.string().transform(Number).pipe(z.number().min(1).max(65535)),
    REDIS_PASSWORD: z.string().default(''),
    X_SIGNATURE: z.string().min(1),
    X_SERVICE_KEY: z.string().min(1),
    ALLOWED_ORIGIN: z.string().url(),
    JWT_SECRET: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_REDIRECT_URI: z.string().url(),
})