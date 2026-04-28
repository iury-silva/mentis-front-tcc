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

const partnerLogos = [
  {
    src: "/images/Logo da UNISC.png",
    alt: "UNISC - Universidade de Santa Cruz do Sul",
    href: "https://www.unisc.br",
  },
  {
    src: "/images/Logo - Mestrado_Profissional_em_Psicologia.png",
    alt: "Mestrado Profissional em Psicologia",
  },
  {
    src: "/images/Logo - PPGSPI.png",
    alt: "PPGSPI",
  },
  {
    src: "/images/AMBITRANS_LOGOFINAL.png",
    alt: "AMBITRANS",
  },
  {
    src: "/images/1.png",
    alt: "Orgulho-vidade",
  },
  {
    src: "/images/FP_vetor_oficial (1).png",
    alt: "Fundo Positivo",
  },
  {
    src: "/images/fundo_lgbtqia_logo.png",
    alt: "Fundo Positivo LGBTQIA+",
  },
];

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
    <div className="relative min-h-svh flex flex-col bg-gradient-to-br from-rose-50 via-white to-orange-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      {/* Decorative blurred circles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-orange-300/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-rose-200/10 blur-3xl" />
      </div>

      {/* Status monitor — bottom left */}
      <div className="hidden lg:block fixed bottom-10 left-4 opacity-90 z-50">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <MonitorIcon className="h-5 w-5 text-muted-foreground/50 hover:text-muted-foreground transition-colors" />
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

      {/* ========== MAIN CONTENT ========== */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-10 sm:px-6">
        {/* Logo */}
        <div className="mb-8">
          <img
            src="/images/logo-mentisV2.png"
            alt="Mentis"
            className="h-12 sm:h-14"
          />
        </div>

        {/* Login card */}
        <div className="w-full max-w-sm rounded-2xl border border-border/40 bg-card/70 backdrop-blur-sm p-8 shadow-xl shadow-black/5 dark:shadow-black/20">
          <LoginForm />
        </div>
      </div>

      {/* ========== PARTNER LOGOS FOOTER ========== */}
      <footer className="relative z-10 border-t border-border/30 bg-muted/30 backdrop-blur-sm">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
          {/* Title */}
          <p className="text-center text-[0.65rem] sm:text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground/50 mb-5 sm:mb-6">
            Realização e Apoio
          </p>

          {/* Logo row */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 md:gap-10">
            {partnerLogos.map((logo) => {
              const img = (
                <img
                  key={logo.alt}
                  src={logo.src}
                  alt={logo.alt}
                  className="h-8 sm:h-10 md:h-12 w-auto max-w-[120px] sm:max-w-[140px] md:max-w-[160px] object-contain opacity-60 hover:opacity-100 transition-all duration-300 hover:scale-105 grayscale hover:grayscale-0"
                />
              );

              if (logo.href) {
                return (
                  <a
                    key={logo.alt}
                    href={logo.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-shrink-0"
                  >
                    {img}
                  </a>
                );
              }

              return (
                <div key={logo.alt} className="flex-shrink-0">
                  {img}
                </div>
              );
            })}
          </div>

          {/* Credit */}
          <p className="mt-6 text-center text-[0.55rem] text-muted-foreground/40 font-light">
            Desenvolvido com ❤️ por Iury da Silva
          </p>
        </div>
      </footer>
    </div>
  );
}
