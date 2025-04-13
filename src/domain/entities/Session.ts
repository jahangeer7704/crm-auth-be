import { json } from "stream/consumers"

export class Session{
    constructor(
        public readonly id : string,
        public readonly userid : string,
        public readonly createdAt : Date = new Date(),
        public readonly expiresAt : Date,
        public readonly ip : string
    ){}

     toJSON()  {
        return {
            id : this.id,
            userid : this.userid,
            createdAt : this.createdAt,
            expiresAt : this.expiresAt,
            ip : this.ip
        }
    }
 
    static fromJSON(json : any) :Session{
        return new Session(
            json.id,
            json.userid,
            new Date(json.createdAt),
            json.expiresAt,
            json.ip
        );
    }
}