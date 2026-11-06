import { createContext } from 'react';
import type { AuthContextType } from '../models/Auth';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
