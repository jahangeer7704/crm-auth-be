import type { Request, Response } from "express";
import { googleAuthHandler } from "@/application/auth/handlers/googleCallbackHandler.js";
import passport from "passport";
import { AsyncHandler } from "@/application/auth/handlers/asyncHandler.js";
import { SuccessResponse } from "../responses/ApiResponse.js";
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
    const authResult = await googleAuthHandler.handleCallback(req);

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

  public static getInstance() {
    if (!AuthController.instance) {
      AuthController.instance = new AuthController();
    }
    return AuthController.instance;
  }
}

export const authController = AuthController.getInstance();
