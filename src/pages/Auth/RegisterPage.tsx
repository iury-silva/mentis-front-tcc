import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { api } from "@/api";
import { useState } from "react";
import { CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

// Schema de validação Zod para registro
const registerSchema = z
  .object({
    name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    try {
      await api.post("/users", {
        name: data.name,
        email: data.email,
        password: data.password,
      });
      toast.success(
        "Cadastro realizado com sucesso! Faça login para continuar."
      );
      navigate("/login");
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      toast.error("Erro ao cadastrar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  return (
    <div className="relative grid min-h-svh lg:grid-cols-2 overflow-hidden">
      {/* Logo M no canto esquerdo (desktop) */}
      <div className="absolute top-4 left-4 hidden lg:block z-20">
        <img src="/images/icone-mentisV2.png" alt="Logo M" className="w-10" />
      </div>

      {/* Ondas decorativas no topo direito (apenas desktop) */}
      {/* <div className="absolute -top-18 -right-96 hidden lg:block z-10 pointer-events-none">
        <img
          src="/images/layered-waves-haikei.svg"
          alt=""
          className="transform rotate-140 translate-x-16 -translate-y-8"
        />
      </div> */}

      {/* Left side - Avatar grande + textos + lista */}
      <div className="hidden lg:flex relative items-center justify-center p-6">
        <div className="relative flex items-center gap-10">
          {/* Avatar maior, com destaque */}
          <div className="relative w-60 h-60 flex-shrink-0">
            <img
              src="/images/avatar-register.png"
              alt="Mentis Ilustração"
              className="w-full h-full object-contain absolute top-0 left-0"
            />
          </div>

          <div className="flex flex-col gap-4 max-w-xs">
            <h2 className="text-3xl font-bold text-center">Bem-vindo ao Mentis!</h2>
            <p className="text-sm text-muted-foreground text-center">
              Organize e otimize suas tarefas diárias de forma prática:
            </p>
            <div className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span>Análise de voz com IA para insights emocionais</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span>Registro emocional diário personalizado</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span>Dashboard intuitivo com histórico de bem-estar</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span>Sugestões de autocuidado com IA</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span>Privacidade e segurança de dados garantidas</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex flex-col gap-4 p-6 md:p-10">
        {/* Logo extenso apenas mobile */}
        <div className="flex justify-center mb-6 lg:hidden">
          <img
            src="/images/logo-mentisV2.png"
            alt="Mentis Logo"
            className="h-12"
          />
        </div>

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold">Criar conta</h1>
              <p className="text-muted-foreground text-sm">
                Preencha os dados abaixo para criar sua conta
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="Seu nome completo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="seu@email.com"
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <PasswordInput
                          placeholder="Sua senha"
                          showStrengthIndicator={true}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar senha</FormLabel>
                      <FormControl>
                        <PasswordInput
                          placeholder="Confirme sua senha"
                          showStrengthIndicator={false}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Criando conta..." : "Criar conta"}
                </Button>
              </form>
            </Form>

            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              <span className="relative z-10 bg-background px-2 text-muted-foreground">
                Ou continue com
              </span>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleRegister}
              disabled={loading}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 533.5 544.3"
                className="h-4 w-4 mr-2"
              >
                <path
                  fill="#EA4335"
                  d="M533.5 278.4c0-18.5-1.5-37-4.7-55H272v104h147.3c-6.4 34.8-26 64.3-55.5 84.1v69.8h89.4c52.4-48.2 80.3-119.3 80.3-202.9z"
                />
                <path
                  fill="#34A853"
                  d="M272 544.3c74.7 0 137.3-24.7 183.1-66.9l-89.4-69.8c-24.8 16.7-56.6 26.5-93.7 26.5-71.9 0-132.8-48.6-154.6-113.9H25.4v71.6c45.2 89.1 138 152.5 246.6 152.5z"
                />
                <path
                  fill="#4A90E2"
                  d="M117.4 320.2c-10.4-30.9-10.4-64 0-94.9V153.7H25.4c-34.9 69.5-34.9 152 0 221.5l92-55z"
                />
                <path
                  fill="#FBBC05"
                  d="M272 107.7c39.5-.6 77.2 14 105.9 40.8l79.1-79.1C409.3 24.3 346.7-.4 272 0 163.4 0 70.6 63.4 25.4 152.5l92 71.6C139.2 156.3 200.1 107.7 272 107.7z"
                />
              </svg>
              Cadastrar com Google
            </Button>

            <div className="text-center text-sm">
              Já tem uma conta?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="underline underline-offset-4 cursor-pointer"
              >
                Entrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
