import { appLogger } from "@/utils/observability/logger/appLogger.js";
import { appConfig } from "@/config/readers/appConfig.js";
import express, { type Express } from "express";
class Server {
    private static instance: Server;
    private readonly App: Express
    private constructor() {
        this.App = express()
    }
    public static getInstance() {
        if (!Server.instance) {
            Server.instance = new Server()
        }
        return Server.instance
    }
    public init() {
        this.listen()
    }
    private listen() {
        this.App.listen(appConfig.app.port, () => {
            appLogger.info("server", `App is running at ${appConfig.app.port}`)
        })
    }
}

Server.getInstance().init()