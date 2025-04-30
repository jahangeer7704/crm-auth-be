export interface TokenPayload {
    userId: string;
    email: string;
    isOAuth: boolean;
    role: string;
    emailVerified: boolean;
    avatarUrl?: string;
}
