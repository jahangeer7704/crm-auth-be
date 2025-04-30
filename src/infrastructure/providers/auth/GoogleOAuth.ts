import { appConfig } from '@/config/readers/appConfig.js';
import type { ICustomUser } from '@/domain/interfaces/ICustomUser.js';
import { appLogger } from '@/shared/observability/logger/appLogger.js';
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
  }

  public initialize() {
    return passport.initialize();
  }



  private async verifyCallback(
    req: Request,
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: Function
  ) {
    try {
      const customUser: ICustomUser = {
        gid: profile.id,
        email: profile?.emails?.[0]?.value ?? '',
        profile: profile?.photos?.[0]?.value ?? '',
        ip: req.clientIp ?? req.ip ?? '',
        name: profile?.displayName ?? '',
      };


      return done(null, customUser);
    } catch (error) {
      appLogger.error('passport', JSON.stringify(error));
      return done(null, false, { message: JSON.stringify(error) });
    }
  }
}

