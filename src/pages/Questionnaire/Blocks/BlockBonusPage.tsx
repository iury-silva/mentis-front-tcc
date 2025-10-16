import { api } from "@/api";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Gift,
  Download,
  ExternalLink,
  FileText,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {PageCustom} from "@/components/Layout/PageCustom";

interface BlockBonusPageProps {
  link?: string;
}

export default function BlockBonusPage() {
  const { blockId } = useParams<{ blockId: string }>();
  const navigate = useNavigate();

  const {
    data: blockData,
    isLoading,
    error,
  } = useQuery<BlockBonusPageProps>({
    queryKey: ["blockBonus", blockId],
    queryFn: () =>
      api.get(`/questionnaire/bonus/${blockId}`).then((res) => res ?? null),
    enabled: !!blockId,
  });

  if (isLoading) {
    return (
      <PageCustom
        title="Carregando Bonificação"
        subtitle="Aguarde enquanto preparamos seu material exclusivo..."
        icon={
          <div className="rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 p-3">
            <Gift className="h-6 w-6 text-white" />
          </div>
        }
      >
        <div className="flex items-center justify-center py-20">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground animate-pulse">Carregando...</p>
          </div>
        </div>
      </PageCustom>
    );
  }

  if (error) {
    return (
      <PageCustom
        title="Erro ao Carregar"
        subtitle="Não foi possível carregar a bonificação"
        icon={
          <div className="rounded-full bg-gradient-to-br from-red-500 to-orange-600 p-3">
            <Gift className="h-6 w-6 text-white" />
          </div>
        }
      >
        <Card className="max-w-2xl mx-auto border-destructive/50">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
              <FileText className="w-8 h-8 text-destructive" />
            </div>
            <p className="text-destructive font-medium">
              Erro ao carregar os dados da bonificação.
            </p>
            <Button
              variant="outline"
              onClick={() => navigate("/questionnaire")}
              className="mt-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Questionários
            </Button>
          </CardContent>
        </Card>
      </PageCustom>
    );
  }

  if (!blockData?.link) {
    return (
      <PageCustom
        title="Bonificação Não Encontrada"
        subtitle="Nenhum material disponível no momento"
        icon={
          <div className="rounded-full bg-gradient-to-br from-gray-500 to-gray-600 p-3">
            <Gift className="h-6 w-6 text-white" />
          </div>
        }
      >
        <Card className="max-w-2xl mx-auto">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">
              Nenhum PDF de bonificação foi encontrado para este bloco.
            </p>
            <Button
              variant="outline"
              onClick={() => navigate("/questionnaire")}
              className="mt-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para Questionários
            </Button>
          </CardContent>
        </Card>
      </PageCustom>
    );
  }

  return (
    <PageCustom
      title="Bonificação Especial"
      subtitle="Parabéns! Você desbloqueou um material exclusivo"
      icon={
        <div className="rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 p-3">
          <Gift className="h-6 w-6 text-white" />
        </div>
      }
      actions={
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/questionnaire")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      }
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Card de Sucesso */}
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-yellow-500/5">
          <CardContent>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  Conquista Desbloqueada!
                  <Sparkles className="w-5 h-5 text-yellow-500" />
                </h3>
                <p className="text-muted-foreground">
                  Você completou as atividades necessárias e ganhou acesso ao
                  material de bonificação. Este conteúdo exclusivo foi preparado
                  especialmente para você.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card Principal do PDF */}
        <Card className="overflow-hidden pt-0">
          <div className="bg-gradient-to-br from-yellow-500 via-orange-500 to-orange-400 p-1">
            <div className="bg-background rounded-t-lg">
              <CardHeader className="text-center pb-4 mt-0">
                <div className="mx-auto m-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full blur-lg opacity-50 animate-pulse"></div>
                    <div className="relative w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center">
                      <FileText className="w-10 h-10 text-white" />
                    </div>
                  </div>
                </div>
                <CardTitle className="text-2xl">Material Exclusivo</CardTitle>
                <CardDescription className="text-base">
                  Seu PDF de bonificação está pronto para ser acessado
                </CardDescription>
              </CardHeader>
            </div>
          </div>

          <CardContent className="pt-6 space-y-6">
            {/* Badges de Informação */}
            <div className="flex flex-wrap justify-center gap-2">
              <Badge variant="secondary" className="gap-1">
                <FileText className="w-3 h-3" />
                Formato PDF
              </Badge>
              <Badge variant="secondary" className="gap-1">
                <Sparkles className="w-3 h-3" />
                Conteúdo Exclusivo
              </Badge>
              <Badge variant="secondary" className="gap-1">
                <Download className="w-3 h-3" />
                Download Disponível
              </Badge>
            </div>

            <Separator />

            {/* Descrição */}
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Clique no botão abaixo para abrir seu material de bonificação. O
                PDF será aberto em uma nova aba.
              </p>
            </div>

            {/* Botões de Ação */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Button
                size="lg"
                className="group bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700"
                asChild
              >
                <a
                  href={blockData.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Abrir Material
                </a>
              </Button>
            </div>

            {/* Nota de Rodapé */}
            <div className="pt-4 text-center">
              <p className="text-xs text-muted-foreground">
                💡 Dica: Salve este material para consultas futuras
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Card de Informação Adicional */}
        <Card className="border-dashed">
          <CardContent>
            <div className="flex items-start gap-3 text-sm">
              <div className="flex-shrink-0 mt-0.5">
                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-blue-500" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="font-medium">Continue progredindo!</p>
                <p className="text-muted-foreground">
                  Complete mais questionários para desbloquear novos conteúdos e
                  bonificações exclusivas.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageCustom>
  );
}
