import { LoginRequestSchema } from "@/application/shared/dtos/LoginRequestDTO.js"
import { ValidationError } from "@/utils/errors/ApiError.js"

export class LoginCommand {
    constructor(
        public readonly emailOrName: string,
        public readonly password: string
    ) {

        this.validator()
    }
    private validator() {
        const validate = LoginRequestSchema.safeParse({ emailOrName: this.emailOrName, password: this.password });
        if (!validate.success) {
            throw new ValidationError(validate.error.message)
        }


    }

}