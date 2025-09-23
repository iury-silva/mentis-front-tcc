import * as React from "react";

import { cn } from "@/lib/utils";

function Input({
  className,
  type,
  onFocus,
  ...props
}: React.ComponentProps<"input">) {
  // Função para scroll suave no mobile quando input recebe foco
  const handleMobileFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    // Chama a função onFocus original se existir
    onFocus?.(event);

    console.log("🔍 Input focus detectado:", {
      isMobile: window.innerWidth <= 768,
      windowWidth: window.innerWidth,
      userAgent: navigator.userAgent.includes("Mobile"),
    });

    // Detecção mais robusta de mobile
    const isMobile =
      window.innerWidth <= 768 ||
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    if (isMobile) {
      console.log("📱 Executando scroll mobile...");

      // Função para fazer o scroll
      const performScroll = () => {
        // Primeiro tenta encontrar um container com classe específica
        const questionContainer = event.target.closest(
          ".question-container, .form-container, .input-container"
        ) as HTMLElement;

        console.log("🎯 Container encontrado:", questionContainer?.className);

        if (questionContainer) {
          console.log("📋 Fazendo scroll para container");
          // Scroll para o container completo
          questionContainer.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        } else {
          console.log("🎯 Fazendo scroll para input (fallback)");
          // Fallback: scroll para o input centralizado
          event.target.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      };

      // Executa imediatamente e também após delay para o teclado
      performScroll();
      setTimeout(performScroll, 300);
    }
  };

  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      onFocus={handleMobileFocus}
      {...props}
    />
  );
}

export { Input };
