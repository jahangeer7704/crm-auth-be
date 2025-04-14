import type { Request, Response, NextFunction } from "express";
import passport from "passport";
import { appConfig } from "@/config/readers/appConfig.js";
import { appLogger } from "@/utils/observability/logger/appLogger.js";


export class GoogleAuthHandler {
  public static handleCallback(req: Request, res: Response, next: NextFunction) {
    passport.authenticate(
      'google',{
        session: false,
      },
      (err: Error | null, user: Record<string, any>, info: any) => {
        if (err) {
          appLogger.error('auth', `Error during Google authentication: ${err}`);
          return GoogleAuthHandler.redirectWithMessage(res, 'login+failed');
        }

        if (!user) {
          const message = info?.message?.includes('NotFoundError')
            ? 'user+not+exist'
            : 'login+failed';
          appLogger.error('auth', `User not found or not authenticated: ${message}`);
          return GoogleAuthHandler.redirectWithMessage(res, message);
        }

        req.logIn(user, (loginErr) => {
          if (loginErr) {
            appLogger.error('auth', `Error during login: ${loginErr}`);
            return GoogleAuthHandler.redirectWithMessage(res, 'login+failed');
          }

          appLogger.info('auth', `User authenticated successfully: ${user.email}`);
          return res.redirect(`${appConfig.auth.clientUrl}/hello`);
        });
      }
    )(req, res, next);
  }

  private static redirectWithMessage(res: Response, message: string) {
    res.redirect(`${appConfig.auth.clientUrl}/login?message=${message}`);
  }
}
