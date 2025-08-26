// src/components/LoginForm.tsx
import { cn } from "@/lib/utils";
import { useAuth } from "@/auth/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

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
  // FormDescription
} from "@/components/ui/form";

// Importando sua API centralizada
import { api } from "@/api";

// 1️⃣ Schema de validação Zod
const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm({ className, ...props }: React.ComponentProps<"form">) {
  const { login } = useAuth();
  const navigate = useNavigate();

  // 2️⃣ Configuração do react-hook-form
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 3️⃣ Função para login normal usando sua API
  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await api.post("/login", data); // usa sua API
      console.log("Login bem-sucedido:", result);
      login(result); // salva token e usuário no contexto
      navigate("/dashboard");
    } catch (error) {
      console.error("Erro no login:", error);
      alert("Falha no login, verifique suas credenciais.");
    }
  };

  // 4️⃣ Login via Google
  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  return (
    <Form {...form}>
      <form
        className={cn("flex flex-col gap-6", className)}
        {...props}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {/* Título */}
        {/* <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email below to login to your account
          </p>
        </div> */}

        {/* Inputs */}
        <div className="grid gap-6">
          {/* <div className="grid gap-3">
            <Label htmlFor="email">Email</Label>
            <Input {...register("email")} id="email" type="email" placeholder="m@example.com" />
            {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
          </div> */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="m@example.com" {...field} />
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
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* <div className="grid gap-3">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
                Forgot your password?
              </a>
            </div>
            <Input {...register("password")} id="password" type="password" />
            {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
          </div> */}

          {/* Botão login normal */}
          <Button type="submit" className="w-full">
            Login
          </Button>

          {/* Divisor */}
          <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="bg-background text-muted-foreground relative z-10 px-2">
              Ou continue com
            </span>
          </div>

          {/* Botão login Google */}
          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center gap-2"
            onClick={handleGoogleLogin}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 533.5 544.3" className="h-4 w-4">
              <path fill="#EA4335" d="M533.5 278.4c0-18.5-1.5-37-4.7-55H272v104h147.3c-6.4 34.8-26 64.3-55.5 84.1v69.8h89.4c52.4-48.2 80.3-119.3 80.3-202.9z" />
              <path fill="#34A853" d="M272 544.3c74.7 0 137.3-24.7 183.1-66.9l-89.4-69.8c-24.8 16.7-56.6 26.5-93.7 26.5-71.9 0-132.8-48.6-154.6-113.9H25.4v71.6c45.2 89.1 138 152.5 246.6 152.5z" />
              <path fill="#4A90E2" d="M117.4 320.2c-10.4-30.9-10.4-64 0-94.9V153.7H25.4c-34.9 69.5-34.9 152 0 221.5l92-55z" />
              <path fill="#FBBC05" d="M272 107.7c39.5-.6 77.2 14 105.9 40.8l79.1-79.1C409.3 24.3 346.7-.4 272 0 163.4 0 70.6 63.4 25.4 152.5l92 71.6C139.2 156.3 200.1 107.7 272 107.7z" />
            </svg>
            Entrar com Google
          </Button>
        </div>

        {/* Link para cadastro */}
        <div className="text-center text-sm" onClick={(e) => {
          e.preventDefault();
          navigate("/register");
        }}>
          Não tem uma conta?{" "}
          <a href="#" className="underline underline-offset-4">
            Cadastre-se
          </a>
        </div>
      </form>
    </Form>
  );
}
