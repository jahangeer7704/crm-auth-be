import { Router } from "express"
class HealthRouter {
    private static instance: HealthRouter
    private readonly router: Router
    private constructor() {
        this.router = Router()
        this.initRoutes()
    }
    private initRoutes() {
        this.router.get("/",)
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
export const healthRouter = HealthRouter.getInstance().getRouter()