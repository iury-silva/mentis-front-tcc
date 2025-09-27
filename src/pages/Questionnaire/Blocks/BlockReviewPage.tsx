import { useParams, useNavigate } from "react-router-dom";
import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Page } from "@/components/Layout/Page";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/auth/useAuth";
import { ArrowLeft, CheckCircle, Calendar } from "lucide-react";

interface UserAnswerResponse {
  id: string;
  userId: string;
  questionId: string;
  answer: {
    value: string;
  };
  createdAt: string;
  question: {
    id: string;
    question: string;
    blockId: string;
  };
}

interface ResponsesData {
  userAnswers: UserAnswerResponse[];
  blockTitle: string;
}

function ResponseItem({
  response,
  index,
}: {
  response: UserAnswerResponse;
  index: number;
}) {
  return (
    <div className="bg-background rounded-xl sm:rounded-2xl border border-border p-4 sm:p-6 space-y-3 sm:space-y-4 transition-all duration-200 hover:shadow-lg hover:border-accent">
      {/* Header da pergunta */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold bg-emerald-500 text-primary-foreground">
              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
            </div>
            <span className="text-xs sm:text-sm text-muted-foreground font-medium">
              Pergunta {index + 1}
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-foreground leading-relaxed mb-2 sm:mb-3">
            {response.question.question}
          </h3>
        </div>
      </div>

      {/* Resposta */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
        <div className="flex-1">
          <p className="text-xs sm:text-sm text-emerald-700 font-medium mb-1">
            Sua resposta:
          </p>
          <p className="text-emerald-800 font-semibold text-sm sm:text-base">
            {response.answer.value}
          </p>
        </div>
      </div>

      {/* Data da resposta */}
      <div className="flex items-center gap-1 sm:gap-2 text-xs text-muted-foreground">
        <Calendar className="w-3 h-3" />
        <span className="hidden sm:inline">Respondido em: </span>
        <span className="sm:hidden">Em: </span>
        {new Date(response.createdAt).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
    </div>
  );
}

// Skeleton Components
const ResponseItemSkeleton = () => (
  <div className="bg-background rounded-xl sm:rounded-2xl border border-border p-4 sm:p-6 space-y-3 sm:space-y-4">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
          <Skeleton className="w-6 h-6 sm:w-8 sm:h-8 rounded-full" />
          <Skeleton className="h-3 sm:h-4 w-16 sm:w-20" />
        </div>
        <Skeleton className="h-5 sm:h-6 w-full mb-2 sm:mb-3" />
        <Skeleton className="h-5 sm:h-6 w-3/4 mb-3 sm:mb-4" />

        <div className="bg-muted rounded-lg sm:rounded-xl p-3 sm:p-4">
          <Skeleton className="h-3 sm:h-4 w-full" />
          <Skeleton className="h-3 sm:h-4 w-2/3 mt-2" />
        </div>
      </div>
    </div>

    <div className="flex items-center gap-1 sm:gap-2 text-sm text-muted-foreground pt-2">
      <Skeleton className="w-3 h-3 sm:w-4 sm:h-4" />
      <Skeleton className="h-3 sm:h-4 w-24 sm:w-32" />
    </div>
  </div>
);

const BlockReviewPageSkeleton = () => (
  <Page title="Carregando...">
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </div>

      {/* Summary Skeleton */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Skeleton className="w-6 h-6" />
          <Skeleton className="h-5 w-32" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3 mt-2" />
      </div>

      {/* Responses Skeleton */}
      <div className="space-y-6">
        {[...Array(3)].map((_, index) => (
          <ResponseItemSkeleton key={index} />
        ))}
      </div>

      {/* Back Button Skeleton */}
      <div className="pt-6">
        <Skeleton className="h-12 w-48 rounded-lg" />
      </div>
    </div>
  </Page>
);

export default function BlockReviewPage() {
  const { blockId } = useParams<{ blockId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    data: responses,
    isLoading,
    isError,
  } = useQuery<ResponsesData>({
    queryKey: ["responses", user?.id, blockId],
    queryFn: async () => {
      const res = await api.get(
        `/questionnaire/responses/${user?.id}/${blockId}`
      );
      return res;
    },
    enabled: !!user?.id && !!blockId,
  });

  if (isLoading) {
    return <BlockReviewPageSkeleton />;
  }

  if (isError) {
    return (
      <Page title="Erro">
        <div className="text-center py-12">
          <div className="text-red-500 text-lg mb-4">
            Erro ao carregar suas respostas
          </div>
          <Button onClick={() => navigate("/questionnaire")} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar aos questionários
          </Button>
        </div>
      </Page>
    );
  }

  if (!responses?.userAnswers || responses.userAnswers.length === 0) {
    return (
      <Page title="Sem respostas">
        <div className="text-center py-12">
          <div className="text-muted-foreground text-lg mb-4">
            Nenhuma resposta encontrada para este bloco
          </div>
          <Button
            onClick={() => navigate(`/questionnaire/blocks/${blockId}`)}
            className="gap-2"
          >
            Responder questionário
          </Button>
        </div>
      </Page>
    );
  }

  const blockTitle = responses?.blockTitle
    ? `${responses.blockTitle}`
    : "Revisão de Respostas";

  return (
    <Page
      title="Revisão de Respostas"
      description="Revise e edite suas respostas do questionário"
      actions={
        <Button
          onClick={() => navigate("/questionnaire")}
          variant="outline"
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
      }
    >
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        {/* Header do bloco */}
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-emerald-200">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground dark:text-muted mb-1 sm:mb-2">
                {blockTitle}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Suas respostas foram salvas com sucesso.
              </p>
              <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  ✅ {responses.userAnswers.length} respostas registradas
                </span>
                <span className="flex items-center gap-1">
                  📅{" "}
                  <span className="hidden sm:inline">Última atualização: </span>
                  <span className="sm:hidden">Atualização: </span>
                  {new Date(
                    Math.max(
                      ...responses.userAnswers.map((r) =>
                        new Date(r.createdAt).getTime()
                      )
                    )
                  ).toLocaleDateString("pt-BR")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de respostas */}
        <div className="space-y-4 sm:space-y-6">
          <h3 className="text-base sm:text-lg font-semibold text-foreground flex items-center gap-2">
            <div className="w-1.5 sm:w-2 h-5 sm:h-6 bg-gradient-to-b from-emerald-500 to-green-600 rounded-full"></div>
            Suas Respostas
          </h3>

          <div className="space-y-3 sm:space-y-4">
            {responses.userAnswers.map((response, index) => (
              <ResponseItem
                key={response.id}
                response={response}
                index={index}
              />
            ))}
          </div>
        </div>

        {/* Ações finais */}
        <div className="bg-background rounded-xl sm:rounded-2xl border border-border p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <div className="text-center sm:text-left">
              <h3 className="font-semibold text-foreground text-sm sm:text-base">
                Resumo das suas respostas
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Você pode consultar suas respostas a qualquer momento ou
                continuar com outros questionários.
              </p>
            </div>
            <div>
              <Button
                onClick={() => navigate("/questionnaire")}
                className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-primary-foreground gap-2 text-sm sm:text-base h-9 sm:h-10 w-full sm:w-auto"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">
                  Voltar aos Questionários
                </span>
                <span className="sm:hidden">Voltar</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}
