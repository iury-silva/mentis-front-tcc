import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { moodStatsService } from "@/services/mood-stats.service";
import type { MoodRecordByRange } from "@/types/mood-stats.types";

interface MoodHeatmapProps {
  records: MoodRecordByRange[];
  title?: string;
  description?: string;
  metric?:
    | "score_mood"
    | "score_anxiety"
    | "score_energy"
    | "score_sleep"
    | "score_stress";
  className?: string;
}

export function MoodHeatmap({
  records,
  title = "Mapa de Calor",
  description = "Visualize padrões de humor ao longo do tempo",
  metric = "score_mood",
  className = "",
}: MoodHeatmapProps) {
  // Agrupa registros por dia da semana e semana do mês
  const groupedData = records.reduce((acc, record) => {
    const date = new Date(record.date);
    const weekday = date.getDay(); // 0-6 (domingo-sábado)
    const weekNumber = Math.floor(date.getDate() / 7);

    const key = `${weekNumber}-${weekday}`;
    if (!acc[key]) {
      acc[key] = {
        weekNumber,
        weekday,
        count: 0,
        totalScore: 0,
        date: date.toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "short",
        }),
      };
    }

    acc[key].count++;
    acc[key].totalScore += record[metric];

    return acc;
  }, {} as Record<string, { weekNumber: number; weekday: number; count: number; totalScore: number; date: string }>);

  // Calcula médias
  const heatmapData = Object.values(groupedData).map((item) => ({
    ...item,
    average: item.totalScore / item.count,
  }));

  // Nomes dos dias
  const weekdays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  // Função para obter cor baseada no score
  const getHeatColor = (score: number | undefined) => {
    if (!score) return "bg-gray-100";
    if (score >= 4.5) return "bg-green-600";
    if (score >= 3.5) return "bg-green-400";
    if (score >= 2.5) return "bg-yellow-400";
    if (score >= 1.5) return "bg-orange-400";
    return "bg-red-400";
  };

  // Encontra o número máximo de semanas
  const maxWeek = Math.max(...heatmapData.map((d) => d.weekNumber), 0);

  return (
    <Card
      className={`hover:shadow-lg transition-all duration-300 ${className}`}
    >
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-foreground">
          {title}
        </CardTitle>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {/* Header com dias da semana */}
          <div className="grid grid-cols-8 gap-2 text-xs text-muted-foreground font-medium">
            <div></div>
            {weekdays.map((day) => (
              <div key={day} className="text-center">
                {day}
              </div>
            ))}
          </div>

          {/* Grid de semanas */}
          {[...Array(maxWeek + 1)].map((_, weekNum) => (
            <div key={weekNum} className="grid grid-cols-8 gap-2">
              <div className="text-xs text-muted-foreground font-medium flex items-center">
                Sem {weekNum + 1}
              </div>
              {[...Array(7)].map((_, dayNum) => {
                const data = heatmapData.find(
                  (d) => d.weekNumber === weekNum && d.weekday === dayNum
                );
                return (
                  <div
                    key={dayNum}
                    className={`aspect-square rounded-md ${getHeatColor(
                      data?.average
                    )} 
                      hover:scale-110 transition-all duration-200 cursor-pointer
                      flex items-center justify-center group relative`}
                    title={
                      data
                        ? `${data.date}: ${moodStatsService.formatNumber(
                            data.average
                          )}/5 (${data.count} registro${
                            data.count > 1 ? "s" : ""
                          })`
                        : "Sem registro"
                    }
                  >
                    {data && (
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/70 rounded-md flex flex-col items-center justify-center text-white text-xs p-1">
                        <div className="font-bold">
                          {moodStatsService.formatNumber(data.average)}
                        </div>
                        <div className="text-[10px]">{data.date}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}

          {/* Legenda */}
          <div className="flex items-center justify-center gap-2 pt-4 text-xs">
            <span className="text-muted-foreground">Baixo</span>
            <div className="flex gap-1">
              <div className="w-4 h-4 rounded bg-red-400"></div>
              <div className="w-4 h-4 rounded bg-orange-400"></div>
              <div className="w-4 h-4 rounded bg-yellow-400"></div>
              <div className="w-4 h-4 rounded bg-green-400"></div>
              <div className="w-4 h-4 rounded bg-green-600"></div>
            </div>
            <span className="text-muted-foreground">Alto</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
