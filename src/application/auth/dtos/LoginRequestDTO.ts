import { z } from "zod";
export const LoginRequestSchema = z.object({
    emailOrUserName: z.string().min(3, { message: "User name must be at least 3 characters long" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }),

}).transform(data => ({
    emailOrUserName: data.emailOrUserName.trim(),
    password: data.password
}))
export interface LoginRequestDTO {
    emailOrUserName: string,
    password: string
}