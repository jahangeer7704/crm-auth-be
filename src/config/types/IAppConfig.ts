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
        googleRedirectUri: string,
        clientUrl: string
    }
    db: {
        redisHost: string;
        redisPort: number;
        redisPassword: string;
    }
    mq : {
        rabbitUri : string;
        queue : string;
    }
}

