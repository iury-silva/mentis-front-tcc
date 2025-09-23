import * as React from "react";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface PasswordInputProps
  extends Omit<React.ComponentProps<"input">, "type"> {
  showStrengthIndicator?: boolean;
  className?: string;
}

function PasswordInput({
  className,
  onFocus,
  showStrengthIndicator = false,
  ...props
}: PasswordInputProps) {
  const [password, setPassword] = React.useState("");
  const [isVisible, setIsVisible] = React.useState(false);
  const id = React.useId();

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  const checkStrength = (pass: string) => {
    const requirements = [
      { regex: /.{8,}/, text: "Pelo menos 8 caracteres" },
      { regex: /[0-9]/, text: "Pelo menos 1 número" },
      { regex: /[a-z]/, text: "Pelo menos 1 letra minúscula" },
      { regex: /[A-Z]/, text: "Pelo menos 1 letra maiúscula" },
    ];

    return requirements.map((req) => ({
      met: req.regex.test(pass),
      text: req.text,
    }));
  };

  const strength = checkStrength(password);

  const strengthScore = React.useMemo(() => {
    return strength.filter((req) => req.met).length;
  }, [strength]);

  const getStrengthColor = (score: number) => {
    if (score === 0) return "bg-border";
    if (score <= 1) return "bg-red-500";
    if (score <= 2) return "bg-orange-500";
    if (score === 3) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const getStrengthText = (score: number) => {
    if (score === 0) return "Digite uma senha";
    if (score <= 2) return "Senha fraca";
    if (score === 3) return "Senha média";
    return "Senha forte";
  };

  // Função para scroll suave no mobile quando input recebe foco
  const handleMobileFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    // Chama a função onFocus original se existir
    onFocus?.(event);

    const isMobile =
      window.innerWidth <= 768 ||
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    if (isMobile) {
      const performScroll = () => {
        const questionContainer = event.target.closest(
          ".question-container, .form-container, .input-container"
        ) as HTMLElement;

        if (questionContainer) {
          questionContainer.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        } else {
          event.target.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      };

      performScroll();
      setTimeout(performScroll, 300);
    }
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = event.target.value;
    setPassword(newPassword);

    // Chama o onChange original se existir
    if (props.onChange) {
      props.onChange(event);
    }
  };

  return (
    <div className="space-y-2">
      {/* Campo de senha com botão de toggle */}
      <div className="relative">
        <input
          {...props}
          id={id}
          type={isVisible ? "text" : "password"}
          value={password}
          onChange={handlePasswordChange}
          onFocus={handleMobileFocus}
          data-slot="input"
          className={cn(
            "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 pr-10 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
            className
          )}
          aria-describedby={
            showStrengthIndicator ? `${id}-description` : undefined
          }
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground transition-colors focus-visible:border-ring focus-visible:ring-ring/50 outline-none focus:z-10 focus-visible:ring-[3px] rounded-e-md"
          onClick={toggleVisibility}
          tabIndex={-1}
          aria-label={isVisible ? "Ocultar senha" : "Mostrar senha"}
          aria-pressed={isVisible}
        >
          {isVisible ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Indicador de força da senha */}
      {showStrengthIndicator && (
        <>
          <div
            className="bg-border mt-3 mb-4 h-1 w-full overflow-hidden rounded-full"
            role="progressbar"
            aria-valuenow={strengthScore}
            aria-valuemin={0}
            aria-valuemax={4}
            aria-label="Força da senha"
          >
            <div
              className={`h-full ${getStrengthColor(
                strengthScore
              )} transition-all duration-500 ease-out`}
              style={{ width: `${(strengthScore / 4) * 100}%` }}
            />
          </div>

          {/* Descrição da força da senha */}
          <p
            id={`${id}-description`}
            className="text-foreground mb-2 text-sm font-medium"
          >
            {getStrengthText(strengthScore)}:
          </p>

          {/* Lista de requisitos da senha */}
          <ul className="space-y-1.5" aria-label="Requisitos da senha">
            {strength.map((req, index) => (
              <li key={index} className="flex items-center gap-2">
                {req.met ? (
                  <Check
                    size={16}
                    className="text-emerald-500"
                    aria-hidden="true"
                  />
                ) : (
                  <X
                    size={16}
                    className="text-muted-foreground/80"
                    aria-hidden="true"
                  />
                )}
                <span
                  className={`text-xs ${
                    req.met ? "text-emerald-600" : "text-muted-foreground"
                  }`}
                >
                  {req.text}
                  <span className="sr-only">
                    {req.met
                      ? " - Requisito atendido"
                      : " - Requisito não atendido"}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export { PasswordInput };
