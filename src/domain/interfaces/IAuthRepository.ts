
    export interface IAuthRepository {
        login(email : string, password : string) : Promise<any>;
        refreshToken(refreshToken : string) : Promise<any>;
    }