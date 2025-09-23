import { useParams, useNavigate } from "react-router-dom";
import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Page } from "@/components/Layout/Page";
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
    <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 transition-all duration-200 hover:shadow-lg hover:border-slate-300">
      {/* Header da pergunta */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-emerald-500 text-white">
              <CheckCircle className="w-4 h-4" />
            </div>
            <span className="text-sm text-slate-500 font-medium">
              Pergunta {index + 1}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-slate-800 leading-relaxed mb-3">
            {response.question.question}
          </h3>
        </div>
      </div>

      {/* Resposta */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
        <div className="flex-1">
          <p className="text-sm text-emerald-700 font-medium mb-1">
            Sua resposta:
          </p>
          <p className="text-emerald-800 font-semibold">
            {response.answer.value}
          </p>
        </div>
      </div>

      {/* Data da resposta */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Calendar className="w-3 h-3" />
        Respondido em:{" "}
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
    return (
      <Page title="Carregando...">
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 text-sky-500 animate-spin rounded-full border-2 border-sky-500 border-t-transparent" />
            <span className="text-slate-600">Carregando suas respostas...</span>
          </div>
        </div>
      </Page>
    );
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
          <div className="text-slate-600 text-lg mb-4">
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
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header do bloco */}
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                {blockTitle}
              </h2>
              <p className="text-slate-600 leading-relaxed">
                Suas respostas foram salvas com sucesso.
              </p>
              <div className="mt-4 flex items-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  ✅ {responses.userAnswers.length} respostas registradas
                </span>
                <span className="flex items-center gap-1">
                  📅 Última atualização:{" "}
                  {new Date(
                    Math.max(
                      ...responses.userAnswers.map((r) => new Date(r.createdAt).getTime())
                    )
                  ).toLocaleDateString("pt-BR")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de respostas */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
            <div className="w-2 h-6 bg-gradient-to-b from-emerald-500 to-green-600 rounded-full"></div>
            Suas Respostas
          </h3>

          <div className="space-y-4">
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
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h3 className="font-semibold text-slate-800">
                Resumo das suas respostas
              </h3>
              <p className="text-sm text-slate-600">
                Você pode consultar suas respostas a qualquer momento ou
                continuar com outros questionários.
              </p>
            </div>
            <div>
              <Button
                onClick={() => navigate("/questionnaire")}
                className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar aos Questionários
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}
