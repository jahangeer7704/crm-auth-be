import { createUserSchema } from "@/application/auth/dtos/CreateUserDTO.js"
import { ValidationError } from "@/shared/utils/errors/ApiError.js"

export class CreateUserCommand {
    constructor(
        public readonly email: string,
        public readonly password: string,
        public readonly userName: string
    ) {

        this.validator()
    }
    private validator() {
        const validate = createUserSchema.safeParse({ email: this.email, password: this.password, userName: this.userName });
        if (!validate.success) {
            throw new ValidationError(validate.error.message)
        }


    }

}