import type { Request, Response } from "express";
import passport from "passport";
import { AsyncHandler } from "@/infrastructure/http/middlewares/asyncHandler.js";
import { SuccessResponse } from "../responses/ApiResponse.js";
import { LoginCommand } from "@/application/auth/commands/LoginCommand.js";
import type { LoginRequestDTO } from "@/application/auth/dtos/LoginRequestDTO.js";
import { GoogleAuthUseCase } from "@/application/auth/useCases/GoogleAuth.usecase.js";
import { LoginUseCase } from "@/application/auth/useCases/Login.usecase.js";
import type { CreateUserDTO } from "@/application/auth/dtos/CreateUserDTO.js";
import { CreateUserCommand } from "@/application/auth/commands/CreateUserCommand.js";
import { CreateUser } from "@/application/auth/useCases/SignUp.usecase.js";
import { appLogger } from "@/shared/observability/logger/appLogger.js";
export class AuthController {
  private readonly googleAuthUseCase = new GoogleAuthUseCase();
  private readonly loginUseCase = new LoginUseCase();
  private readonly createUser = new CreateUser();

  public googleLogin = passport.authenticate('google', {
    accessType: 'offline',
    scope: ['profile', 'email'],
    prompt: 'select_account',
    session: false,
  });

  public googleCallback = AsyncHandler(async (req: Request, res: Response) => {
    try {
      const authResult = await this.googleAuthUseCase.execute(req);
      res.cookie('uln', authResult.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.header("Authorization", `Bearer ${authResult.accessToken}`);
      return new SuccessResponse(
        "Login successful").send(res)
    } catch (error) {
      throw error
    }
  });

  public jwtLogin = AsyncHandler(async (req: Request, res: Response) => {
    try {
      const {emailOrUserName, password }: LoginRequestDTO = req.body;
      const command = new LoginCommand(emailOrUserName, password)
      const authResult = await this.loginUseCase.execute(command)
      res.cookie('uln', authResult.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.header("Authorization", `Bearer ${authResult.accessToken}`);
      return new SuccessResponse(
        "Login successful").send(res)
    } catch (error) {
      appLogger.error("control", `Error while  user login: ${error}`)
      throw error
    }
  });
  public jwtCreate = AsyncHandler(async (req: Request, res: Response) => {
    try {
      const { email, password, userName }: CreateUserDTO = req.body;
      const command = new CreateUserCommand(email, password, userName);
      const authResult = await this.createUser.execute(command);
      res.cookie('uln', authResult.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.header("Authorization", `Bearer ${authResult.accessToken}`);
      return new SuccessResponse(
        "Login successful").send(res)
    } catch (error) {
      appLogger.error("control", `Error while creating in user: ${error}`)

      throw error;
    }
  });




}

