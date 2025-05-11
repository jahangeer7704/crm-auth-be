export interface TokenPayload {
    userId: string;
    email: string;
    isOAuth: boolean;
    userName: string;
    role: string;
    emailVerified: boolean;
    avatarUrl?: string;
}
