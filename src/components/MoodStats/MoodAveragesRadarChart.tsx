import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { moodStatsService } from "@/services/mood-stats.service";
import type { MoodAverages } from "@/types/mood-stats.types";

interface MoodAveragesRadarChartProps {
  averages: MoodAverages;
  title?: string;
  description?: string;
  className?: string;
}

export function MoodAveragesRadarChart({
  averages,
  title = "Visão Geral das Métricas",
  description = "Média dos seus registros de humor",
  className = "",
}: MoodAveragesRadarChartProps) {
  // Transforma os dados em formato adequado para o radar chart
  const chartData = [
    {
      metric: "Humor",
      value: averages.score_mood,
      fullMark: 5,
    },
    {
      metric: "Ansiedade",
      value: averages.score_anxiety,
      fullMark: 5,
    },
    {
      metric: "Energia",
      value: averages.score_energy,
      fullMark: 5,
    },
    {
      metric: "Sono",
      value: averages.score_sleep,
      fullMark: 5,
    },
    {
      metric: "Estresse",
      value: averages.score_stress,
      fullMark: 5,
    },
  ];

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
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={chartData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis
                dataKey="metric"
                tick={{ fontSize: 12, fill: "#64748b" }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 5]}
                tick={{ fontSize: 10, fill: "#64748b" }}
              />
              <Radar
                name="Score"
                dataKey="value"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.6}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
                formatter={(value: number) =>
                  moodStatsService.formatNumber(value)
                }
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
