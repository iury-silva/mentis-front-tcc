import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { api } from "@/api";
import { useAuth } from "@/auth/useAuth";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const consentSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  cpf: z
    .string()
    .min(1, "CPF é obrigatório")
    .refine((val) => val.replace(/\D/g, "").length === 11, {
      message: "CPF deve ter 11 dígitos",
    }),
  city: z.string().min(2, "Cidade deve ter pelo menos 2 caracteres"),
  agreed: z.boolean().refine((val) => val === true, {
    message: "Você deve concordar com os termos",
  }),
});

type ConsentFormData = z.infer<typeof consentSchema>;

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  termsHtml: string;
  title: string;
}

export function TermsModal({
  isOpen,
  onClose,
  onAccept,
  termsHtml,
  title,
}: TermsModalProps) {
  const { user } = useAuth();

  const form = useForm<ConsentFormData>({
    resolver: zodResolver(consentSchema),
    defaultValues: {
      name: user?.name || "",
      cpf: "",
      city: "",
      agreed: false,
    },
  });

  if (!isOpen) return null;

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "");

    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }
    return numbers
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  };

  const onSubmit = async (data: ConsentFormData) => {
    try {
      await api.post("/questionnaire/consent", {
        name: data.name,
        cpf: data.cpf.replace(/\D/g, ""),
        city: data.city,
      });

      toast.success("Termo de consentimento aceito com sucesso!");
      onAccept();
    } catch (error) {
      console.error("Erro ao salvar consentimento:", error);
      toast.error("Erro ao salvar consentimento. Tente novamente.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-[95vw] sm:min-w-[70vw] max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl md:text-2xl">
            Termo de Consentimento
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            {title}
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[60vh] pr-2">
          {/* Termos de Consentimento */}
          <div
            className="mt-4 mb-6 text-sm leading-relaxed text-muted-foreground"
            dangerouslySetInnerHTML={{
              __html: termsHtml
                .replace(
                  /<h2>/g,
                  '<h2 class="text-lg font-semibold text-foreground mt-6 mb-3 first:mt-0">'
                )
                .replace(
                  /<h1>/g,
                  '<h1 class="text-xl font-bold text-foreground mt-6 mb-4 first:mt-0">'
                )
                .replace(
                  /<p>/g,
                  '<p class="my-3 text-muted-foreground leading-relaxed">'
                )
                .replace(
                  /<ul>/g,
                  '<ul class="my-3 pl-6 text-muted-foreground list-disc">'
                )
                .replace(/<li>/g, '<li class="my-1 text-muted-foreground">')
                .replace(
                  /<strong>/g,
                  '<strong class="font-semibold text-foreground">'
                )
                .replace(
                  /<a /g,
                  '<a class="text-primary underline hover:text-primary/80" '
                ),
            }}
          />

          {/* Formulário de Dados Pessoais */}
          <div className="mt-6 pt-6 border-t">
            <div className="mb-4">
              <h3 className="font-semibold mb-2">
                Identificação do Participante
              </h3>
              <p className="text-sm text-muted-foreground">
                Conforme exigência do Comitê de Ética em Pesquisa.
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
                      <FormLabel>Nome Completo</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Digite seu nome completo"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cpf"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPF</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="000.000.000-00"
                          maxLength={14}
                          {...field}
                          onChange={(e) => {
                            const formatted = formatCPF(e.target.value);
                            field.onChange(formatted);
                          }}
                        />
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
                        <Input placeholder="Digite sua cidade" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>
        </div>

        {/* Footer */}
        <Form {...form}>
          <div className="space-y-4 pt-4 border-t">
            <FormField
              control={form.control}
              name="agreed"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-start space-x-3">
                    <FormControl>
                      <span>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id="consent-checkbox"
                        />
                        <label
                          className="text-sm cursor-pointer leading-relaxed ml-2"
                          htmlFor="consent-checkbox"
                        >
                          Li e concordo com os termos de consentimento livre e
                          esclarecido apresentados acima. Compreendo que minha
                          participação é voluntária e que posso retirar meu
                          consentimento a qualquer momento.
                        </label>
                      </span>
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                variant="outline"
                onClick={onClose}
                disabled={form.formState.isSubmitting}
              >
                Não aceito
              </Button>
              <Button
                onClick={form.handleSubmit(onSubmit)}
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting
                  ? "Salvando..."
                  : "Aceito e desejo continuar"}
              </Button>
            </DialogFooter>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
