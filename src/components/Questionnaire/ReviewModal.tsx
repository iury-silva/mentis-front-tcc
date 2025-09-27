import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle, Eye, Edit3, Clock } from "lucide-react";

interface Question {
  id: string;
  question: string;
  type: "text" | "multiple_choice";
  options?: string[] | null;
}

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: Question[];
  answers: Record<string, { answer: string }>;
  onConfirm: () => void;
  isLoading: boolean;
}

function ReviewModalItem({
  question,
  answer,
  index,
}: {
  question: Question;
  answer: string;
  index: number;
}) {
  return (
    <div className="bg-muted rounded-lg sm:rounded-xl border border-border p-3 sm:p-4 space-y-2 sm:space-y-3">
      <div className="flex items-start gap-2 sm:gap-3">
        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-500 text-primary-foreground flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0 mt-0.5">
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground mb-2 sm:mb-3 leading-relaxed text-sm sm:text-base">
            {question.question}
          </h3>
          <div className="bg-background rounded-lg border border-emerald-200 dark:border-emerald-800 p-2 sm:p-3">
            <p className="text-xs sm:text-sm text-emerald-700 dark:text-emerald-300 font-medium mb-1">
              Sua resposta:
            </p>
            <p className="text-emerald-800 dark:text-emerald-200 font-semibold break-words text-sm sm:text-base">
              {answer || "Não respondida"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ReviewModal({
  isOpen,
  onClose,
  questions,
  answers,
  onConfirm,
  isLoading,
}: ReviewModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] p-0 gap-0 overflow-hidden sm:w-full">
        {/* Header do Modal */}
        <DialogHeader className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950 dark:to-green-950 border-b border-emerald-200 dark:border-emerald-800 p-4 sm:p-6 pb-3 sm:pb-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
              <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-lg sm:text-xl font-bold text-foreground mb-1">
                Revisar Respostas
              </DialogTitle>
              <DialogDescription className="text-sm sm:text-base text-muted-foreground">
                Confirme suas respostas antes de finalizar
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Conteúdo do Modal com ScrollArea */}
        <ScrollArea className="flex-1 max-h-[50vh] sm:max-h-[60vh] p-3 sm:p-6">
          <div className="space-y-3 sm:space-y-4 pr-2 sm:pr-4">
            {questions.map((question, index) => {
              const answer = answers[question.id]?.answer || "";
              return (
                <ReviewModalItem
                  key={question.id}
                  question={question}
                  answer={answer}
                  index={index}
                />
              );
            })}
          </div>
        </ScrollArea>

        {/* Footer do Modal */}
        <div className="bg-muted border-t border-border p-3 sm:p-6 pt-3 sm:pt-4">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-end">
            <Button
              onClick={onClose}
              variant="outline"
              className="gap-2 text-sm sm:text-base h-9 sm:h-10"
              disabled={isLoading}
            >
              <Edit3 className="w-4 h-4" />
              <span className="hidden sm:inline">Editar Respostas</span>
              <span className="sm:hidden">Editar</span>
            </Button>
            <Button
              onClick={onConfirm}
              className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-primary-foreground gap-2 text-sm sm:text-base h-9 sm:h-10"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Clock className="w-4 h-4 animate-spin" />
                  <span className="hidden sm:inline">Finalizando...</span>
                  <span className="sm:hidden">Finalizando...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">
                    Confirmar e Finalizar
                  </span>
                  <span className="sm:hidden">Finalizar</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ReviewModal;
