import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { brasilApiService } from "@/services/brasil.api.service";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

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
  answer: string | string[];
  additionalText?: string;
  state?: string;
  city?: string;
}

interface QuestionStepProps {
  question: Question;
  answer?: Answer;
  onAnswer: (answer: Answer) => void;
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
  // Estados para city_state
  const [states, setStates] = useState<
    { id: number; nome: string; sigla: string }[]
  >([]);
  const [cities, setCities] = useState<
    { id: number; nome: string; codigo_ibge: number }[]
  >([]);
  const [selectedState, setSelectedState] = useState<string>(
    answer?.state || ""
  );

  // Fetch states
  useEffect(() => {
    if (question.type === "city_state") {
      async function fetchStates() {
        try {
          const data = await brasilApiService.getStates();
          data.sort((a: { nome: string }, b: { nome: string }) =>
            a.nome.localeCompare(b.nome)
          );
          setStates(data);
        } catch (error) {
          console.error("Erro ao buscar estados:", error);
          toast.error("Erro ao buscar estados.");
        }
      }
      fetchStates();
    }
  }, [question.type]);

  // Fetch cities
  useEffect(() => {
    if (question.type === "city_state" && selectedState) {
      async function fetchCities() {
        try {
          const data = await brasilApiService.getCities(selectedState);
          setCities(data);
        } catch (error) {
          console.error("Erro ao buscar cidades:", error);
          toast.error("Erro ao buscar cidades.");
        }
      }
      fetchCities();
    } else {
      setCities([]);
    }
  }, [selectedState, question.type]);

  // Atualizar selectedState quando answer mudar
  useEffect(() => {
    if (answer?.state) {
      setSelectedState(answer.state);
    }
  }, [answer?.state]);

  // TEXT
  if (question.type === "text") {
    return (
      <div className="question-container bg-background rounded-xl sm:rounded-2xl border border-border p-4 sm:p-6 space-y-4 sm:space-y-6">
        <QuestionHeader
          questionNumber={questionNumber}
          totalQuestions={totalQuestions}
          question={question.question}
        />
        <Textarea
          value={(answer?.answer as string) || ""}
          onChange={(e) => onAnswer({ answer: e.target.value })}
          placeholder="Digite sua resposta..."
          className="min-h-[120px] resize-none p-4 rounded-lg"
          rows={5}
        />
      </div>
    );
  }

  // SINGLE_CHOICE
  if (question.type === "single_choice") {
    return (
      <div className="question-container bg-background rounded-xl sm:rounded-2xl border border-border p-4 sm:p-6 space-y-4 sm:space-y-6">
        <QuestionHeader
          questionNumber={questionNumber}
          totalQuestions={totalQuestions}
          question={question.question}
        />
        <RadioGroup
          value={(answer?.answer as string) || ""}
          onValueChange={(value) => onAnswer({ answer: value })}
          className="space-y-3"
        >
          {question.options?.map((option, index) => (
            <div key={index}>
              <Label
                htmlFor={`${question.id}-${index}`}
                className={cn(
                  "flex items-start space-x-3 p-3 sm:p-4 rounded-lg border-2 transition-all cursor-pointer w-full",
                  answer?.answer === option
                    ? "border-primary/50 bg-primary/5"
                    : "border-border hover:border-accent hover:bg-muted"
                )}
              >
                <RadioGroupItem
                  value={option}
                  id={`${question.id}-${index}`}
                  className="mt-0.5"
                />
                <div className="flex-1 text-foreground leading-relaxed">
                  <span className="font-medium text-muted-foreground text-sm mr-2">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  <span className="text-sm sm:text-base">{option}</span>
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    );
  }

  // SINGLE_CHOICE_WITH_TEXT
  if (question.type === "single_choice_with_text") {
    const currentAnswer = (answer?.answer as string) || "";
    const hasOtherSelected =
      currentAnswer === "Outro" ||
      currentAnswer === "Outros" ||
      currentAnswer === "Conte-nos um pouco:" ||
      currentAnswer === "Quais:" ||
      currentAnswer === "Por quê?" ||
      currentAnswer === "Como tem lidado com isso?";

    return (
      <div className="question-container bg-background rounded-xl sm:rounded-2xl border border-border p-4 sm:p-6 space-y-4 sm:space-y-6">
        <QuestionHeader
          questionNumber={questionNumber}
          totalQuestions={totalQuestions}
          question={question.question}
        />
        <div className="space-y-4">
          <RadioGroup
            value={currentAnswer}
            onValueChange={(value) => {
              onAnswer({
                answer: value,
                additionalText:
                  value === "Outro" || value === "Outros"
                    ? answer?.additionalText
                    : undefined,
              });
            }}
            className="space-y-3"
          >
            {question.options?.map((option, index) => (
              <div key={index}>
                <Label
                  htmlFor={`${question.id}-${index}`}
                  className={cn(
                    "flex items-start space-x-3 p-3 sm:p-4 rounded-lg border-2 transition-all cursor-pointer w-full",
                    currentAnswer === option
                      ? "border-primary/50 bg-primary/5"
                      : "border-border hover:border-accent hover:bg-muted"
                  )}
                >
                  <RadioGroupItem
                    value={option}
                    id={`${question.id}-${index}`}
                    className="mt-0.5"
                  />
                  <div className="flex-1 text-foreground leading-relaxed">
                    <span className="font-medium text-muted-foreground text-sm mr-2">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    <span className="text-sm sm:text-base">{option}</span>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>

          {hasOtherSelected && (
            <div className="mt-4 animate-in slide-in-from-top-2 space-y-2">
              <Label htmlFor={`${question.id}-other-text`} className="text-sm">
                Por favor, especifique:
              </Label>
              <Input
                id={`${question.id}-other-text`}
                value={answer?.additionalText || ""}
                onChange={(e) =>
                  onAnswer({
                    answer: currentAnswer,
                    additionalText: e.target.value,
                  })
                }
                placeholder="Digite aqui..."
                className="w-full"
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  // MULTIPLE_CHOICE
  if (question.type === "multiple_choice") {
    const selectedOptions = (answer?.answer as string[]) || [];

    const toggleOption = (option: string) => {
      const newSelection = selectedOptions.includes(option)
        ? selectedOptions.filter((o) => o !== option)
        : [...selectedOptions, option];

      onAnswer({ answer: newSelection });
    };

    return (
      <div className="question-container bg-background rounded-xl sm:rounded-2xl border border-border p-4 sm:p-6 space-y-4 sm:space-y-6">
        <QuestionHeader
          questionNumber={questionNumber}
          totalQuestions={totalQuestions}
          question={question.question}
        />
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground mb-3">
            Selecione todas as opções que se aplicam
          </p>
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <div
                key={index}
                onClick={() => toggleOption(option)}
                className={cn(
                  "flex items-start space-x-3 p-3 sm:p-4 rounded-lg border-2 transition-all cursor-pointer",
                  selectedOptions.includes(option)
                    ? "border-primary/50 bg-primary/5"
                    : "border-border hover:border-accent hover:bg-muted"
                )}
              >
                <Checkbox
                  checked={selectedOptions.includes(option)}
                  onCheckedChange={() => toggleOption(option)}
                  className="mt-0.5"
                />
                <div className="flex-1 text-foreground leading-relaxed">
                  <span className="font-medium text-muted-foreground text-sm mr-2">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  <span className="text-sm sm:text-base">{option}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // MULTIPLE_CHOICE_WITH_TEXT
  if (question.type === "multiple_choice_with_text") {
    const selectedOptions = (answer?.answer as string[]) || [];
    const hasOther = selectedOptions.some(
      (opt) =>
        opt === "Outro" || opt === "Outros" || opt === "Conte-nos um pouco:"
    );

    const toggleOption = (option: string) => {
      const newSelection = selectedOptions.includes(option)
        ? selectedOptions.filter((o) => o !== option)
        : [...selectedOptions, option];

      onAnswer({
        answer: newSelection,
        additionalText: newSelection.some(
          (opt) =>
            opt === "Outro" || opt === "Outros" || opt === "Conte-nos um pouco:"
        )
          ? answer?.additionalText
          : undefined,
      });
    };

    return (
      <div className="question-container bg-background rounded-xl sm:rounded-2xl border border-border p-4 sm:p-6 space-y-4 sm:space-y-6">
        <QuestionHeader
          questionNumber={questionNumber}
          totalQuestions={totalQuestions}
          question={question.question}
        />
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Selecione todas as opções que se aplicam
          </p>
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <div
                key={index}
                onClick={() => toggleOption(option)}
                className={cn(
                  "flex items-start space-x-3 p-3 sm:p-4 rounded-lg border-2 transition-all cursor-pointer",
                  selectedOptions.includes(option)
                    ? "border-primary/50 bg-primary/5"
                    : "border-border hover:border-accent hover:bg-muted"
                )}
              >
                <Checkbox
                  checked={selectedOptions.includes(option)}
                  onCheckedChange={() => toggleOption(option)}
                  className="mt-0.5"
                />
                <div className="flex-1 text-foreground leading-relaxed">
                  <span className="font-medium text-muted-foreground text-sm mr-2">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  <span className="text-sm sm:text-base">{option}</span>
                </div>
              </div>
            ))}
          </div>

          {hasOther && (
            <div className="mt-4 animate-in slide-in-from-top-2 space-y-2">
              <Label htmlFor={`${question.id}-other-text`} className="text-sm">
                Por favor, especifique "Outro":
              </Label>
              <Input
                id={`${question.id}-other-text`}
                value={answer?.additionalText || ""}
                onChange={(e) =>
                  onAnswer({
                    answer: selectedOptions,
                    additionalText: e.target.value,
                  })
                }
                placeholder="Digite aqui..."
                className="w-full"
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  // CITY_STATE
  if (question.type === "city_state") {
    return (
      <div className="question-container bg-background rounded-xl sm:rounded-2xl border border-border p-4 sm:p-6 space-y-4 sm:space-y-6">
        <QuestionHeader
          questionNumber={questionNumber}
          totalQuestions={totalQuestions}
          question={question.question}
        />
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Estado</Label>
            <Select
              value={answer?.state || ""}
              onValueChange={(value) => {
                setSelectedState(value);
                onAnswer({
                  answer: "",
                  state: value,
                  city: "", // Reset city quando state muda
                });
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione seu estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Estados</SelectLabel>
                  {states.map((estado) => (
                    <SelectItem key={estado.id} value={estado.sigla}>
                      {estado.nome}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Cidade</Label>
            <Select
              value={answer?.city || ""}
              onValueChange={(value) =>
                onAnswer({
                  answer: `${value} - ${answer?.state}`,
                  state: answer?.state,
                  city: value,
                })
              }
              disabled={!selectedState || cities.length === 0}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione sua cidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Cidades</SelectLabel>
                  {cities.map((city) => (
                    <SelectItem key={city.codigo_ibge} value={city.nome}>
                      {city.nome.charAt(0).toUpperCase() +
                        city.nome.slice(1).toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {!selectedState && (
              <p className="text-xs text-muted-foreground">
                Selecione um estado primeiro
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}

// Componente auxiliar para o header
function QuestionHeader({
  questionNumber,
  totalQuestions,
  question,
}: {
  questionNumber: number;
  totalQuestions: number;
  question: string;
}) {
  return (
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
        {question}
      </h2>
    </div>
  );
}
