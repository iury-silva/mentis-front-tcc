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
    console.log("Verificando perfil completo para:", {
      type_login: user.type_login,
      hasCity: !!user.city,
      hasState: !!user.state,
      hasPhone: !!user.phone,
    });

    // Login normal sempre tem perfil completo
    if (user.type_login === "normal") {
      console.log("Login normal - perfil sempre completo");
      setProfileCompleted(true);
      return;
    }

    // Login OAuth - verificar se tem todos os dados
    if (user.type_login === "oauth") {
      const isComplete = !!(user.city && user.state && user.phone);
      console.log("Login OAuth - perfil completo:", isComplete);
      setProfileCompleted(isComplete);
      return;
    }

    // Fallback - assumir completo
    console.log("Tipo de login desconhecido - assumindo completo");
    setProfileCompleted(true);
  }, []);

  useEffect(() => {
    // Check localStorage for a token or user data on initial load
    const storedToken = decrypt(localStorage.getItem("authToken") || "");
    const storedUser = decrypt(localStorage.getItem("authUser") || "");

    if (storedToken && storedUser) {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        console.log("Carregando usuário do localStorage:", parsedUser);

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
        setProfileCompleted(true);
      }
    }
    setLoading(false);
  }, [completeProfile]);

  const login = (userData: AuthResponse) => {
    console.log("Login realizado para usuário:", userData.user);

    setIsAuthenticated(true);
    setUser(userData.user);

    // Calcular se perfil está completo no momento do login
    completeProfile(userData.user);

    localStorage.setItem("authToken", encrypt(userData.access_token));
    localStorage.setItem("authUser", encrypt(JSON.stringify(userData.user)));
  };

  const refreshUser = useCallback(async () => {
    try {
      console.log("Refreshing user data...");

      const response = await api.get(`/users/get-profile/${user?.id}`);
      const updatedUser = response;

      console.log("Dados atualizados do response:", updatedUser);

      setUser(updatedUser);
      completeProfile(updatedUser);

      localStorage.setItem("authUser", encrypt(JSON.stringify(updatedUser)));
    } catch (error) {
      console.error("Erro ao atualizar dados do usuário:", error);
      // Em caso de erro, fazer logout para evitar estado inconsistente
      logout();
    }
  }, [user, completeProfile]);

  const logout = () => {
    console.log("Logout realizado - limpando todos os estados");

    setIsAuthenticated(false);
    setProfileCompleted(true); // IMPORTANTE: Reset para true
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
