import type { Request, Response, NextFunction } from "express";
import { GoogleAuthHandler } from "@/application/auth/handlers/googleCallbackHandler.js";
import passport from "passport";
class AuthController {
  private static instance: AuthController
  private constructor() { }

  public googleLogin = passport.authenticate('google', {
    accessType: 'offline',
    scope: ['profile', 'email'],
    prompt: 'select_account',
    session: false,
  });

  public googleCallback = (req: Request, res: Response, next: NextFunction) => {
    GoogleAuthHandler.handleCallback(req, res, next);
  };

  public static getInstance() {
    if (!AuthController.instance) {
      AuthController.instance = new AuthController();
    }
    return AuthController.instance;
  }
}

export const authController = AuthController.getInstance();
