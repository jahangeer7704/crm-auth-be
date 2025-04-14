import type { Request } from "express";
import { googleAuthUseCase } from "../useCases/GoogleAuth.usecase.js";



class GoogleAuthHandler {
    private static instance: GoogleAuthHandler
    private constructor() { }
    public handleCallback(req: Request) {
        return googleAuthUseCase.execute(req);
    }
    public static getInstance() {
        if (!GoogleAuthHandler.instance) {
            GoogleAuthHandler.instance = new GoogleAuthHandler();
        }
        return GoogleAuthHandler.instance;
    }

}
export const googleAuthHandler = GoogleAuthHandler.getInstance();
