import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { api } from "@/api";
import { toast } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2Icon, ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const { data, isLoading, error } = useQuery({
    queryKey: ["verifyEmail", token],
    queryFn: async () => {
      const response = await api.get(`/users/verify-email?token=${token}`);
      return response.data ?? [];
    },
  });

  useEffect(() => {
    if (!token) {
      toast.error("Token de verificação ausente.");
      navigate("/login");
      return;
    }

    if (data) {
      toast.success("Email verificado com sucesso!");
    }
  }, [data, token, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    toast.error("Falha na verificação do email. Token inválido ou expirado.");
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <section className="max-w-md w-full">
        <div>
          <img
            src="/images/logo-mentisV2.png"
            alt="Mentis Logo"
            className="h-12 mb-4 mx-auto"
          />
          <p className="text-2xl font-bold mb-4 flex items-center justify-center">
            Email Verificado
            <CheckCircle2Icon className="inline-block ml-2 text-green-500 animate-pulse" />
          </p>
        </div>
        <div className="mb-6 text-center">
          <img
            src="/images/Emails-bro.svg"
            alt="Email Verificado"
            className="w-56 object-cover mb-4 text-center mx-auto"
          />
          <p className="mb-6 text-justify">
            Seu email foi verificado com sucesso! Agora você pode acessar todas
            as funcionalidades da plataforma.
          </p>
        </div>
        <div className="flex justify-center">
          <Button onClick={() => navigate("/login")}>
            <ArrowLeftIcon className="w-4 h-4" />
            Ir para Login
          </Button>
        </div>
      </section>
    </div>
  );
}
