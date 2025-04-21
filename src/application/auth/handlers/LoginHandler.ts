import { googleAuthUseCase } from "../useCases/GoogleAuth.usecase.js";
import type { Request } from "express";
import { loginUseCase } from "../useCases/Login.usecase.js";
import type { LoginCommand } from "../commands/LoginCommand.js";

class LoginHandler {
    public static instance: LoginHandler
    private constructor() {
    }
    public static getInstance(): LoginHandler {
        if (!LoginHandler.instance) {
            LoginHandler.instance = new LoginHandler()
        }
        return LoginHandler.instance
    }
    public handleJwtAuth(credentials: LoginCommand) {
        return loginUseCase.execute(credentials)
    }

    public handleGoogleAuth(req: Request) {
        return googleAuthUseCase.execute(req);
    }

}
export const loginHandler = LoginHandler.getInstance()