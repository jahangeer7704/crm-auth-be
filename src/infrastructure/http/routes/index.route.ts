import { Router } from "express"
import { healthRouter } from "./health.route.js"
import { authRouter } from "./auth.routes.js"
import metricsRouter from "./metrics.route.js"
class IndexRouter {
    private static instance: IndexRouter
    private readonly router: Router
    private constructor() {
        this.router = Router()
        this.initRoutes()
    }
    private initRoutes() {
        this.router.use("/health",healthRouter)
        this.router.use("/metrics",metricsRouter)
        this.router.use("/auth", authRouter)
    }
    public getRouter() {
        return this.router
    }

    public static getInstance() {
        if (!IndexRouter.instance) {
            IndexRouter.instance = new IndexRouter()
        }
        return IndexRouter.instance
    }

}
export const indexRouter = IndexRouter.getInstance().getRouter()