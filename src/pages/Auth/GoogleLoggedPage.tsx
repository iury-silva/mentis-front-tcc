// src/pages/GoogleLogged.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/useAuth";
import { api } from "@/api";
import toast from "react-hot-toast";

export default function GoogleLogged() {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    async function authenticateWithGoogle() {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");
      console.log(token);

      if (!token) {
        toast.error("Falha ao receber token do Google");
        navigate("/login");
        return;
      }
      localStorage.setItem("authToken", token);

      await api
        .get("/me")
        .then((res) => {
          login({
            access_token: token,
            user: res,
          });
          toast.success("Login com Google realizado!");
          navigate(res.role.includes("admin") ? "/dashboard" : "/dashboard-user");
        })
        .catch((err) => {
          console.error(err);
          toast.error("Erro ao autenticar com Google");
          navigate("/login");
        });
    }

    authenticateWithGoogle();
  }, [login, navigate]);

  return <div>Autenticando com Google...</div>;
}
