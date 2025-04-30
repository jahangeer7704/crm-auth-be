import argon2 from "argon2";

export class Password {
    
    static async  compare(hash : string, password : string): Promise<boolean> {
        const match = await argon2.verify(hash,password);
        return match;
    }
    static async hash(password: string): Promise<string> {
        const hash = await argon2.hash(password);
        return hash;
    }
}