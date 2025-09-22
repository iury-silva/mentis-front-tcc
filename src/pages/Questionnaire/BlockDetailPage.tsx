import { useParams, useNavigate } from "react-router-dom";
import { api } from "@/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Page } from "@/components/Layout/Page";
import { useAuth } from "@/auth/useAuth";
import toast from "react-hot-toast";
import { ArrowLeft, CheckCircle, Clock, Eye } from "lucide-react";
import { ReviewModal } from "@/components/Questionnaire/ReviewModal";

interface Question {
  id: string;
  question: string;
  type: "text" | "multiple_choice";
  options?: string[] | null;
}

type QuestionsResponse = Question[];

function QuestionItem({
  question,
  answer,
  onAnswer,
  questionNumber,
  totalQuestions,
}: {
  question: Question;
  answer?: string;
  onAnswer: (value: string) => void;
  questionNumber: number;
  totalQuestions: number;
}) {
  const [localValue, setLocalValue] = useState(answer || "");

  useEffect(() => {
    setLocalValue(answer || "");
  }, [answer]);

  const handleBlur = () => {
    onAnswer(localValue);
  };

  const isAnswered = answer && answer.trim() !== "";

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 transition-all duration-200 hover:shadow-lg hover:border-slate-300">
      {/* Header da pergunta */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                isAnswered
                  ? "bg-emerald-500 text-white"
                  : "bg-slate-200 text-slate-600"
              }`}
            >
              {isAnswered ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                questionNumber
              )}
            </div>
            <span className="text-sm text-slate-500 font-medium">
              Pergunta {questionNumber} de {totalQuestions}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-slate-800 leading-relaxed">
            {question.question}
          </h3>
        </div>
      </div>

      {/* Conteúdo da pergunta */}
      <div className="space-y-4">
        {question.type === "text" ? (
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700">
              Sua resposta:
            </Label>
            <Input
              value={localValue}
              onChange={(e) => setLocalValue(e.target.value)}
              onBlur={handleBlur}
              placeholder="Digite sua resposta aqui..."
              className="w-full p-4 rounded-xl border-slate-200 focus:border-primary/50 focus:ring-primary/20 transition-all"
            />
          </div>
        ) : (
          <div className="space-y-3">
            <Label className="text-sm font-medium text-slate-700">
              Escolha uma opção:
            </Label>
            <RadioGroup
              value={answer || ""}
              onValueChange={onAnswer}
              className="space-y-3"
            >
              {question.options?.map((opt, index) => (
                <div key={opt} className="group">
                  <Label
                    htmlFor={`${question.id}-${opt}`}
                    className={`flex items-start space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer w-full ${
                      answer === opt
                        ? "border-primary/50 bg-primary/15"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <RadioGroupItem
                      value={opt}
                      id={`${question.id}-${opt}`}
                      className="mt-0.5"
                    />
                    <div className="flex-1 text-slate-700 leading-relaxed">
                      <span className="font-medium text-slate-500 text-sm">
                        {String.fromCharCode(65 + index)}.
                      </span>{" "}
                      {opt}
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}
      </div>

      {/* Indicador de progresso */}
      <div className="flex items-center gap-2 pt-2">
        <div className="flex-1 bg-slate-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              isAnswered ? "bg-emerald-500" : "bg-slate-300"
            }`}
            style={{ width: isAnswered ? "100%" : "0%" }}
          ></div>
        </div>
        <span className="text-xs text-slate-500">
          {isAnswered ? "Respondida" : "Pendente"}
        </span>
      </div>
    </div>
  );
}

export default function BlockDetailPage() {
  const { blockId } = useParams<{ blockId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [answers, setAnswers] = useState<Record<string, { answer: string }>>(
    {}
  );
  const [showReviewModal, setShowReviewModal] = useState(false);

  const query = useQuery<QuestionsResponse>({
    queryKey: ["block", blockId],
    queryFn: async () => {
      const res = await api.get(`/questionnaire/blocks/${blockId}`);
      return res ?? [];
    },
    enabled: !!blockId,
  });

  const saveResponsesMutation = useMutation({
    mutationFn: async (responses: {
      userId: string;
      blockId: string;
      responses: Array<{ questionId: string; value: string }>;
    }) => {
      return await api.post("/questionnaire/responses", responses);
    },
    onSuccess: () => {
      toast.success("Respostas salvas com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["questionnaire"] });
      setShowReviewModal(false);
      navigate("/questionnaire");
    },
    onError: (error) => {
      console.error("Erro ao salvar respostas:", error);
      toast.error("Erro ao salvar respostas. Tente novamente.");
    },
  });

  const { data: questions = [], isLoading, isError } = query;

  const handleAnswer = useCallback((questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { answer: value },
    }));
  }, []);

  const handleSubmit = () => {
    if (!user?.id || !blockId) {
      toast.error("Erro: dados do usuário ou bloco não encontrados");
      return;
    }

    const responses = Object.entries(answers)
      .filter(([, answerData]) => answerData.answer.trim() !== "")
      .map(([questionId, answerData]) => ({
        questionId,
        value: answerData.answer,
      }));

    if (responses.length === 0) {
      toast.error("Por favor, responda pelo menos uma pergunta");
      return;
    }

    if (responses.length < questions.length) {
      toast.error("Por favor, responda todas as perguntas antes de enviar");
      return;
    }

    // Mostrar modal de revisão em vez de enviar diretamente
    setShowReviewModal(true);
  };

  const handleConfirmSubmit = () => {
    if (!user?.id || !blockId) return;

    const responses = Object.entries(answers)
      .filter(([, answerData]) => answerData.answer.trim() !== "")
      .map(([questionId, answerData]) => ({
        questionId,
        value: answerData.answer,
      }));

    saveResponsesMutation.mutate({
      userId: user.id,
      blockId,
      responses,
    });
  };

  const answeredCount = Object.values(answers).filter(
    (a) => a.answer.trim() !== ""
  ).length;
  const progressPercentage =
    questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

  if (isLoading) {
    return (
      <Page title="Carregando...">
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-sky-500 animate-spin" />
            <span className="text-slate-600">Carregando perguntas...</span>
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
            Erro ao carregar o bloco
          </div>
          <Button onClick={() => navigate("/questionnaire")} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar aos questionários
          </Button>
        </div>
      </Page>
    );
  }

  if (!questions.length) {
    return (
      <Page title="Sem perguntas">
        <div className="text-center py-12">
          <div className="text-slate-600 text-lg mb-4">
            Nenhuma pergunta encontrada neste bloco
          </div>
          <Button onClick={() => navigate("/questionnaire")} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar aos questionários
          </Button>
        </div>
      </Page>
    );
  }

  return (
    <>
      <Page
        title="Questionário"
        description="Responda às perguntas abaixo com atenção"
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
          {/* Barra de progresso global */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800">
                Progresso do Bloco
              </h2>
              <span className="text-sm text-slate-600">
                {answeredCount} de {questions.length} respondidas
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-primary/50 to-red-400 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="text-center mt-2">
              <span className="text-sm font-medium text-slate-600">
                {Math.round(progressPercentage)}% concluído
              </span>
            </div>
          </div>

          {/* Perguntas */}
          <div className="space-y-6">
            {questions.map((q, index) => (
              <QuestionItem
                key={q.id}
                question={q}
                answer={answers[q.id]?.answer}
                onAnswer={(value) => handleAnswer(q.id, value)}
                questionNumber={index + 1}
                totalQuestions={questions.length}
              />
            ))}
          </div>

          {/* Botão de envio */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <h3 className="font-semibold text-slate-800">
                  Finalizou as respostas?
                </h3>
                <p className="text-sm text-slate-600">
                  Revise suas respostas antes de enviar. Você poderá editá-las
                  posteriormente.
                </p>
              </div>
              <Button
                onClick={handleSubmit}
                disabled={answeredCount < questions.length}
                className="bg-gradient-to-r from-primary/50 to-red-400 hover:from-primary/100 hover:to-red-500 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed gap-2"
              >
                <Eye className="w-4 h-4" />
                Revisar e Finalizar
              </Button>
            </div>
          </div>
        </div>
      </Page>

      {/* Modal de Revisão */}
      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        questions={questions}
        answers={answers}
        onConfirm={handleConfirmSubmit}
        isLoading={saveResponsesMutation.isPending}
      />
    </>
  );
}
