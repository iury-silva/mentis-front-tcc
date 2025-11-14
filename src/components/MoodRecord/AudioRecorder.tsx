import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Mic,
  Trash2,
  Pause,
  Play,
  Square,
  Send,
  Clock,
  Loader2,
} from "lucide-react";
import type { AnalyzeMoodVoiceResponse } from "@/types/mood-record.types";
import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { useMutation } from "@tanstack/react-query";
import { moodRecordService } from "@/services/mood-record.service";
import toast from "react-hot-toast";

interface AudioRecorderProps {
  onSuccess?: (data: AnalyzeMoodVoiceResponse) => void;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({ onSuccess }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [time, setTime] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Atualiza cronômetro de 1 em 1 segundo
  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => {
        setTime((t) => {
          if (t + 1 >= 60) {
            stopRecording();
            return 60;
          }
          return t + 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording, isPaused]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream; // Armazena stream para desativar depois

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);

        // Desativa microfone após parar gravação
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setIsPaused(false);
      setTime(0);
    } catch (error) {
      console.error("Erro ao acessar o microfone:", error);
      toast.error("Erro ao acessar o microfone");
    }
  };

  const pauseRecording = () => {
    if (!mediaRecorderRef.current) return;
    mediaRecorderRef.current.pause();
    setIsPaused(true);
  };

  const resumeRecording = () => {
    if (!mediaRecorderRef.current) return;
    mediaRecorderRef.current.resume();
    setIsPaused(false);
  };

  const stopRecording = () => {
    if (!mediaRecorderRef.current) return;
    mediaRecorderRef.current.stop();
    setIsRecording(false);
    setIsPaused(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const deleteRecording = () => {
    setAudioURL(null);
    setTime(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const progressPercentage = (time / 60) * 100;

  const mutation = useMutation({
    mutationFn: async (audioFile: File) => {
      return moodRecordService.analyzeVoice(audioFile);
    },
    onSuccess: (data) => {
      if (data.message) {
        toast.error(data.message);
        return;
      }
      toast.success("Áudio analisado com sucesso!");
      // Limpa o áudio após sucesso
      setAudioURL(null);
      setTime(0);
      // Chama o callback onSuccess com os dados da análise
      onSuccess?.(data);
    },
    onError: (error: unknown) => {
      const err = error as { message?: string };
      toast.error(err.message || "Erro ao enviar gravação");
    },
  });

  const sendRecording = () => {
    if (!audioURL) return;
    fetch(audioURL)
      .then((res) => res.blob())
      .then((blob) => {
        // Converte Blob para File
        const file = new File([blob], "audio-recording.webm", {
          type: "audio/webm",
        });
        mutation.mutate(file);
      });
  };

  return (
    <div className="mx-auto space-y-6">
      {/* Card principal com design minimalista */}
      <Card className="overflow-hidden">
        {/* Header com status */}
        <div className="border-b bg-muted/30 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Mic className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">Gravador de Voz</h3>
                <p className="text-xs text-muted-foreground">
                  Limite máximo: 60 segundos
                </p>
              </div>
            </div>

            {/* Status badge */}
            {isRecording && (
              <Badge
                variant={isPaused ? "secondary" : "destructive"}
                className="gap-1.5"
              >
                <motion.span
                  animate={
                    isPaused ? {} : { scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }
                  }
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-2 h-2 rounded-full bg-current"
                />
                {isPaused ? "Pausado" : "Gravando"}
              </Badge>
            )}
          </div>
        </div>
        {/* Conteúdo principal */}
        <div className="p-6 space-y-6">
          {/* Timer e Progresso (quando gravando ou com áudio) */}
          {(isRecording || audioURL) && (
            <div className="space-y-4">
              {/* Timer */}
              <div className="flex items-center justify-center gap-3 py-4">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <span className="text-5xl font-bold tabular-nums">
                  {formatTime(time)}
                </span>
                <span className="text-muted-foreground text-sm self-end pb-2">
                  / 01:00
                </span>
              </div>

              {/* Barra de progresso minimalista */}
              <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          )}

          {/* Estado: Inicial */}
          {!isRecording && !audioURL && (
            <div className="space-y-4 py-8">
              <div className="text-center space-y-2 mb-6">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center mb-4">
                  <Mic className="w-8 h-8 text-purple-600" />
                </div>
                <h4 className="font-medium">Pronto para gravar</h4>
                <p className="text-sm text-muted-foreground">
                  Clique no botão abaixo para iniciar
                </p>
              </div>

              <Button
                size="lg"
                onClick={startRecording}
                className="w-full h-14 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Mic className="w-5 h-5 mr-2" />
                Iniciar Gravação
              </Button>
            </div>
          )}

          {/* Estado: Gravando */}
          {isRecording && (
            <div className="grid grid-cols-2 gap-3">
              <Button
                size="lg"
                variant="outline"
                onClick={isPaused ? resumeRecording : pauseRecording}
                className="h-12"
              >
                {isPaused ? (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Retomar
                  </>
                ) : (
                  <>
                    <Pause className="w-5 h-5 mr-2" />
                    Pausar
                  </>
                )}
              </Button>

              <Button
                size="lg"
                variant="destructive"
                onClick={stopRecording}
                className="h-12"
              >
                <Square className="w-5 h-5 mr-2" />
                Finalizar
              </Button>
            </div>
          )}

          {/* Estado: Áudio gravado */}
          {audioURL && !isRecording && (
            <div className="space-y-4">
              {/* Player */}
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Play className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium text-sm">Sua gravação</span>
                </div>
                <audio controls src={audioURL} className="w-full" />
              </div>

              {/* Botões de ação */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  size="lg"
                  variant="outline"
                  onClick={deleteRecording}
                  className="h-12"
                >
                  <Trash2 className="w-5 h-5 mr-2" />
                  Descartar
                </Button>

                <Button
                  size="lg"
                  className="h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  onClick={sendRecording}
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Analisando...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Enviar
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
