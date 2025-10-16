import { useState, useEffect } from "react";
import { useAuth } from "@/auth/useAuth";
import { api } from "@/api";
import toast from "react-hot-toast";

export function useOnboarding() {
  const { user, refreshUser } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);

  useEffect(() => {
    const checkOnboarding = async () => {
      if (!user) {
        setIsCheckingOnboarding(false);
        return;
      }

      try {
        // Verificar se o usuário precisa ver o onboarding
        if (user.first_access === true) {
          // Pequeno delay para melhor UX
          setTimeout(() => {
            setShowOnboarding(true);
            setIsCheckingOnboarding(false);
          }, 500);
        } else {
          setIsCheckingOnboarding(false);
        }
      } catch (error) {
        console.error("Erro ao verificar onboarding:", error);
        setIsCheckingOnboarding(false);
      }
    };

    checkOnboarding();
  }, [user]);

  const completeOnboarding = async () => {
    if (!user?.id) {
      throw new Error("Usuário não encontrado");
    }

    try {
      await api.put(`/users/${user.id}/first-access`);

      // Atualizar dados do usuário
      await refreshUser();

      toast.success("Bem-vindo ao Mentis! 🎉");
    } catch (error) {
      console.error("Erro ao completar onboarding:", error);
      toast.error("Erro ao finalizar tutorial");
      throw error;
    }
  };

  return {
    showOnboarding,
    setShowOnboarding,
    completeOnboarding,
    isCheckingOnboarding,
  };
}
