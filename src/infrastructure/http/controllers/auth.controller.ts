import type { Request, Response } from "express";
import passport from "passport";
import { AsyncHandler } from "@/application/auth/handlers/asyncHandler.js";
import { SuccessResponse } from "../responses/ApiResponse.js";
import { loginHandler } from "@/application/auth/handlers/LoginHandler.js";
import { LoginCommand } from "@/application/auth/commands/LoginCommand.js";
import type { LoginRequestDTO } from "@/application/shared/dtos/LoginRequestDTO.js";
class AuthController {
  private static instance: AuthController
  private constructor() { }

  public googleLogin = passport.authenticate('google', {
    accessType: 'offline',
    scope: ['profile', 'email'],
    prompt: 'select_account',
    session: false,
  });

  public googleCallback = AsyncHandler(async (req: Request, res: Response) => {
    const authResult = await loginHandler.handleGoogleAuth(req);

    res.cookie('jk_crm', authResult.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.header("Authorization", `Bearer ${authResult.accessToken}`);
    return new SuccessResponse(
      "Login successful").send(res)
  });

  public jwtCallBack = AsyncHandler(async (req: Request, res: Response) => {
    const loginRequest:LoginRequestDTO= req.body;

    const command= new LoginCommand(loginRequest.emailOrName,loginRequest.password)

    const authResult=await loginHandler.handleJwtAuth(command)
  });

  public static getInstance() {
    if (!AuthController.instance) {
      AuthController.instance = new AuthController();
    }
    return AuthController.instance;
  }

  public async handleLogin(req: Request, res: Response) {


    return new SuccessResponse("Login successful")

  }
}

export const authController = AuthController.getInstance();
