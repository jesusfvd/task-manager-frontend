import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import { authService, ApiError } from '../services/authService';
import type { AuthContextType, User } from '../models/Auth';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<'checking' | 'anonymous' | 'authenticated' | 'error'>('checking');
  const [error, setError] = useState<string | null>(null);

  // Restaurar sesión al cargar
  useEffect(() => {
    const restoreSession = async () => {
      const savedToken = authService.getToken();

      if (!savedToken) {
        setStatus('anonymous');
        return;
      }

      try {
        const currentUser = await authService.getMe(savedToken);
        setToken(savedToken);
        setUser(currentUser);
        setStatus('authenticated');
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          // Token inválido o expirado
          authService.clearToken();
          setStatus('anonymous');
        } else {
          setStatus('error');
          setError(err instanceof Error ? err.message : 'Error al restaurar sesión');
        }
      }
    };

    restoreSession();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    setStatus('checking');

    try {
      const response = await authService.login({ email, password });
      authService.saveToken(response.accessToken);
      setToken(response.accessToken);
      setUser(response.user);
      setStatus('authenticated');
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Error al iniciar sesión';
      setError(message);
      setStatus('error');
      throw err;
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    setError(null);
    setStatus('checking');

    try {
      await authService.register({ name, email, password });
      // Después de registrarse, iniciar sesión automáticamente
      const response = await authService.login({ email, password });
      authService.saveToken(response.accessToken);
      setToken(response.accessToken);
      setUser(response.user);
      setStatus('authenticated');
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Error al registrarse';
      setError(message);
      setStatus('error');
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    authService.clearToken();
    setToken(null);
    setUser(null);
    setStatus('anonymous');
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: AuthContextType = {
    user,
    token,
    status,
    error,
    login,
    register,
    logout,
    clearError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
