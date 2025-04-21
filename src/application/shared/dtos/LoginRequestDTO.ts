import { z } from "zod";
export const LoginRequestSchema = z.object({
    emailOrName: z.string().min(3, { message: "User name must be at least 3 characters long" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }),

}).transform(data => ({
    emailOrName: data.emailOrName.trim(),
    password: data.password
}))
export interface LoginRequestDTO {
    emailOrName: string,
    password: string
}