import { env } from "./env.js";
import { defaultConfig } from "../constants/defaultConfig.js";
import type { IAppConfig } from "../types/IAppConfig.js";
class AppConfig {
    private static instance: AppConfig;
    public config: IAppConfig
    private constructor() {
        this.config = JSON.parse(JSON.stringify(defaultConfig))
        this.setAppConfig()
        this.setAuthConfig()
        this.setDBConfig()
    }
    public static getInstance() {
        if (!AppConfig.instance) {
            AppConfig.instance = new AppConfig()
        }
        return AppConfig.instance
    }
    private setAppConfig(): void {
        this.config.app.port = env.PORT;
        this.config.app.nodeEnv = env.NODE_ENV;
    }

    private setDBConfig(): void {
        this.config.db.mongoUri = env.MONGODB_URI;
        this.config.db.redisHost = env.REDIS_HOST;
        this.config.db.redisPort = env.REDIS_PORT;
        this.config.db.redisPassword = env.REDIS_PASSWORD;
    }

    private setAuthConfig(): void {
        this.config.auth.xSignatureKey = env.X_SIGNATURE;
        this.config.auth.xServiceKey = env.X_SERVICE_KEY;
        this.config.auth.jwtSecret = env.JWT_SECRET;
        this.config.app.allowedOrigin = env.ALLOWED_ORIGIN;
        this.config.auth.googleClientId = env.GOOGLE_CLIENT_ID;
        this.config.auth.googleClientSecret = env.GOOGLE_CLIENT_SECRET;
        this.config.auth.googleRedirectUri = env.GOOGLE_REDIRECT_URI;
    }

}

export const appConfig = AppConfig.getInstance().config
