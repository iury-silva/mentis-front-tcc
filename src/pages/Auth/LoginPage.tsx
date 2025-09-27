// import { GalleryVerticalEnd } from "lucide-react"

import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { LoginForm } from "@/components/Login/LoginForm";
import { useAuth } from "@/auth/useAuth";

export default function LoginPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated, user } = useAuth();
  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = user?.role.includes("admin")
        ? "/dashboard"
        : "/dashboard-user";
    }
    // Verificar se foi redirecionado por sessão expirada
    if (searchParams.get("expired") === "true") {
      toast.error("Sessão expirada. Por favor, faça login novamente.", {
        icon: "⏰",
      });

      // Limpar o parâmetro da URL para evitar reexibir o toast
      searchParams.delete("expired");
      setSearchParams(searchParams, { replace: true });
    }
  }, [isAuthenticated, searchParams, setSearchParams, user?.role]);
  return (
    <div className="grid min-h-svh lg:grid-cols-2 dark:from-primary/10 dark:to-muted/20 dark:bg-gradient-to-br">
      <div className="absolute bottom-4 left-4 hidden lg:block z-20 brightness-60">
        {/* <img src="/images/icone-mentisV2.png" alt="Logo M" className="h-10 w-10" /> */}
        <span className="text-[0.50rem] text-muted-foreground font-light">
          Desenvolvido com ❤️ por Iury da Silva
        </span>
      </div>
      <div className="hidden lg:block -z-1">
        <img
          src="/images/layered-waves-haikei.svg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-col gap-2 p-6 md:p-10">
        <div className="flex justify-center">
          <div className="flex h-32 items-end justify-center">
            {/* <GalleryVerticalEnd className="size-4" /> */}
            <img src="/images/logo-mentisV2.png" alt="Img" className="h-12" />
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
