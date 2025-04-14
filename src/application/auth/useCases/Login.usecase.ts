import type { LoginResponseDTO } from "@/application/shared/dtos/LoginRequestDTO.js";
import {rabbitMQClient} from "@/infrastructure/rabbitmq/rabbitmqClient.js"
import { appLogger } from "@/utils/observability/logger/appLogger.js";
import { Password } from "@/domain/valueObjects/Password.js";
import { AuthFailureError } from "@/utils/errors/ApiError.js";
import { TokenService } from "@/utils/crypto/TokenServer.js";
import { da } from "date-fns/locale";
export class LoginUseCase{
    private static instance : LoginUseCase;

    private constructor(){}

    public static getInstance():LoginUseCase{
        if(!LoginUseCase.instance) {
            LoginUseCase.instance = new LoginUseCase();
        }
        return LoginUseCase.instance;
    }

    public async execute(email:string , password:string) : Promise<LoginResponseDTO | undefined | void>  {
        try{
            
            const requestQueue = 'auth.login.request';
            const responseQueue = 'auth.login.response';
            const payLoad = {
                email,
                password,
                replyTo : responseQueue
            }
            
            await rabbitMQClient.sendToQueue(requestQueue,JSON.stringify(payLoad));
            
            
            return  await rabbitMQClient.consumeFromQueue(responseQueue,async (msg) : Promise<LoginResponseDTO> => {
                const response = JSON.parse(msg.content.toString());
                    if(!response.success || !await Password.compare(response?.user.password, password)){
                        appLogger.error("Login","Invalid Credentials");
                        throw new AuthFailureError("Invalid Credentials");
                    }
                    const user = response;
                    const data = {
                        userId : user.id,
                        email : user.email
                    }
                    return await TokenService.generateTokens(data);
                    
            })
            
        } catch(error) {

        }
        
    }

}