export interface AuthProfileResponse {
  email: string;
  isEnabled: boolean;
  isEmailVerified: boolean;
  role: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  picture: string;
  _id: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthRegisterResponse {
  user: User;
  tokens: Tokens;
}

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

interface User {
  email: string;
  isEnabled: boolean;
  isEmailVerified: boolean;
  role: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  picture: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}
