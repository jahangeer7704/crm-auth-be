export interface IAppConfig {
    app: {
        port: number,
        nodeEnv: String,
        allowedOrigin: string
    },
    auth: {
        xServiceKey: string,
        jwtSecret: string,
        xSignatureKey: string
        googleClientId: string,
        googleClientSecret: string,
        googleRedirectUri: string
    }
    db: {
        mongoUri: string;
        redisHost: string;
        redisPort: number;
        redisPassword: string;
    }
}

