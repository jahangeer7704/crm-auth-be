import { Router } from "express"
class IndexRouter {
    private static instance: IndexRouter
    private readonly router: Router
    private constructor() {
        this.router = Router()
        this.initRoutes()
    }
    private initRoutes() {
        this.router.use("/health",)
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