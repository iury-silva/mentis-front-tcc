import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Loader2, Smile, AlertTriangle, Zap, Moon, Heart } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { moodRecordService } from "@/services/mood-record.service";
import toast from "react-hot-toast";
import type {
  MoodScores,
  AnalyzeMoodTextResponse,
} from "@/types/mood-record.types";

interface MoodSlidersProps {
  onSuccess?: (data: AnalyzeMoodTextResponse) => void;
}

const emojis = {
  1: "😢",
  2: "😟",
  3: "😐",
  4: "🙂",
  5: "😊",
};

export const MoodSliders: React.FC<MoodSlidersProps> = ({ onSuccess }) => {
  const [scores, setScores] = useState<MoodScores>({
    score_mood: 3,
    score_anxiety: 3,
    score_energy: 3,
    score_sleep: 3,
    score_stress: 3,
  });
  const [notes, setNotes] = useState("");

  const mutation = useMutation({
    mutationFn: moodRecordService.analyzeText,
    onSuccess: (data) => {
      if (data.message) {
        toast.error(data.message);
        return;
      }
      toast.success("Registro salvo com sucesso!");
      onSuccess?.(data);
    },
    onError: (error: unknown) => {
      const err = error as { message?: string };
      toast.error(err.message || "Erro ao salvar registro");
    },
  });

  const handleSubmit = () => {
    if (notes.trim().length === 0) {
      toast.error("Por favor, adicione suas observações");
      return;
    }

    mutation.mutate({
      ...scores,
      notes: notes.trim(),
    });
  };

  const sliders = [
    {
      key: "score_mood" as keyof MoodScores,
      label: "Humor",
      icon: Smile,
      color: "text-blue-600",
      description: "Como você está se sentindo?",
    },
    {
      key: "score_anxiety" as keyof MoodScores,
      label: "Ansiedade",
      icon: AlertTriangle,
      color: "text-yellow-600",
      description: "Nível de ansiedade",
    },
    {
      key: "score_energy" as keyof MoodScores,
      label: "Energia",
      icon: Zap,
      color: "text-green-600",
      description: "Quanta energia você tem?",
    },
    {
      key: "score_sleep" as keyof MoodScores,
      label: "Sono",
      icon: Moon,
      color: "text-purple-600",
      description: "Qualidade do sono",
    },
    {
      key: "score_stress" as keyof MoodScores,
      label: "Estresse",
      icon: Heart,
      color: "text-red-600",
      description: "Nível de estresse",
    },
  ];

  return (
    <div className="space-y-6">
      {sliders.map(({ key, label, icon: Icon, color, description }) => (
        <Card key={key} className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon className={`w-5 h-5 ${color}`} />
                <Label className="font-semibold">{label}</Label>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">
                  {emojis[scores[key] as 1 | 2 | 3 | 4 | 5]}
                </span>
                <span className="text-sm font-medium">{scores[key]}/5</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">{description}</p>
            <Slider
              value={[scores[key]]}
              onValueChange={(value) =>
                setScores((prev) => ({ ...prev, [key]: value[0] }))
              }
              min={1}
              max={5}
              step={1}
              className="cursor-pointer"
            />
          </div>
        </Card>
      ))}

      {/* Notas obrigatórias */}
      <Card className="p-4">
        <div className="space-y-2">
          <Label htmlFor="notes">
            Notas <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="notes"
            placeholder="Adicione observações sobre seu dia..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength={500}
            className="resize-none"
            rows={4}
            required
          />
          <p className="text-xs text-muted-foreground text-right">
            {notes.length}/500
          </p>
        </div>
      </Card>

      {/* Botão Submit */}
      <Button
        size="lg"
        onClick={handleSubmit}
        disabled={mutation.isPending || notes.trim().length === 0}
        className="w-full"
      >
        {mutation.isPending ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Analisando...
          </>
        ) : (
          "Salvar Registro"
        )}
      </Button>
    </div>
  );
};
