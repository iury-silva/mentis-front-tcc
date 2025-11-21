import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus, Activity, Flame } from "lucide-react";
import { moodStatsService } from "@/services/mood-stats.service";
import type { MoodStatsOverview } from "@/types/mood-stats.types";

interface MoodStatsCardsProps {
  stats: MoodStatsOverview;
  className?: string;
}

export function MoodStatsCards({ stats, className = "" }: MoodStatsCardsProps) {
  const { totalRecords, averages, trends, streaks } = stats;

  // Função para renderizar ícone de tendência
  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (trend < 0) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-600" />;
  };

  // Função para obter cor da tendência
  const getTrendColor = (trend: number) => {
    if (trend > 0) return "text-green-600";
    if (trend < 0) return "text-red-600";
    return "text-gray-600";
  };

  const metrics = averages
    ? [
        {
          key: "score_mood",
          label: "Humor Médio",
          value: averages.score_mood,
          trend: trends?.score_mood || 0,
          emoji: moodStatsService.getEmojiByScore(averages.score_mood),
        },
        {
          key: "score_anxiety",
          label: "Ansiedade Média",
          value: averages.score_anxiety,
          trend: trends?.score_anxiety || 0,
          emoji: "😰",
        },
        {
          key: "score_energy",
          label: "Energia Média",
          value: averages.score_energy,
          trend: trends?.score_energy || 0,
          emoji: "⚡",
        },
        {
          key: "score_sleep",
          label: "Sono Médio",
          value: averages.score_sleep,
          trend: trends?.score_sleep || 0,
          emoji: "😴",
        },
        {
          key: "score_stress",
          label: "Estresse Médio",
          value: averages.score_stress,
          trend: trends?.score_stress || 0,
          emoji: "😤",
        },
      ]
    : [];

  return (
    <div
      className={`grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 ${className}`}
    >
      {/* Card: Total de Registros */}
      <Card className="hover:shadow-lg transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total de Registros
          </CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalRecords}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {totalRecords === 1 ? "registro salvo" : "registros salvos"}
          </p>
        </CardContent>
      </Card>

      {/* Card: Streak */}
      <Card className="hover:shadow-lg transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Sequência</CardTitle>
          <Flame className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {streaks}
            <span className="text-lg ml-1">🔥</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {streaks === 1 ? "dia consecutivo" : "dias consecutivos"}
          </p>
        </CardContent>
      </Card>

      {/* Cards de Métricas */}
      {metrics.map((metric) => (
        <Card
          key={metric.key}
          className="hover:shadow-lg transition-all duration-300"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {metric.label}
            </CardTitle>
            <span className="text-2xl">{metric.emoji}</span>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-bold">
                {moodStatsService.formatNumber(metric.value)}
              </div>
              <span className="text-sm text-muted-foreground">/5</span>
            </div>
            <div className="flex items-center gap-1 mt-1">
              {getTrendIcon(metric.trend)}
              <span
                className={`text-xs font-medium ${getTrendColor(metric.trend)}`}
              >
                {moodStatsService.formatTrend(metric.trend)}
              </span>
              <span className="text-xs text-muted-foreground">vs início</span>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Mensagem quando não há dados */}
      {!averages && (
        <Card className="col-span-full">
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              <p className="text-lg mb-2">📊</p>
              <p>Nenhum registro encontrado ainda.</p>
              <p className="text-sm mt-1">
                Comece a registrar seu humor para ver as estatísticas!
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
