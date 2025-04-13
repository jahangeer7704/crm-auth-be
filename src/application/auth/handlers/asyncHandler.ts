import type { Request,NextFunction,Response } from "express";
type AsyncFunction = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<any>;
  
export const AsyncHandler=(exec:AsyncFunction)=>(req:Request,res:Response,next:NextFunction)=>exec(req,res,next).catch(next)
