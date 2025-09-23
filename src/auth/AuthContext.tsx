// src/auth/AuthContext.tsx
import { createContext } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar: string;
  createdAt: string;
  updatedAt: string;
  // Add other user properties here if needed in the future
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (userData: AuthResponse) => void;
  logout: () => void;
  loading: boolean; // New property
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
