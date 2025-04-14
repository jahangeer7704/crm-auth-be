import type { Request, Response, NextFunction } from "express";
import passport from "passport";
import { appConfig } from "@/config/readers/appConfig.js";
import { appLogger } from "@/utils/observability/logger/appLogger.js";
import { TokenService } from "@/utils/crypto/TokenServer.js";


export class GoogleAuthHandler {
  public static handleCallback(req: Request, res: Response, next: NextFunction) {
    passport.authenticate(
      'google',{
        session: false,
      },
      async(err: Error | null, user: Record<string, any>, info: any) => {
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

        try {
            // Generate tokens
            const tokenService = new TokenService();
            const tokens = await tokenService.generateTokens({
              userId: user.gid,
              email: user.email,
            });
  
            appLogger.info('auth', `User authenticated successfully: ${user.email}`);
            res.cookie('jk_crm', tokens.refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
              });
              
              res.setHeader('Authorization', `Bearer ${tokens.accessToken}`);
              
              return res.status(200).json({ message: 'Login successful' });
          } catch (tokenError) {
            appLogger.error('auth', `Error generating tokens: ${tokenError}`);
            return res.status(500).json({ message: 'Token generation failed' });
          }
      }
    )(req, res, next);
  }

  private static redirectWithMessage(res: Response, message: string) {
    res.redirect(`${appConfig.auth.clientUrl}/login?message=${message}`);
  }
}
