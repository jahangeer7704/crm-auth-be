import { LoginRequestSchema } from "@/application/auth/dtos/LoginRequestDTO.js"
import { ValidationError } from "@/shared/utils/errors/ApiError.js"

export class LoginCommand {
    constructor(
        public readonly email: string,
        public readonly password: string,
        public readonly userName: string,
    ) {

        this.validator()
    }
    private validator() {
        const validate = LoginRequestSchema.safeParse({ email: this.email, userName: this.userName, password: this.password });
        if (!validate.success) {
            throw new ValidationError(validate.error.message)
        }


    }

}