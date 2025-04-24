import { Redis } from "ioredis"
import { appLogger } from "@/shared/observability/logger/appLogger.js"
import { appConfig } from "@/config/readers/appConfig.js"
class RedisClient {
    private static instance: RedisClient;
    private readonly redisClient: Redis
    private isConnected = false;
    private constructor() {
        this.redisClient = new Redis({
            host: appConfig.db.redisHost,
            port: appConfig.db.redisPort,
            password: appConfig.db.redisPassword
        })
        this.redisClient.on("connect", () => {
            appLogger.info("redis", "Server connected successfully")
        })
        this.redisClient.on("error", (err: Error) => {
            appLogger.error("redis", `Server connection Error : ${err.message}`)
            appLogger.error("redis", `Server Error details : ${err.stack}`)
        })
    }
    public static getInstance() {
        if (!RedisClient.instance) {
            RedisClient.instance = new RedisClient()
        }
        return RedisClient.instance
    }
    public async connect(): Promise<void> {
        if (this.isConnected) return;

        try {
            await this.redisClient.ping(); // test the connection
            this.isConnected = true;
            appLogger.info("redis", "Ping success. Redis connection is active.");
        } catch (err) {
            appLogger.error("redis", "Redis ping failed during connect().");
            throw err;
        }
    }

    public getClient(): Redis {
        return this.redisClient
    }


    public async set(key: string, value: any, expiry?: number): Promise<void> {
        try {
            if (typeof value === 'object') {
                value = JSON.stringify(value);
            }
            if (typeof expiry === 'number') {
                await this.redisClient.set(key, value, 'EX', expiry)
            } else {
                await this.redisClient.set(key, value)
            }
            appLogger.info("redis", `Value is set for the key : ${key}`)

        } catch (error) {
            appLogger.error("redis", `Error on setting  value for key : ${key}`)

        }
    }
    public async get(key: string): Promise<any | null> {
        const value = await this.redisClient.get(key)
        try {
            if (value) {
                return value;
            }

            return null
        } catch (error) {
            appLogger.error("redis", `Error on getting  value for key : ${key}`)
            return null

        }
    }
    public async delete(...keys: string[]): Promise<void> {
        try {
            await this.redisClient.del(...keys);
            appLogger.info("redis", `Keys removed: ${keys.join(", ")}`)

        } catch (error) {
            appLogger.error("redis", `Error on removing  key : ${keys}`)
        }
    }

    public async publish(key: string, value: any): Promise<number> {
        if (typeof value !== 'string') {
            value = JSON.stringify(value);
        }
        const result = await this.redisClient.publish(key, value);
        return result;
    }

}
export const redisClient = RedisClient.getInstance()