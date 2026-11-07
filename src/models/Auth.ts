/**
 * Auth Models - Define los tipos para autenticación
 */

export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: string;
}

export interface RegisterResponse {
  user: User;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  status: 'checking' | 'anonymous' | 'authenticated' | 'error';
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: unknown[];
    requestId?: string;
  };
}
