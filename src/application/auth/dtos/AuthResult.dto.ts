export interface AuthResult {
    accessToken: string;
    refreshToken: string;
    user: {
      name: string;
      email: string;
    };
  }