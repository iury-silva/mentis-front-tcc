import { useParams, useNavigate } from "react-router-dom";
import { api } from "@/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Page } from "@/components/Layout/Page";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/auth/useAuth";
import toast from "react-hot-toast";
import { ArrowLeft, Eye } from "lucide-react";
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
  type: "text" | "multiple_choice";
  options?: string[] | null;
}

type QuestionsResponse = Question[];

// Skeleton Component para perguntas
const QuestionSkeleton = () => (
  <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
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
  </Page>
);

export default function BlockDetailPage() {
  const { blockId } = useParams<{ blockId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [answers, setAnswers] = useState<Record<string, { answer: string }>>(
    {}
  );
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showBonificationModal, setShowBonificationModal] = useState(true);
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
      setShowBonificationModal(true);
    },
    onError: (error) => {
      console.error("Erro ao salvar respostas:", error);
      toast.error("Erro ao salvar respostas. Tente novamente.");
    },
  });

  const finishBlock = () => {
    setShowBonificationModal(false);
    navigate("/questionnaire");
  };

  const { data: questions = [], isLoading, isError } = query;

  const handleAnswer = useCallback((questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { answer: value },
    }));
  }, []);

  const currentQuestion = questions[currentStep];
  const currentAnswer = currentQuestion
    ? answers[currentQuestion.id]?.answer
    : "";
  // Validação mais rigorosa: resposta deve existir e não ser apenas espaços em branco
  const isCurrentAnswered = currentAnswer && currentAnswer.trim().length > 0;

  const canGoNext = isCurrentAnswered;
  const canGoPrev = currentStep > 0;
  const isLastStep = currentStep === questions.length - 1;

  const answeredCount = Object.values(answers).filter(
    (a) => a.answer && a.answer.trim().length > 0
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

  if (isLoading) {
    return <BlockDetailPageSkeleton />;
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
        description="Responda às perguntas abaixo"
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
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4">
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
              answer={currentAnswer}
              onAnswer={(value) => handleAnswer(currentQuestion.id, value)}
              questionNumber={currentStep + 1}
              totalQuestions={questions.length}
            />
          )}

          {/* Controles de navegação */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
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
                  <p className="text-xs text-slate-400 mt-1">
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
                          ? "bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300"
                          : "bg-primary hover:bg-primary/90 disabled:bg-slate-300"
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
              <p className="text-xs text-slate-500">
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
                <p className="text-xs text-slate-400 mt-1">
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

      {/* Modal de Bonificação */}
      <BonificationModal
        isOpen={showBonificationModal}
        onClose={() => finishBlock()}
      />
    </>
  );
}
