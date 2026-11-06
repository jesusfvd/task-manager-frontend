import { ReactNode } from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';

interface PublicOnlyRouteProps {
  children: ReactNode;
}

/**
 * Ruta que solo permite acceso si el usuario NO está autenticado
 * Útil para páginas de login y registro
 */
export function PublicOnlyRoute({ children }: PublicOnlyRouteProps) {
  const { status } = useAuth();

  if (status === 'checking') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg font-semibold">Validando sesión...</p>
        </div>
      </div>
    );
  }

  if (status === 'authenticated') {
    // Redirigir a tareas si ya está autenticado
    return <Navigate to="/tasks" replace />;
  }

  return children;
}
