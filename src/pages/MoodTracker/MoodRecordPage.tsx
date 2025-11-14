import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, MessageSquare, Mic } from "lucide-react";
import { Card } from "@/components/ui/card";
import { motion } from "motion/react";
import { MoodSliders } from "@/components/MoodRecord/MoodSliders";
import { AudioRecorder } from "@/components/MoodRecord/AudioRecorder";
import type {
  AnalyzeMoodVoiceResponse,
  AnalyzeMoodTextResponse,
} from "@/types/mood-record.types";

type MoodRecordMode = "text" | "voice";

interface MoodRecordPageProps {
  onSuccess?: () => void;
}

const MoodRecordPage: React.FC<MoodRecordPageProps> = ({ onSuccess }) => {
  const [mode, setMode] = useState<MoodRecordMode | null>(null);

  const handleSuccess = (
    data: AnalyzeMoodVoiceResponse | AnalyzeMoodTextResponse
  ) => {
    console.log("Análise recebida:", data);
    // Reseta o modo
    setMode(null);
    // Chama callback para mudar de aba
    onSuccess?.();
  };

  return (
    <div className="space-y-6">
      {/* Alerta informativo */}
      <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800 dark:text-blue-200">
          <strong>Registre seu humor hoje!</strong> Escolha entre registro
          manual com sliders e emojis ou gravação de voz (até 1 minuto).
        </AlertDescription>
      </Alert>

      {/* Seletor de Modo */}
      {!mode && (
        <div className="grid gap-4 md:grid-cols-2">
          {/* Card - Registro Manual */}
          <motion.div
            whileHover="hover"
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Card
              className="p-8 cursor-pointer border-2 hover:border-primary transition-colors"
              onClick={() => setMode("text")}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <motion.div
                  className="w-12 h-12 bg-blue-100 dark:bg-blue-950 rounded-lg flex items-center justify-center"
                  initial={false}
                  variants={{
                    hover: {
                      rotate: [0, -10, 0, -10, 0],
                      transition: { duration: 0.6 },
                    },
                  }}
                >
                  <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </motion.div>
                <div>
                  <h3 className="font-semibold mb-1">Registro Manual</h3>
                  <p className="text-sm text-muted-foreground">
                    Sliders e emojis
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Card - Gravação de Voz */}
          <motion.div
            whileHover="hover"
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Card
              className="p-8 cursor-pointer border-2 hover:border-primary transition-colors"
              onClick={() => setMode("voice")}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <motion.div
                  className="w-12 h-12 bg-purple-100 dark:bg-purple-950 rounded-lg flex items-center justify-center"
                  initial={false}
                  variants={{
                    hover: {
                      rotate: [0, -10, 0, -10, 0],
                      transition: { duration: 0.6 },
                    },
                  }}
                >
                  <Mic className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </motion.div>
                <div>
                  <h3 className="font-semibold mb-1">Gravação de Voz</h3>
                  <p className="text-sm text-muted-foreground">
                    Áudio até 1 minuto
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      )}

      {/* Modo Texto/Sliders */}
      {mode === "text" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Registro Manual</h3>
            <Button variant="ghost" size="sm" onClick={() => setMode(null)}>
              Voltar
            </Button>
          </div>

          <MoodSliders onSuccess={handleSuccess} />
        </div>
      )}

      {/* Modo Voz */}
      {mode === "voice" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Gravação de Voz</h3>
            <Button variant="ghost" size="sm" onClick={() => setMode(null)}>
              Voltar
            </Button>
          </div>

          <AudioRecorder onSuccess={handleSuccess} />
        </div>
      )}
    </div>
  );
};

export default MoodRecordPage;
