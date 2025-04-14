import { Router } from "express"
import { authController } from "../controllers/auth.controller.js"
class AuthRouter {
    private static instance: AuthRouter
    private readonly router: Router
    private constructor() {
        this.router = Router()
        this.initRoutes()
    }
    private initRoutes() {
        this.router.get("/google/login",authController.googleLogin)
        this.router.get("/google/callback",authController.googleCallback)
    
    }
    public getRouter() {
        return this.router
    }

    public static getInstance() {
        if (!AuthRouter.instance) {
            AuthRouter.instance = new AuthRouter()
        }
        return AuthRouter.instance
    }

}
export const authRouter = AuthRouter.getInstance().getRouter()