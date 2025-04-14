export interface AuthResult {
    accessToken: string;
    refreshToken: string;
    user: {
      gid: string;
      email: string;
    };
  }