/**
 * Auth Service - Maneja todas las operaciones de autenticación
 */

import type { LoginInput, RegisterInput, LoginResponse, RegisterResponse, User, ApiErrorResponse } from '../models/Auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const TOKEN_KEY = 'task-manager.access-token';

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public requestId?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const parseErrorResponse = (data: unknown): ApiErrorResponse | null => {
  if (
    typeof data === 'object' &&
    data !== null &&
    'error' in data &&
    typeof (data as Record<string, unknown>).error === 'object'
  ) {
    return data as ApiErrorResponse;
  }
  return null;
};

const handleResponse = async (response: Response): Promise<unknown> => {
  const text = await response.text();
  let data: unknown;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      throw new ApiError(response.status, 'INVALID_JSON', 'La API devolvió una respuesta inválida');
    }
  }

  if (!response.ok) {
    const errorData = parseErrorResponse(data);
    if (errorData) {
      throw new ApiError(
        response.status,
        errorData.error.code,
        errorData.error.message,
        errorData.error.requestId
      );
    }
    throw new ApiError(response.status, 'HTTP_ERROR', `Error ${response.status}`);
  }

  return data;
};

export const authService = {
  /**
   * Registra un nuevo usuario
   */
  async register(input: RegisterInput): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input)
    });

    const data = (await handleResponse(response)) as { data: RegisterResponse };
    return data.data.user;
  },

  /**
   * Inicia sesión y devuelve el token
   */
  async login(input: LoginInput): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input)
    });

    const data = (await handleResponse(response)) as { data: LoginResponse };
    return data.data;
  },

  /**
   * Obtiene el usuario actual usando el token
   */
  async getMe(token: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = (await handleResponse(response)) as { data: { user: User } };
    return data.data.user;
  },

  /**
   * Guarda el token en sessionStorage
   */
  saveToken(token: string): void {
    sessionStorage.setItem(TOKEN_KEY, token);
  },

  /**
   * Recupera el token de sessionStorage
   */
  getToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY);
  },

  /**
   * Elimina el token
   */
  clearToken(): void {
    sessionStorage.removeItem(TOKEN_KEY);
  },

  /**
   * Verifica si hay un token guardado
   */
  hasToken(): boolean {
    return !!this.getToken();
  }
};
