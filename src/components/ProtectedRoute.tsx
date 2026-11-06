import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { status } = useAuth();
  const location = useLocation();

  if (status === 'checking') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg font-semibold">Validando sesión...</p>
        </div>
      </div>
    );
  }

  if (status === 'anonymous') {
    // Guardar la ubicación a la que intentaba acceder
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (status === 'error') {
    return <Navigate to="/login" replace />;
  }

  return children;
}
