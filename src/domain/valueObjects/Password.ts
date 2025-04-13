import argon2 from "argon2";

export class Password {
    
    static async  verify(hash : string, password : string) {
        const match = await argon2.verify(hash,password);
        return match;
    }
}