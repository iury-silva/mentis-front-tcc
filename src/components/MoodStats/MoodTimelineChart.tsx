import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { moodStatsService } from "@/services/mood-stats.service";
import type { MoodRecordByRange } from "@/types/mood-stats.types";

interface MoodTimelineChartProps {
  records: MoodRecordByRange[];
  title?: string;
  description?: string;
  selectedMetrics?: string[];
  className?: string;
}

export function MoodTimelineChart({
  records,
  title = "Evolução Temporal",
  description = "Acompanhe suas métricas ao longo do tempo",
  selectedMetrics = ["score_mood", "score_anxiety", "score_energy"],
  className = "",
}: MoodTimelineChartProps) {
  // Transforma os dados para o formato do gráfico
  const chartData = records.map((record) => {
    const date = new Date(record.date);
    return {
      date: date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
      }),
      fullDate: date.toLocaleDateString("pt-BR"),
      score_mood: record.score_mood,
      score_anxiety: record.score_anxiety,
      score_energy: record.score_energy,
      score_sleep: record.score_sleep,
      score_stress: record.score_stress,
    };
  });

  const metrics = [
    {
      key: "score_mood",
      name: "Humor",
      color: "#8b5cf6",
    },
    {
      key: "score_anxiety",
      name: "Ansiedade",
      color: "#f59e0b",
    },
    {
      key: "score_energy",
      name: "Energia",
      color: "#10b981",
    },
    {
      key: "score_sleep",
      name: "Sono",
      color: "#3b82f6",
    },
    {
      key: "score_stress",
      name: "Estresse",
      color: "#ef4444",
    },
  ];

  const filteredMetrics = metrics.filter((m) =>
    selectedMetrics.includes(m.key)
  );

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
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#64748b" />
              <YAxis domain={[0, 5]} tick={{ fontSize: 12 }} stroke="#64748b" />
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
                labelFormatter={(label) => `Data: ${label}`}
              />
              <Legend />
              {filteredMetrics.map((metric) => (
                <Line
                  key={metric.key}
                  type="monotone"
                  dataKey={metric.key}
                  name={metric.name}
                  stroke={metric.color}
                  strokeWidth={2}
                  dot={{ fill: metric.color, r: 3 }}
                  activeDot={{ r: 5 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
