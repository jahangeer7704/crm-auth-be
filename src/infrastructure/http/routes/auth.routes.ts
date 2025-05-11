import { Router } from "express"
import { AuthController } from "../controllers/auth.controller.js"
import { authenticationMiddleware } from "../middlewares/auth.middleware.js"
class AuthRouter {
    private static instance: AuthRouter
    private readonly router: Router
    private readonly authController: AuthController = new AuthController()
    private constructor() {
        this.router = Router()
        this.initRoutes()
    }
    private initRoutes() {
        this.router.get("/google/login", this.authController.googleLogin)
        this.router.get("/google/callback", this.authController.googleCallback)

        this.router.post("/login", authenticationMiddleware.authenticate, this.authController.jwtLogin)
        this.router.post("/signup", authenticationMiddleware.authenticate, this.authController.jwtCreate)
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