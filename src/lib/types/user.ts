export interface User {
  id: string;
  name: string;
  email: string;
  favouriteGenre?: string;
}

export interface UserSession {
  user: User;
  expiresAt: number; // Unix timestamp
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  favouriteGenre?: string;
}

export interface LoginData {
  email: string;
  password: string;
}
