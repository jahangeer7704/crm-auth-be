import { appLogger } from "@/utils/observability/logger/appLogger.js";
import { appConfig } from "@/config/readers/appConfig.js";
import express, { type Express } from "express";
import { redisClient } from "@/infrastructure/database/redis/redisClient.js";
import { ActiveSessions, authRequestDuration, LoginAttempts } from "@/utils/observability/metrics.js";
import { errorHandler } from "./infrastructure/http/middlewares/errorHandler.js";
import { AsyncHandler } from "./application/auth/handlers/asyncHandler.js";
import { morganMiddleware } from "./utils/observability/logger/httpLogger.js";
import { ApiError, InternalServerError } from "./utils/errors/ApiError.js";

class Server {
    private static instance: Server;
    private readonly app: Express
    private constructor() {
        this.app = express()
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
         this.initDependencies().then(async()=> {
        this.handleProcessSignals();
        this.handleMiddleWares();
        this.handleRoutes();
        this.handleErrors();
        this.listen();})
    }
    private handleMiddleWares() {
        this.app.use(morganMiddleware)
    }

    private handleRoutes() {
        // this.app.use('/metrics', metricsRouter)
        this.app.get("/",AsyncHandler(async(req,res)=>{
            throw new InternalServerError()
        }))
    }
    private handleErrors(): void {
        this.app.use(errorHandler);
    }
    
    private handleProcessSignals(): void {
        process.on('SIGTERM', () => {
            redisClient.getClient().quit()
            appLogger.info("redis", "Successfully disconnected.");
            appLogger.info('event ', 'SIGTERM received. Shutting down gracefully.');
            process.exit();
        });

        process.on('SIGINT', () => {
            redisClient.getClient().quit()
            appLogger.info("redis", "Successfully disconnected.");
            appLogger.info(
                'event ', 'SIGINT (Ctrl+C) received. Shutting down gracefully.'
            );
            process.exit();
        });

        process.on('uncaughtException', (err: Error) => {
            appLogger.error('process ', `Uncaught exception: ${err.message}`);
        });
     
    }
    private listen() {
        this.app.listen(appConfig.app.port, () => {
            appLogger.info("server", `App is running at ${appConfig.app.port}`)
        })
    }
}


Server.getInstance().init()


