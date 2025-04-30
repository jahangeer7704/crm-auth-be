
export interface IUserServiceCreate {
    userName: string;
    email: string;
    passwordHash?: string;
    isOAuth: boolean;
    avatarUrl?: string;
}