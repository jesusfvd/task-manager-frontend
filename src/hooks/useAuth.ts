import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import type { AuthContextType } from '../models/Auth';

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }

  return context;
}
