import { z } from "zod";
export const createUserSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    userName: z.string().min(3, { message: "User name must be at least 3 characters long" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }),

}).transform(data => ({
    password: data.password,
    userName: data.userName.trim()
}))
export interface CreateUserDTO {
    email: string,
    password: string,
    userName: string
}