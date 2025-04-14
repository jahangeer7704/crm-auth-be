import type { LoginResponseDTO } from "@/application/shared/dtos/LoginRequestDTO.js";
import { Email } from "@/domain/valueObjects/Email.js";
import {rabbitMQClient} from "@/infrastructure/rabbitmq/rabbitmqClient.js"
import { appLogger } from "@/utils/observability/logger/appLogger.js";
import { Password } from "@/domain/valueObjects/Password.js";
import { AuthFailureError } from "@/utils/errors/ApiError.js";
export class LoginUseCase{
    private static instance : LoginUseCase;

    private constructor(){}

    public static getInstance():LoginUseCase{
        if(!LoginUseCase.instance) {
            LoginUseCase.instance = new LoginUseCase();
        }
        return LoginUseCase.instance;
    }

    public async execute(email:string , password:string) : LoginResponseDTO  {
        try{
            
            const requestQueue = 'auth.login.request';
            const responseQueue = 'auth.login.response';
            const payLoad = {
                email,
                password,
                replyTo : responseQueue
            }
            
            await rabbitMQClient.sendToQueue(requestQueue,JSON.stringify(payLoad));
            
            
            await rabbitMQClient.consumeFromQueue(responseQueue,async (msg) => {
                const response = JSON.parse(msg.content.toString());
                if(response.success) {
                    const {user} = response;
                    if(!await Password.compare(user.password, password)){
                        appLogger.error("Login","Entered Wrong Passowrd");
                        throw new AuthFailureError("Wrong Password");
                    }
                     
                }
                else {
                    appLogger.error("Login", "User Not Exist");
                    
                }
            })
            
        } catch(error) {

        }
        
    }

}