import { useParams } from "react-router-dom";
import { api } from "@/api";
import { useQuery } from "@tanstack/react-query";
import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

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
}: {
  question: Question;
  answer?: string;
  onAnswer: (value: string) => void;
}) {
  // Estado local para input de texto para evitar lag
  const [localValue, setLocalValue] = useState(answer || "");

  // Sincroniza localValue com answer se mudar externamente
  useEffect(() => {
    setLocalValue(answer || "");
  }, [answer]);

  const handleBlur = () => {
    onAnswer(localValue); // atualiza estado global somente ao sair do input
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">{question.question}</h2>

      {question.type === "text" ? (
        <Input
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onBlur={handleBlur}
        />
      ) : (
        <RadioGroup
          value={answer || ""}
          onValueChange={onAnswer}
          className="flex flex-col space-y-2"
        >
          {question.options?.map((opt) => (
            <div key={opt} className="flex items-center space-x-2">
              <RadioGroupItem value={opt} id={`${question.id}-${opt}`} />
              <Label htmlFor={`${question.id}-${opt}`} className="text-gray-700">
                {opt}
              </Label>
            </div>
          ))}
        </RadioGroup>
      )}
    </div>
  );
}

export default function BlockDetailPage() {
  const { blockId } = useParams<{ blockId: string }>();
  const [answers, setAnswers] = useState<Record<string, { answer: string }>>({});

  const query = useQuery<QuestionsResponse>({
    queryKey: ["block", blockId],
    queryFn: async () => {
      const res = await api.get(`/questionnaire/blocks/${blockId}`);
      return res ?? [];
    },
    enabled: !!blockId,
  });

  const { data: questions = [], isLoading, isError } = query;

  const handleAnswer = useCallback((questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { answer: value },
    }));
  }, []);

  if (isLoading) return <div className="p-4">Carregando...</div>;
  if (isError) return <div className="p-4 text-red-500">Erro ao carregar o bloco.</div>;
  if (!questions.length) return <div className="p-4">Nenhuma pergunta encontrada.</div>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-2xl">
      {questions.map((q) => (
        <QuestionItem
          key={q.id}
          question={q}
          answer={answers[q.id]?.answer}
          onAnswer={(value) => handleAnswer(q.id, value)}
        />
      ))}

      <div className="mt-4">
        <Button
          onClick={() => console.log("Respostas enviadas:", answers)}
        >
          Enviar
        </Button>
      </div>

      {/* Apenas para debug */}
      <pre className="mt-4 text-sm">{JSON.stringify(answers, null, 2)}</pre>
    </div>
  );
}
