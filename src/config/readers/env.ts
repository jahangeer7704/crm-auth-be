import { z } from "zod";
import dotenv from "dotenv";
import { appLogger } from "@/utils/observability/logger/appLogger.js";

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

class EnvValidator {
    private static instance: EnvValidator;
    private readonly env: z.infer<typeof EnvValidator.envSchema>;
    private static envSchema = z.object({
        NODE_ENV: z.enum(['development', 'production']).default('development'),
        PORT: z.string().transform(Number).pipe(z.number().min(1).max(65535)),
        MONGODB_URI: z.string().url(),
        REDIS_HOST: z.string(),
        REDIS_PORT: z.string().transform(Number),
        REDIS_PASSWORD: z.string().default(''),
        X_SIGNATURE: z.string().min(1),
        X_SERVICE_KEY: z.string().min(1),
        ALLOWED_ORIGIN: z.string().url(),
        JWT_SECRET: z.string().min(1),
        RABBITMQ_URL : z.string().url()
    })
    private constructor() {
        this.env = this.validator();

    };
    public static getInstance() {
        if (!EnvValidator.instance) {
            EnvValidator.instance = new EnvValidator()
        }
        return EnvValidator.instance
    }
    private validator() {
        const validateEnv = EnvValidator.envSchema.safeParse(process.env)
        if (!validateEnv.success) {
            appLogger.error("ENV_VALIDATOR", `Invalid environment variables ${validateEnv.error.errors
                .map((e) => `${e.path.join('.')}: ${e.message}`)
                .join(', ')}`)
            process.exit(1)
        }
        return validateEnv.data
    }
    public init(): z.infer<typeof EnvValidator.envSchema> {
        return this.env
    }
}
export const env = EnvValidator.getInstance().init()