import { appConfig } from '@/config/readers/appConfig.js';
import { appLogger } from '@/utils/observability/logger/appLogger.js';
import type { Request } from 'express';
import passport, { type Profile } from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

export class PassportService {

  constructor() {
    passport.use(
      new GoogleStrategy(
        {
          clientID: appConfig.auth.googleClientId,
          clientSecret: appConfig.auth.googleClientSecret,
          callbackURL: appConfig.auth.googleRedirectUri,
          passReqToCallback: true
        },
        this.verifyCallback.bind(this)
      )
    );

    passport.serializeUser((user, done) => {
      done(null, user);
    });

    passport.deserializeUser((user: Record<string, any>, done) => {
      done(null, user);
    });
  }

  public initialize() {
    return passport.initialize();
  }

  public session() {
    return passport.session();
  }

  private async verifyCallback(
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: Function
  ) {
    try {
      const customUser = {
        gid: profile.id,
        email: profile?.emails?.[0]?.value ?? '',
        profile: profile?.photos?.[0]?.value ?? '',
        ip: req.clientIp ?? req.ip ?? ''
      };


      return done(null, { ...customUser, role:"" });
    } catch (error) {
      appLogger.error('passport', JSON.stringify(error));
      return done(null, false, { message: JSON.stringify(error) });
    }
  }
}

export const passportService = new PassportService();
