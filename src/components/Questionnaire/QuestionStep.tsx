import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface Question {
  id: string;
  question: string;
  type: "text" | "multiple_choice";
  options?: string[] | null;
}

interface QuestionStepProps {
  question: Question;
  answer?: string;
  onAnswer: (value: string) => void;
  questionNumber: number;
  totalQuestions: number;
}

export function QuestionStep({
  question,
  answer,
  onAnswer,
  questionNumber,
  totalQuestions,
}: QuestionStepProps) {
  const [localValue, setLocalValue] = useState(answer || "");

  useEffect(() => {
    setLocalValue(answer || "");
  }, [answer]);

  const handleBlur = () => {
    onAnswer(localValue);
  };

  const handleRadioChange = (value: string) => {
    setLocalValue(value);
    onAnswer(value);
  };

  return (
    <div className="question-container bg-background rounded-xl sm:rounded-2xl border border-border p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header simplificado */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm sm:text-base font-bold">
            {questionNumber}
          </div>
          <div className="flex-1">
            <span className="text-xs sm:text-sm text-muted-foreground font-medium">
              Pergunta {questionNumber} de {totalQuestions}
            </span>
            <div className="w-full bg-muted rounded-full h-1.5 mt-1">
              <div
                className="bg-primary h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground leading-relaxed">
          {question.question}
        </h2>
      </div>

      {/* Conteúdo da pergunta */}
      <div className="space-y-4">
        {question.type === "text" ? (
          <div className="space-y-3">
            <Input
              value={localValue}
              onChange={(e) => setLocalValue(e.target.value)}
              onBlur={handleBlur}
              placeholder="Digite sua resposta aqui..."
              className="w-full p-3 sm:p-4 rounded-lg border-border focus:border-primary/50 focus:ring-primary/20 transition-all"
            />
          </div>
        ) : (
          <div className="space-y-3">
            <RadioGroup
              value={answer || ""}
              onValueChange={handleRadioChange}
              className="space-y-2 sm:space-y-3"
            >
              {question.options?.map((opt, index) => (
                <div key={opt}>
                  <Label
                    htmlFor={`${question.id}-${opt}`}
                    className={`flex items-start space-x-3 p-3 sm:p-4 rounded-lg border-2 transition-all cursor-pointer w-full ${
                      answer === opt
                        ? "border-primary/50 bg-primary/5"
                        : "border-border hover:border-accent hover:bg-muted"
                    }`}
                  >
                    <RadioGroupItem
                      value={opt}
                      id={`${question.id}-${opt}`}
                      className="mt-0.5"
                    />
                    <div className="flex-1 text-foreground leading-relaxed">
                      <span className="font-medium text-muted-foreground text-sm mr-2">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      <span className="text-sm sm:text-base">{opt}</span>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}
      </div>
    </div>
  );
}
