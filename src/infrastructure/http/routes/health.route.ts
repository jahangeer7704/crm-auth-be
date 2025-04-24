import { Router } from "express"
import { healthController } from "../controllers/health.controller.js"
import { LoginAttempts } from "@/shared/observability/metrics.js"
class HealthRouter {
    private static instance: HealthRouter
    private readonly router: Router
    private constructor() {
        this.router = Router()
        this.initRoutes()
    }
    private initRoutes() {
        
        this.router.get("/",healthController.control)
    }
    public getRouter() {
        return this.router
    }

    public static getInstance() {
        if (!HealthRouter.instance) {
            HealthRouter.instance = new HealthRouter()
        }
        return HealthRouter.instance
    }

}
export const healthRouter=HealthRouter.getInstance().getRouter()

