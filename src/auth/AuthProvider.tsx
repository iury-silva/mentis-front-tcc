import React, { useCallback, useState, useEffect, type ReactNode } from "react";
import {
  AuthContext,
  type AuthContextType,
  type User,
  type AuthResponse,
} from "./AuthContext";
import { useNavigate } from "react-router-dom";
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

  const navigate = useNavigate();

  /**
   * Função auxiliar para verificar se o perfil do usuário está completo
   * - Login normal: sempre completo (não precisa de dados extras)
   * - Login OAuth: precisa ter city, state e phone preenchidos
   */
  const completeProfile = useCallback((user: User) => {
    // Login normal sempre tem perfil completo
    if (user.type_login === "normal") {
      console.log("Login normal - perfil sempre completo");
      setProfileCompleted(true);
      return;
    }

    // Login OAuth - verificar se tem todos os dados obrigatórios
    if (user.type_login === "oauth") {
      const isComplete = !!(user.city && user.state && user.phone);
      console.log("Login OAuth - perfil completo:", isComplete);
      setProfileCompleted(isComplete);
      return;
    }

    // Fallback: considerar completo
    setProfileCompleted(true);
  }, []);

  useEffect(() => {
    console.log("🔄 AuthProvider: Inicializando (executa só 1x)");

    // Tentar recuperar token e dados do usuário do localStorage
    const storedToken = decrypt(localStorage.getItem("authToken") || "");
    const storedUser = decrypt(localStorage.getItem("authUser") || "");

    if (storedToken && storedUser) {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        console.log("✅ Sessão restaurada do localStorage:", parsedUser.email);

        // Atualizar estados com os dados restaurados
        setUser(parsedUser);
        setIsAuthenticated(true);

        // Isso evita dependências desnecessárias no useEffect
        if (parsedUser.type_login === "normal") {
          setProfileCompleted(true);
        } else if (parsedUser.type_login === "oauth") {
          const isComplete = !!(
            parsedUser.city &&
            parsedUser.state &&
            parsedUser.phone
          );
          setProfileCompleted(isComplete);
        } else {
          setProfileCompleted(true);
        }
      } catch (error) {
        console.error("❌ Erro ao parsear dados do localStorage:", error);
        
        // Limpar dados corrompidos para evitar problemas
        localStorage.removeItem("authToken");
        localStorage.removeItem("authUser");
        setIsAuthenticated(false);
        setUser(null);
        setProfileCompleted(true);
      }
    } else {
      console.log("Nenhuma sessão encontrada no localStorage");
    }

    // Marcar carregamento como finalizado
    setLoading(false);
  }, []); // IMPORTANTE: Array vazio = executa apenas no mount

  const login = (userData: AuthResponse) => {
    console.log("🔐 Login realizado:", userData.user.email);

    // Atualizar estados de autenticação
    setIsAuthenticated(true);
    setUser(userData.user);

    // Verificar se perfil está completo usando a função auxiliar
    completeProfile(userData.user);

    // Persistir dados no localStorage (criptografados)
    localStorage.setItem("authToken", encrypt(userData.access_token));
    localStorage.setItem("authUser", encrypt(JSON.stringify(userData.user)));
    navigate(
      userData.user.role.includes("admin") ? "/dashboard" : "/dashboard-user"
    );
    console.log("✅ Dados salvos no localStorage");
  };

  /**
   * Atualiza os dados do usuário buscando do backend
   * Útil após o usuário completar o perfil ou atualizar informações
   */
  const refreshUser = useCallback(async () => {
    try {
      console.log("🔄 Atualizando dados do usuário...");
      if (!user?.id) {
        console.warn("⚠️ Usuário não autenticado - não é possível atualizar");
        return;
      }
      // Buscar dados atualizados do backend
      const response = await api.get(`/users/get-profile/${user.id}`);
      const updatedUser = response;

      console.log("✅ Dados atualizados:", updatedUser.email);

      // Atualizar estados com os novos dados
      setUser(updatedUser);
      completeProfile(updatedUser);

      // Atualizar localStorage com os dados mais recentes
      localStorage.setItem("authUser", encrypt(JSON.stringify(updatedUser)));
    } catch (error) {
      console.error("❌ Erro ao atualizar dados do usuário:", error);
      
      // Em caso de erro (ex: token inválido), fazer logout
      // para evitar estado inconsistente
      logout();
    }
  }, [user?.id, completeProfile]);

  /**
   * Limpa toda a sessão do usuário
   * Remove dados do localStorage e reseta todos os estados
   */
  const logout = () => {
    console.log("🚪 Logout realizado");

    // Resetar todos os estados para valores iniciais
    setIsAuthenticated(false);
    setProfileCompleted(true); // IMPORTANTE: Reset para true (estado inicial)
    setUser(null);

    // Limpar dados do localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
  };

  // Preparar valor do contexto com todas as funções e estados
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