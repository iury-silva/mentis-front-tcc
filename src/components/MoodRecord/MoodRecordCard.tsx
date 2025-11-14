import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DatetimeFormater } from "@/lib/formaters/dataFormater";
import {
  Smile,
  Heart,
  Zap,
  Moon,
  AlertTriangle,
  Brain,
  MessageSquare,
  Mic,
  Calendar,
} from "lucide-react";

import type { MoodRecordItem } from "@/types/mood-record.types";
import { moodEmojis } from "./mood-emojis";
import { moodRecordService } from "@/services/mood-record.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { useState } from "react";

function MoodRecordCard({ record }: { record: MoodRecordItem }) {
  const queryClient = useQueryClient();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const emojiData =
    moodEmojis[record.average_mood_score as 1 | 2 | 3 | 4 | 5] || moodEmojis[3];

  const scores = [
    {
      label: "Humor",
      value: record.score_mood,
      icon: Smile,
      color: "bg-blue-500",
    },
    {
      label: "Ansiedade",
      value: record.score_anxiety,
      icon: AlertTriangle,
      color: "bg-yellow-500",
    },
    {
      label: "Energia",
      value: record.score_energy,
      icon: Zap,
      color: "bg-green-500",
    },
    {
      label: "Sono",
      value: record.score_sleep,
      icon: Moon,
      color: "bg-purple-500",
    },
    {
      label: "Estresse",
      value: record.score_stress,
      icon: Heart,
      color: "bg-red-500",
    },
  ];

  const isVoiceRecord = !!record.transcripted_audio;

  const deleteMutation = useMutation({
    mutationFn: () => moodRecordService.deleteMoodRecord(record.id),
    onSuccess: () => {
      toast.success("Registro deletado com sucesso!");
      queryClient.invalidateQueries({
        queryKey: ["moodRecords"],
      });
    },
    onError: (error: unknown) => {
      const err = error as { message?: string };
      toast.error(err.message || "Erro ao deletar registro");
    },
  });

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow py-0">
      {/* Header com gradiente */}
      <CardHeader className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-900/20 dark:to-pink-900/20 py-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <div className="text-3xl">{emojiData.emoji}</div>
            <div>
              <div className="text-base">{emojiData.description}</div>
              <div className="text-xs font-normal text-muted-foreground flex items-center gap-1 mt-1">
                <Calendar className="w-3 h-3" />
                {DatetimeFormater(record.createdAt)}
              </div>
            </div>
          </CardTitle>
          <div>
            <Badge
              variant={isVoiceRecord ? "default" : "secondary"}
              className="gap-1"
            >
              {isVoiceRecord ? (
                <>
                  <Mic className="w-3 h-3" />
                  Voz
                </>
              ) : (
                <>
                  <MessageSquare className="w-3 h-3" />
                  Manual
                </>
              )}
            </Badge>
            <motion.div
              className="inline-block ml-4"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                variant="destructive"
                size="icon"
                className=""
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-4 pb-4">
        {/* Scores Grid */}
        <div className="grid grid-cols-5 gap-2">
          {scores.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="text-center">
              <div
                className={`${color} w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-1`}
              >
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-xs font-medium">{value}/5</div>
              <div className="text-xs text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>

        {/* Transcrição de áudio (se existir) */}
        {record.transcripted_audio && (
          <div className="bg-muted/50 rounded-lg p-3 border">
            <div className="flex items-center gap-2 mb-2">
              <Mic className="w-4 h-4 text-purple-600" />
              <h4 className="font-medium text-sm">Transcrição</h4>
            </div>
            <p className="text-sm text-muted-foreground italic">
              "{record.transcripted_audio}"
            </p>
          </div>
        )}

        {/* Notas (se existir) */}
        {record.notes && (
          <div className="bg-muted/50 rounded-lg p-3 border">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              <h4 className="font-medium text-sm">Notas</h4>
            </div>
            <p className="text-sm text-muted-foreground">{record.notes}</p>
          </div>
        )}

        {/* AI Insight */}
        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-4 h-4 text-purple-600" />
            <h4 className="font-medium text-sm">Análise da IA</h4>
          </div>
          <p className="text-sm text-muted-foreground">{record.ai_insight}</p>
        </div>
      </CardContent>

      <ConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={() => deleteMutation.mutate()}
        title="Deletar registro?"
        description="Tem certeza que deseja deletar este registro de humor? Esta ação não pode ser desfeita."
        confirmText="Deletar"
        cancelText="Cancelar"
        variant="destructive"
        isLoading={deleteMutation.isPending}
      />
    </Card>
  );
}

export { MoodRecordCard };
