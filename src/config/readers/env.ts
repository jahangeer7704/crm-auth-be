import { z } from "zod";
import dotenv from "dotenv";
import { appLogger } from "@/shared/observability/logger/appLogger.js";
import { envSchema } from "./schemas/envSchema.js";

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

class EnvValidator {
    private static instance: EnvValidator;
    private readonly env: z.infer<typeof envSchema>;
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
        const validateEnv = envSchema.safeParse(process.env)
        if (!validateEnv.success) {
            appLogger.error("ENV_VALIDATOR", `Invalid environment variables ${validateEnv.error.errors
                .map((e) => `${e.path.join('.')}: ${e.message}`)
                .join(', ')}`)
            process.exit(1)
        }
        return validateEnv.data
    }
    public init(): z.infer<typeof envSchema> {
        return this.env
    }
}
export const env = EnvValidator.getInstance().init()