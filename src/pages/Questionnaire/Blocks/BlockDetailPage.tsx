import { useParams, useNavigate } from "react-router-dom";
import { api } from "@/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { PageCustom } from "@/components/Layout/PageCustom";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/auth/useAuth";
import toast from "react-hot-toast";
import { ArrowLeft, Eye, FileQuestion } from "lucide-react";
import { ReviewModal } from "@/components/Questionnaire/ReviewModal";
import { QuestionStep } from "@/components/Questionnaire/QuestionStep";
import { BonificationModal } from "@/components/Questionnaire/BonificationModal";
import { Trophy } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Question {
  id: string;
  question: string;
  type:
    | "text"
    | "single_choice"
    | "single_choice_with_text"
    | "multiple_choice"
    | "multiple_choice_with_text"
    | "city_state";
  options?: string[] | null;
}

interface Answer {
  answer: string | string[]; // string para single/text/city_state, array para multiple
  additionalText?: string; // Para *_with_text
  state?: string; // Para city_state
  city?: string; // Para city_state
}

type QuestionsResponse = Question[];

// Skeleton Component para perguntas
const QuestionSkeleton = () => (
  <div className="bg-background rounded-2xl border border-border p-6 space-y-6">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Skeleton className="w-8 h-8 rounded-full" />
        <Skeleton className="h-2 w-24 rounded-full" />
      </div>
      <Skeleton className="w-6 h-6 rounded-full" />
    </div>

    <div className="space-y-4">
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-6 w-3/4" />
    </div>

    <div className="space-y-3">
      <Skeleton className="h-10 w-full rounded-lg" />
      <Skeleton className="h-10 w-full rounded-lg" />
      <Skeleton className="h-10 w-full rounded-lg" />
    </div>
  </div>
);

const BlockDetailPageSkeleton = () => (
  <PageCustom
    title="Carregando..."
    icon={
      <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
        <FileQuestion className="w-5 h-5 text-white" />
      </div>
    }
  >
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
        <Skeleton className="w-24 h-10 rounded-lg" />
      </div>

      {/* Progress Skeleton */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-2 w-full rounded-full" />
      </div>

      {/* Questions Skeleton */}
      <div className="space-y-6">
        {[...Array(3)].map((_, index) => (
          <QuestionSkeleton key={index} />
        ))}
      </div>

      {/* Action Buttons Skeleton */}
      <div className="flex gap-3 pt-6">
        <Skeleton className="h-12 w-32 rounded-lg" />
        <Skeleton className="h-12 w-40 rounded-lg" />
      </div>
    </div>
  </PageCustom>
);

export default function BlockDetailPage() {
  const { blockId } = useParams<{ blockId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showBonificationModal, setShowBonificationModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Função para scroll inteligente apenas quando necessário
  const scrollToQuestionIfNeeded = () => {
    setTimeout(() => {
      const questionContainer = document.querySelector(".question-container");
      if (questionContainer) {
        const rect = questionContainer.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        // Só faz scroll se a pergunta não estiver completamente visível
        if (rect.top < 0 || rect.top > viewportHeight * 0.3) {
          const y = rect.top + window.scrollY - 100; // aplica offset de -100px
          window.scrollTo({
            top: y,
            behavior: "smooth",
          });
        }
      }
    }, 100);
  };

  // Query para verificar se o usuário pode acessar este bloco
  const blockAccessQuery = useQuery({
    queryKey: ["block-access", blockId, user?.id],
    queryFn: async () => {
      const res = await api.get(
        `/questionnaire/blocks/${blockId}/access?userId=${user?.id}`
      );
      return res;
    },
    enabled: !!blockId && !!user?.id,
    retry: false, // Não tentar novamente em caso de erro 403/401
    refetchOnWindowFocus: false,
  });

  const query = useQuery<QuestionsResponse>({
    queryKey: ["block", blockId],
    queryFn: async () => {
      const res = await api.get(`/questionnaire/blocks/${blockId}`);
      return res ?? [];
    },
    enabled: !!blockId && blockAccessQuery.data?.canAccess === true,
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
      setShowBonificationModal(true);
    },
    onError: (error: Error) => {
      console.error("Erro ao salvar respostas:", error);

      toast.error("Erro ao salvar respostas. Tente novamente.");
    },
  });

  const finishBlock = () => {
    setShowBonificationModal(false);
    navigate("/questionnaire");
    queryClient.invalidateQueries({ queryKey: ["block-access"] });
  };

  const { data: questions = [], isLoading, isError } = query;
  const {
    data: accessData,
    isLoading: isLoadingAccess,
    isError: isAccessError,
  } = blockAccessQuery;

  const handleAnswer = useCallback((questionId: string, answerData: Answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerData,
    }));
  }, []);

  const currentQuestion = questions[currentStep];
  const currentAnswerData = currentQuestion
    ? answers[currentQuestion.id]
    : undefined;

  // Função para validar se a resposta está completa
  const isAnswerValid = (
    answer: Answer | undefined,
    question: Question
  ): boolean => {
    if (!answer) return false;

    switch (question.type) {
      case "text":
        return (
          typeof answer.answer === "string" && answer.answer.trim().length > 0
        );

      case "single_choice":
        return (
          typeof answer.answer === "string" && answer.answer.trim().length > 0
        );

      case "single_choice_with_text": {
        const singleAnswer = answer.answer as string;
        if (!singleAnswer || singleAnswer.trim().length === 0) return false;
        // Se escolheu "Outro/Outros", precisa ter texto adicional
        if (singleAnswer === "Outro" || singleAnswer === "Outros") {
          return (
            !!answer.additionalText && answer.additionalText.trim().length > 0
          );
        }
        return true;
      }

      case "multiple_choice":
        return Array.isArray(answer.answer) && answer.answer.length > 0;

      case "multiple_choice_with_text": {
        if (!Array.isArray(answer.answer) || answer.answer.length === 0)
          return false;
        // Se "Outro/Outros" está selecionado, precisa ter texto adicional
        const hasOther = answer.answer.some(
          (opt) => opt === "Outro" || opt === "Outros"
        );
        if (hasOther) {
          return (
            !!answer.additionalText && answer.additionalText.trim().length > 0
          );
        }
        return true;
      }

      case "city_state":
        return (
          !!answer.state &&
          !!answer.city &&
          answer.state.trim().length > 0 &&
          answer.city.trim().length > 0
        );

      default:
        return false;
    }
  };

  const isCurrentAnswered = currentQuestion
    ? isAnswerValid(currentAnswerData, currentQuestion)
    : false;

  const canGoNext = isCurrentAnswered;
  const canGoPrev = currentStep > 0;
  const isLastStep = currentStep === questions.length - 1;

  const answeredCount = questions.filter((q) =>
    isAnswerValid(answers[q.id], q)
  ).length;
  const allQuestionsAnswered = answeredCount === questions.length;
  // const progressPercentage =
  //   questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

  const handleNext = () => {
    if (!canGoNext) {
      toast.error("Por favor, responda a pergunta atual antes de continuar");
      return;
    }

    if (isLastStep) {
      // Se é a última pergunta, verificar se todas foram respondidas
      if (!allQuestionsAnswered) {
        toast.error(
          `Por favor, responda todas as ${questions.length} perguntas antes de finalizar`
        );
        return;
      }
      setShowReviewModal(true);
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, questions.length - 1));
      scrollToQuestionIfNeeded();
    }
  };

  const handlePrev = () => {
    if (canGoPrev) {
      setCurrentStep((prev) => Math.max(prev - 1, 0));
      scrollToQuestionIfNeeded();
    }
  };

  const handleConfirmSubmit = () => {
    if (!user?.id || !blockId) return;

    const responses = questions
      .filter((q) => isAnswerValid(answers[q.id], q))
      .map((question) => {
        const answerData = answers[question.id];
        let value: string;

        // Serializar resposta baseado no tipo
        switch (question.type) {
          case "text":
          case "single_choice":
          case "single_choice_with_text":
            value = answerData.answer as string;
            if (answerData.additionalText) {
              value += ` | Especificação: ${answerData.additionalText}`;
            }
            break;

          case "multiple_choice":
          case "multiple_choice_with_text":
            value = (answerData.answer as string[]).join("; ");
            if (answerData.additionalText) {
              value += ` | Especificação: ${answerData.additionalText}`;
            }
            break;

          case "city_state":
            value = `${answerData.city} - ${answerData.state}`;
            break;

          default:
            value = String(answerData.answer);
        }

        return {
          questionId: question.id,
          value,
        };
      });

    saveResponsesMutation.mutate({
      userId: user.id,
      blockId,
      responses,
    });
  };

  // Loading state - incluindo verificação de acesso
  if (isLoading || isLoadingAccess) {
    return <BlockDetailPageSkeleton />;
  }

  // Verificar se o usuário tem acesso ao bloco
  if (isAccessError || !accessData?.canAccess) {
    const message = accessData?.isCompleted
      ? "Este questionário já foi concluído"
      : accessData?.isLocked
      ? "Este bloco está bloqueado. Complete os blocos anteriores primeiro."
      : "Você não tem permissão para acessar este bloco";

    return (
      <PageCustom
        title="Acesso Negado"
        icon={
          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
            <FileQuestion className="w-5 h-5 text-red-500" />
          </div>
        }
      >
        <div className="text-center py-12 space-y-6">
          <div className="mx-auto w-24 h-24 bg-red-50 rounded-full flex items-center justify-center">
            <div className="text-red-500 text-4xl">🔒</div>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              {accessData?.isCompleted
                ? "Questionário Já Concluído"
                : "Acesso Bloqueado"}
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">{message}</p>
          </div>
          <div className="space-y-3">
            <Button
              onClick={() => navigate("/questionnaire")}
              className="bg-primary hover:bg-primary/90"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar aos Questionários
            </Button>
            {accessData?.isCompleted && (
              <Button
                onClick={() => navigate(`/questionnaire/responses/${blockId}`)}
                variant="outline"
              >
                Ver Suas Respostas
              </Button>
            )}
          </div>
        </div>
      </PageCustom>
    );
  }

  if (isError) {
    return (
      <PageCustom
        title="Erro"
        icon={
          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
            <FileQuestion className="w-5 h-5 text-red-500" />
          </div>
        }
      >
        <div className="text-center py-12">
          <div className="text-red-500 text-lg mb-4">
            Erro ao carregar o bloco
          </div>
          <Button onClick={() => navigate("/questionnaire")} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar aos questionários
          </Button>
        </div>
      </PageCustom>
    );
  }

  if (!questions.length) {
    return (
      <PageCustom
        title="Sem perguntas"
        icon={
          <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
            <FileQuestion className="w-5 h-5 text-gray-500" />
          </div>
        }
      >
        <div className="text-center py-12">
          <div className="text-muted-foreground text-lg mb-4">
            Nenhuma pergunta encontrada neste bloco
          </div>
          <Button onClick={() => navigate("/questionnaire")} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar aos questionários
          </Button>
        </div>
      </PageCustom>
    );
  }

  return (
    <>
      <PageCustom
        title="Questionário"
        subtitle={accessData?.blockTitle}
        icon={
          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
            <FileQuestion className="w-5 h-5 text-white" />
          </div>
        }
        actions={
          <Button
            onClick={() => navigate("/questionnaire")}
            variant="outline"
            className="gap-2"
            size="sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Sair</span>
          </Button>
        }
      >
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
          {/* Banner de Bonificação */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 border border-yellow-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <Trophy className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-yellow-800 text-sm">
                  Bonificação por Completar!
                </h3>
                <p className="text-yellow-700 text-xs mt-1">
                  Ao finalizar este questionário, você receberá uma recompensa
                  especial!
                </p>
              </div>
            </div>
          </div>

          {/* Pergunta atual */}
          {currentQuestion && (
            <QuestionStep
              question={currentQuestion}
              answer={currentAnswerData}
              onAnswer={(answerData) =>
                handleAnswer(currentQuestion.id, answerData)
              }
              questionNumber={currentStep + 1}
              totalQuestions={questions.length}
            />
          )}

          {/* Controles de navegação */}
          <div className="bg-background rounded-xl border border-border p-4">
            <div className="flex items-center justify-between gap-3">
              <Button
                onClick={handlePrev}
                disabled={!canGoPrev}
                variant="outline"
                className="gap-2 flex-1 sm:flex-none"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Anterior</span>
              </Button>

              <div className="hidden sm:block text-center flex-1">
                {isLastStep && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {allQuestionsAnswered ? (
                      <span className="text-emerald-600">
                        Todas respondidas!
                      </span>
                    ) : (
                      <span>Faltam {questions.length - answeredCount}</span>
                    )}
                  </p>
                )}
              </div>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleNext}
                      disabled={
                        !canGoNext || (isLastStep && !allQuestionsAnswered)
                      }
                      className={`gap-2 flex-1 sm:flex-none ${
                        isLastStep
                          ? "bg-emerald-500 hover:bg-emerald-600 disabled:bg-muted"
                          : "bg-primary hover:bg-primary/90 disabled:bg-muted"
                      }`}
                    >
                      {isLastStep ? (
                        <>
                          <Eye className="w-4 h-4" />
                          <span className="hidden sm:inline">Finalizar</span>
                        </>
                      ) : (
                        <>
                          <span className="hidden sm:inline">Próxima</span>
                          <ArrowLeft className="w-4 h-4 rotate-180" />
                        </>
                      )}
                    </Button>
                  </TooltipTrigger>
                  {isLastStep && allQuestionsAnswered && (
                    <TooltipContent>
                      <p className="text-sm">
                        🎉 Parabéns! Você receberá uma bonificação especial ao
                        finalizar!
                      </p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* Status mobile */}
            <div className="sm:hidden mt-3 text-center">
              <p className="text-xs text-muted-foreground">
                {isCurrentAnswered ? (
                  <span className="text-emerald-600 font-medium">
                    ✓ Pergunta respondida
                  </span>
                ) : (
                  <span className="text-amber-600 font-medium">
                    {currentQuestion?.type === "text"
                      ? "Digite uma resposta para continuar"
                      : "Escolha uma opção para continuar"}
                  </span>
                )}
              </p>
              {isLastStep && (
                <p className="text-xs text-muted-foreground mt-1">
                  {allQuestionsAnswered ? (
                    <span className="text-emerald-600">
                      Todas as perguntas respondidas!
                    </span>
                  ) : (
                    <span>
                      Faltam {questions.length - answeredCount} pergunta(s)
                    </span>
                  )}
                </p>
              )}
            </div>
          </div>
        </div>
      </PageCustom>

      {/* Modal de Revisão */}
      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        questions={questions}
        answers={answers}
        onConfirm={handleConfirmSubmit}
        isLoading={saveResponsesMutation.isPending}
      />

      {/* Modal de Bonificação */}
      <BonificationModal
        isOpen={showBonificationModal}
        onClose={() => finishBlock()}
        blockId={blockId || ""} // Passando blockId para navegacao
      />
    </>
  );
}
