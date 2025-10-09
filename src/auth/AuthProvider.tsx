// src/auth/AuthProvider.tsx
import React, { useCallback, useState, useEffect, type ReactNode } from "react";
import {
  AuthContext,
  type AuthContextType,
  type User,
  type AuthResponse,
} from "./AuthContext";
import { encrypt, decrypt } from "@/utils/crypto";
import { api } from "@/api";
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [profileCompleted, setProfileCompleted] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const completeProfile = useCallback((user: User) => {
    if (
      user.type_login === "oauth" &&
      !user.city &&
      !user.state &&
      !user.phone
    ) {
      setProfileCompleted(false);
    }
  }, []);

  useEffect(() => {
    // Check localStorage for a token or user data on initial load
    const storedToken = decrypt(localStorage.getItem("authToken") || "");
    const storedUser = decrypt(localStorage.getItem("authUser") || "");
    if (storedToken && storedUser) {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
        completeProfile(parsedUser);
      } catch (error) {
        console.error("Failed to parse user data from localStorage", error);
        // Clear corrupted data
        localStorage.removeItem("authToken");
        localStorage.removeItem("authUser");
        setIsAuthenticated(false);
        setUser(null);
      }
    }
    setLoading(false); // Signal that initial auth check is complete
  }, [completeProfile]);

  const login = (userData: AuthResponse) => {
    setIsAuthenticated(true);
    setUser(userData.user);
    completeProfile(userData.user);
    localStorage.setItem("authToken", encrypt(userData.access_token));
    localStorage.setItem("authUser", encrypt(JSON.stringify(userData.user)));
  };

  const refreshUser = useCallback(async () => {
    try {
      const response = await api.get(`/users/get-profile/${user?.id}`);
      const updatedUser = response;

      setUser(updatedUser);
      completeProfile(updatedUser);
      setIsAuthenticated(true);
      setProfileCompleted(true);
      // Atualizar localStorage
      localStorage.setItem("authUser", encrypt(JSON.stringify(updatedUser)));
    } catch (error) {
      console.error("Erro ao atualizar dados do usuário:", error);
      // Em caso de erro, fazer logout
      logout();
    }
  }, [completeProfile, user?.id]);

  const logout = () => {
    setIsAuthenticated(false);
    setProfileCompleted(false);
    setUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
  };

  const contextValue: AuthContextType = {
    isAuthenticated,
    user,
    profileCompleted,
    login,
    logout,
    refreshUser,
    loading,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
