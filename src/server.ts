import { appLogger } from "@/utils/observability/logger/appLogger.js";
import { appConfig } from "@/config/readers/appConfig.js";
import express, { type Express } from "express";
import { redisClient } from "@/infrastructure/database/redis/redisClient.js";
class Server {
    private static instance: Server;
    private readonly App: Express
    private constructor() {
        this.App = express()
    }

    private async initDependencies() {
        await redisClient.connect()
    }

    public static getInstance() {
        if (!Server.instance) {
            Server.instance = new Server()
        }
        return Server.instance
    }
    public async init() {
        this.initDependencies()
        this.listen()
    }
    private listen() {
        this.App.listen(appConfig.app.port, () => {
            appLogger.info("server", `App is running at ${appConfig.app.port}`)
        })
    }
}

Server.getInstance().init()