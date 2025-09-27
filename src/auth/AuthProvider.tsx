// src/auth/AuthProvider.tsx
import React, { useState, useEffect, type ReactNode } from 'react';
import { AuthContext, type AuthContextType, type User, type AuthResponse } from './AuthContext';
import { encrypt, decrypt } from '@/utils/crypto';
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check localStorage for a token or user data on initial load
    const storedToken = decrypt(localStorage.getItem('authToken') || '');
    const storedUser = decrypt(localStorage.getItem('authUser') || '');
    if (storedToken && storedUser) {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Failed to parse user data from localStorage", error);
        // Clear corrupted data
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
      }
    }
    setLoading(false); // Signal that initial auth check is complete
  }, []);

  const login = (userData: AuthResponse) => {
    setIsAuthenticated(true);
    setUser(userData.user);
    localStorage.setItem('authToken', encrypt(userData.access_token));
    localStorage.setItem('authUser', encrypt(JSON.stringify(userData.user)));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
  };

  const contextValue: AuthContextType = {
    isAuthenticated,
    user,
    login,
    logout,
    loading, // Add loading state to context
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
