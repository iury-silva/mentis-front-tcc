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
import { useState, useEffect } from "react";
import { ArrowLeftIcon, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import { brasilApiService } from "@/services/brasil.api.service";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { formatPhone } from "@/utils/format/phoneFormat";
import { Checkbox } from "@/components/ui/checkbox";
import { TermsModal } from "@/components/Terms/TermsModal";

// Schema de validação Zod para registro
const registerSchema = z
  .object({
    name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    email: z.email("Email inválido"),
    state: z.string().nonempty("Estado é obrigatório"),
    city: z.string().nonempty("Cidade é obrigatória"),
    phone: z
      .string()
      .nonempty("Telefone é obrigatório")
      .refine((val) => !val || /^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(val), {
        message: "Telefone inválido",
      }),
    password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "Você deve aceitar os Termos de Uso",
    }),
    acceptPrivacy: z.boolean().refine((val) => val === true, {
      message: "Você deve aceitar a Política de Privacidade",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showVerifyEmailModal, setShowVerifyEmailModal] = useState(false);
  const [states, setStates] = useState<
    Array<{ nome: string; sigla: string; id: number }>
  >([]);
  const [cities, setCities] = useState<
    Array<{ nome: string; codigo_ibge: number }>
  >([]);
  const [selectedState, setSelectedState] = useState<string>("");

  // Carrega os estados ao montar o componente
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const data = await brasilApiService.getStates();
        data.sort((a: { nome: string }, b: { nome: string }) =>
          a.nome.localeCompare(b.nome)
        );
        setStates(data);
      } catch (error) {
        console.error("Erro ao buscar estados:", error);
      }
    };
    fetchStates();
  }, []);

  // Carrega as cidades quando o estado selecionado mudar
  useEffect(() => {
    if (selectedState) {
      const fetchCities = async () => {
        try {
          const data = await brasilApiService.getCities(selectedState);
          setCities(data);
        } catch (error) {
          console.error("Erro ao buscar cidades:", error);
        }
      };
      fetchCities();
    } else {
      setCities([]);
    }
  }, [selectedState]);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      state: "",
      city: "",
      phone: "",
      acceptTerms: false,
      acceptPrivacy: false,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    try {
      await api.post("/users", {
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone,
        state: data.state,
        city: data.city,
      });
      toast.success(
        "Cadastro realizado com sucesso! Faça login para continuar."
      );
      setShowVerifyEmailModal(true);
      // navigate("/login");
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      toast.error("Erro ao cadastrar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseVerifyEmailModal = () => {
    setShowVerifyEmailModal(false);
    navigate("/login");
  };

  const handleGoogleRegister = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  return (
    <div className="relative grid min-h-sreen lg:grid-cols-2 dark:from-primary/10 dark:to-muted/20 dark:bg-gradient-to-br">
      {/* Logo M no canto esquerdo (desktop) */}
      <div className="absolute top-4 left-4 hidden lg:block z-20">
        <img src="/images/icone-mentisV2.png" alt="Logo M" className="w-10" />
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
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            setSelectedState(value);
                          }}
                          value={field.value || ""}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione seu estado" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Estados</SelectLabel>
                              {states.map((estado) => (
                                <SelectItem
                                  key={estado.id}
                                  value={estado.sigla}
                                >
                                  {estado.nome}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || ""}
                          disabled={cities.length === 0}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione sua cidade" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Cidades</SelectLabel>
                              {cities.map((city) => (
                                <SelectItem
                                  key={city.codigo_ibge}
                                  value={city.nome}
                                >
                                  {city.nome.charAt(0).toUpperCase() +
                                    city.nome.slice(1).toLowerCase()}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Seu telefone"
                          {...field}
                          onChange={(e) => {
                            field.onChange(formatPhone(e.target.value));
                          }}
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

                <div className="space-y-4 pt-2">
                  <FormField
                    control={form.control}
                    name="acceptTerms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm font-normal">
                            Aceito os{" "}
                            <button
                              type="button"
                              onClick={() => setShowTermsModal(true)}
                              className="text-primary hover:underline font-medium"
                            >
                              Termos de Uso
                            </button>
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="acceptPrivacy"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm font-normal">
                            Aceito a{" "}
                            <button
                              type="button"
                              onClick={() => setShowTermsModal(true)}
                              className="text-primary hover:underline font-medium"
                            >
                              Política de Privacidade
                            </button>
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Criando conta..." : "Criar conta"}
                </Button>
              </form>
            </Form>

            <TermsModal
              open={showTermsModal}
              onOpenChange={setShowTermsModal}
            />

            <div className="relative text-center text-sm">
              <span className="relative z-10 px-2 text-muted-foreground">
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
              <img
                src="/images/google-color.svg"
                alt="Google Logo"
                className="h-4 w-4"
              />
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
      {/* Left side - Avatar grande + textos + lista */}
      <div className="hidden lg:flex overflow-hidden h-screen sticky top-0">
        <div className="flex flex-col items-center justify-start p-10 bg-gradient-to-b from-primary/10 to-muted/20 dark:from-primary/20 dark:to-muted text-center w-full">
          {/* Avatar maior, com destaque */}
          <img
            src="/images/register.png"
            alt="Mentis Ilustração"
            className="drop-shadow-xl border-6 border-black rounded-xl absolute -bottom-2 -right-12"
          />
          <h2 className="mt-2 text-3xl font-bold">Bem-vindo ao Mentis!</h2>
          <p className="mt-2 text-lg text-muted-foreground">
            Sua jornada para uma mente mais saudável começa aqui.
          </p>
          <ul className="mt-6 space-y-2 text-left">
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
      <Dialog
        open={showVerifyEmailModal}
        onOpenChange={handleCloseVerifyEmailModal}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verifique seu Email</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Um email de verificação foi enviado para o seu endereço de email.
            Por favor, verifique sua caixa de entrada e clique no link para
            ativar sua conta.
          </DialogDescription>
          <DialogFooter>
            <Button onClick={handleCloseVerifyEmailModal}>
              <ArrowLeftIcon className="w-4 h-4" />
              Ir para Login
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
