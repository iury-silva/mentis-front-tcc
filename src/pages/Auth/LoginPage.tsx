// import { GalleryVerticalEnd } from "lucide-react"

import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { LoginForm } from "@/components/Login/LoginForm";
import { useAuth } from "@/auth/useAuth";
import { MonitorIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated, user } = useAuth();
  useEffect(() => {
    if (searchParams.get("expired") === "true") {
      toast.error("Sessão expirada. Por favor, faça login novamente.", {
        icon: "⏰",
      });

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

      {/* iframe do instatus no canto direito botao floating */}
      <div className="hidden lg:block absolute bottom-10 left-4 opacity-90 z-50">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button
              variant="ghost"
              size="icon"
              className="bg-background/20 rounded-full transition-all duration-200 transform hover:scale-110"
            >
              <MonitorIcon className="h-6 w-6 text-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-96 p-0 m-3 rounded-xl shadow-lg border border-border/50 bg-card/80 backdrop-blur-sm">
            <DropdownMenuItem className="p-0 m-0">
              <iframe
                src="https://mentis.instatus.com/"
                style={{ border: "none", width: "400px", height: "600px" }}
                className="rounded-lg p-0"
              ></iframe>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
