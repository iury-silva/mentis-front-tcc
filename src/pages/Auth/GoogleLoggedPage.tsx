// src/pages/GoogleLogged.tsx
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/useAuth";
import { api } from "@/api";
import toast from "react-hot-toast";

export default function GoogleLogged() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const hasAuthenticated = useRef(false);

  useEffect(() => {
    if (hasAuthenticated.current) return;

    async function authenticateWithGoogle() {
      try {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (!token) {
          toast.error("Falha ao receber token do Google");
          navigate("/login");
          return;
        }

        hasAuthenticated.current = true;

        // Salva o token
        localStorage.setItem("authToken", token);

        const userResponse = await api.get("/me");

        // Faz login
        login({
          access_token: token,
          user: userResponse,
        });

        toast.success("Login com Google realizado!");

        // Navega baseado no role
        const redirectPath = userResponse.role.includes("admin")
          ? "/dashboard"
          : "/dashboard-user";

        navigate(redirectPath);
      } catch (err) {
        console.error("Erro na autenticação Google:", err);
        toast.error("Erro ao autenticar com Google");
        navigate("/login");
      }
    }

    authenticateWithGoogle();
  }, [login, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p>Autenticando com Google...</p>
      </div>
    </div>
  );
}
