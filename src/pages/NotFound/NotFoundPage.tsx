// src/pages/NotFoundPage.tsx
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function NotFoundPage() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate(-1);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [navigate]);

  const handleGoHome = () => navigate("/");

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-6">
      {/* Logo M */}
      <div className="absolute top-4 left-4 z-20">
        <img src="/icone-mentisV2.png" alt="Logo M" className="w-10" />
      </div>

      <div className="text-center max-w-2xl mx-auto">
        {/* 404 */}
        <h2 className="text-3xl font-semibold text-foreground mb-2">
          Ops! Página não encontrada
        </h2>
        <p className="text-muted-foreground mb-2">
          A página que você está procurando não existe ou foi movida.
        </p>
        <p className="text-sm text-muted-foreground">
          Você será redirecionado em{" "}
          <span className="font-semibold text-primary">{countdown}</span>{" "}
          segundos
        </p>

        {/* Illustration simples */}
        <div className="my-8 flex justify-center">
          <img src="images/errors/404.svg" alt="404" className="h-64" />
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={handleGoHome} className="px-6 py-3">
            Ir para o início
          </Button>
        </div>

        {/* Help */}
        <div className="mt-6 p-4 bg-muted-background rounded border border-border">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold">Precisa de ajuda?</span> Verifique o
            endereço ou entre em contato com o suporte.
          </p>
        </div>
      </div>
    </div>
  );
}
