// src/auth/AuthContext.tsx
import { createContext } from "react";

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar: string;
  createdAt: string;
  updatedAt: string;
  type_login: "normal" | "oauth";
  city?: string;
  state?: string;
  phone?: string;
  profileCompleted?: boolean;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  profileCompleted: boolean;
  user: User | null;
  login: (userData: AuthResponse) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
  loading: boolean; // New property
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
