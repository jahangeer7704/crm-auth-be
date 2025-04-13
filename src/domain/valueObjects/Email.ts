import {isEmail} from "validator"
    export class Email {
        constructor(public readonly value : string) {
            if(!isEmail(value)) throw new Error('Invalid Email');
        }
    }