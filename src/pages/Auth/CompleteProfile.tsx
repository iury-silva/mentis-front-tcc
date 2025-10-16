import { useAuth } from "@/auth/useAuth";
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
import { api } from "@/api";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { formatPhone } from "@/utils/format/phoneFormat";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import { ArrowDesign, ArtDesign } from "../../assets/svgs";
import { Checkbox } from "@/components/ui/checkbox";
import { TermsModal } from "@/components/Terms/TermsModal";

const completeProfileSchema = z.object({
  state: z.string().nonempty("Estado é obrigatório"),
  city: z.string().nonempty("Cidade é obrigatório"),
  phone: z
    .string()
    .nonempty("Telefone é obrigatório")
    .refine((val) => !val || /^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(val), {
      message: "Telefone inválido",
    }),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "Você deve aceitar os Termos de Uso",
  }),
  acceptPrivacy: z.boolean().refine((val) => val === true, {
    message: "Você deve aceitar a Política de Privacidade",
  }),
});

type CompleteProfileFormData = z.infer<typeof completeProfileSchema>;

type CompleteProfileApiData = {
  state: string;
  city: string;
  phone: string;
}

export default function CompleteProfile() {
  const { profileCompleted, user, refreshUser, logout } = useAuth();
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [states, setStates] = useState<
    { id: number; nome: string; sigla: string }[]
  >([]);
  const [cities, setCities] = useState<
    { id: number; nome: string; codigo_ibge: number }[]
  >([]);
  const [selectedState, setSelectedState] = useState<string>("");
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async (data: CompleteProfileApiData) => {
      await api.put(`/users/complete-profile/${user?.id}`, data);
      toast.success("Perfil atualizado com sucesso!");
      return data;
    },
    onSuccess: () => {
      refreshUser();
      if (user?.role.includes("admin")) {
        navigate("/dashboard");
      } else {
        navigate("/dashboard-user");
      }
    },
    onError: (error) => {
      console.error("Erro ao atualizar perfil:", error);
      toast.error("Erro ao atualizar perfil. Tente novamente.");
    },
  });

  useEffect(() => {
    async function fetchStates() {
      try {
        const data = await brasilApiService.getStates();
        setStates(data);
      } catch (error) {
        console.error("Erro ao buscar estados:", error);
        toast.error("Erro ao buscar estados. Tente novamente.");
      }
    }

    fetchStates();
  }, []);

  useEffect(() => {
    async function fetchCities() {
      if (!selectedState) {
        setCities([]);
        return;
      }

      try {
        const data = await brasilApiService.getCities(selectedState);
        setCities(data);
      } catch (error) {
        console.error("Erro ao buscar cidades:", error);
        toast.error("Erro ao buscar cidades. Tente novamente.");
      }
    }

    fetchCities();
  }, [selectedState]);

  const form = useForm<CompleteProfileFormData>({
    resolver: zodResolver(completeProfileSchema),
    defaultValues: {
      state: "",
      city: "",
      phone: "",
      acceptTerms: false,
      acceptPrivacy: false,
    },
  });

  const onSubmit = async (data: CompleteProfileApiData) => {
    try {
      mutation.mutate({
        state: data.state,
        city: data.city,
        phone: data.phone,
      });
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast.error("Erro ao atualizar perfil. Tente novamente.");
    }
  };

  if (profileCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Redirecionando...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen flex flex-col justify-center items-center">
        <div className="w-full max-w-md p-6 relative">
          <ArrowDesign
            width={60}
            className="absolute -top-12 -right-12 hidden md:block"
          />
          <ArtDesign
            width={99}
            height={66}
            className="absolute -bottom-4 -left-18 hidden md:block"
          />
          <div className="text-xl text-start mb-6 flex flex-col items-center">
            <img
              src="/images/logo-mentisV2.png"
              alt="logoMentis"
              className="mb-6 h-12"
            />
            <span>Hey, {user?.name.split(" ")[0]}! Estamos quase lá</span>
            <span className="text-sm text-muted-foreground text-center">
              Complete seu perfil para continuar
            </span>
          </div>
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
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

                <Button type="submit" className="w-full">
                  Concluir
                </Button>
              </form>
            </Form>

            <TermsModal
              open={showTermsModal}
              onOpenChange={setShowTermsModal}
            />

            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              <ArrowLeft className="mr-2" />
              Cancelar e Voltar ao Login
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
