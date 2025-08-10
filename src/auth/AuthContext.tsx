// src/auth/AuthContext.tsx
import { createContext } from 'react';

export interface User {
  name: string;
  // Add other user properties here if needed in the future
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  loading: boolean; // New property
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
