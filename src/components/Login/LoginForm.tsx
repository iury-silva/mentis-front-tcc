/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/LoginForm.tsx
import { cn } from "@/lib/utils";
import { useAuth } from "@/auth/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

import { api } from "@/api";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const { login } = useAuth();
  const navigate = useNavigate();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      try {
        const res = await api.post("/login", data);

        if (!res?.access_token || !res?.user) {
          throw new Error("Resposta inválida do servidor");
        }

        return res;
      } catch (error) {
        console.error("Login error:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      toast.success("Login realizado com sucesso!");
      login(data);
    },
    onError: (error: any) => {
      console.error("Mutation error:", error);
      toast.error("Falha no login, verifique suas credenciais.");
    },
  });

  const onSubmit = (data: LoginFormData) => {
    mutation.mutate(data);
  };

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
        <div className="grid gap-6">
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
                <div className="flex items-center justify-between">
                  <FormLabel>Senha</FormLabel>
                  <a
                    href="/forgot-password"
                    className="text-xs text-muted-foreground hover:text-primary transition-colors underline underline-offset-4"
                  >
                    Esqueceu sua senha?
                  </a>
                </div>
                <FormControl>
                  <Input type="password" showPasswordToggle={true} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Botão login normal */}
          <Button
            type="submit"
            className="w-full"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Entrando..." : "Login"}
          </Button>

          {/* Divisor */}
          <div className="after:border-border relative text-center text-sm">
            <span className="text-muted-foreground relative z-10 px-2">
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
            <img
              src="/images/google-color.svg"
              alt="Google Logo"
              className="h-4 w-4"
            />
            Entrar com Google
          </Button>
        </div>

        {/* Link para cadastro */}
        <div
          className="text-center text-sm"
          onClick={(e) => {
            e.preventDefault();
            navigate("/register");
          }}
        >
          Não tem uma conta?{" "}
          <a href="#" className="underline underline-offset-4">
            Cadastre-se
          </a>
        </div>
      </form>
    </Form>
  );
}
