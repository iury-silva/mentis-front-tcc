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
    <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3">
      <div className="flex items-start gap-3">
        <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-800 mb-3 leading-relaxed">
            {question.question}
          </h3>
          <div className="bg-white rounded-lg border border-emerald-200 p-3">
            <p className="text-sm text-emerald-700 font-medium mb-1">
              Sua resposta:
            </p>
            <p className="text-emerald-800 font-semibold break-words">
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
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 gap-0 overflow-hidden">
        {/* Header do Modal */}
        <DialogHeader className="bg-gradient-to-r from-emerald-50 to-green-50 border-b border-emerald-200 p-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl font-bold text-slate-800 mb-1">
                Revisar Respostas
              </DialogTitle>
              <DialogDescription className="text-slate-600">
                Confirme suas respostas antes de finalizar o questionário
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Conteúdo do Modal com ScrollArea */}
        <ScrollArea className="flex-1 max-h-[60vh] p-6">
          <div className="space-y-4 pr-4">
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
        <div className="bg-slate-50 border-t border-slate-200 p-6 pt-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <Button
              onClick={onClose}
              variant="outline"
              className="gap-2"
              disabled={isLoading}
            >
              <Edit3 className="w-4 h-4" />
              Editar Respostas
            </Button>
            <Button
              onClick={onConfirm}
              className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Clock className="w-4 h-4 animate-spin" />
                  Finalizando...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Confirmar e Finalizar
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
