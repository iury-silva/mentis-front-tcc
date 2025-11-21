import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { moodStatsService } from "@/services/mood-stats.service";
import type { PeriodComparison } from "@/types/mood-stats.types";

interface PeriodComparisonChartProps {
  comparison: PeriodComparison;
  title?: string;
  className?: string;
}

export function PeriodComparisonChart({
  comparison,
  title = "Comparação de Períodos",
  className = "",
}: PeriodComparisonChartProps) {
  const { current, previous } = comparison;

  // Transforma os dados para o formato do gráfico
  const chartData = [
    {
      metric: "Humor",
      atual: current.averages?.mood || 0,
      anterior: previous.averages?.mood || 0,
    },
    {
      metric: "Ansiedade",
      atual: current.averages?.anxiety || 0,
      anterior: previous.averages?.anxiety || 0,
    },
    {
      metric: "Energia",
      atual: current.averages?.energy || 0,
      anterior: previous.averages?.energy || 0,
    },
    {
      metric: "Sono",
      atual: current.averages?.sleep || 0,
      anterior: previous.averages?.sleep || 0,
    },
    {
      metric: "Estresse",
      atual: current.averages?.stress || 0,
      anterior: previous.averages?.stress || 0,
    },
  ];

  // Calcula a mudança geral (média de todas as métricas)
  const calculateOverallChange = () => {
    if (!current.averages || !previous.averages) return 0;

    const currentAvg =
      (current.averages.mood +
        current.averages.anxiety +
        current.averages.energy +
        current.averages.sleep +
        current.averages.stress) /
      5;

    const previousAvg =
      (previous.averages.mood +
        previous.averages.anxiety +
        previous.averages.energy +
        previous.averages.sleep +
        previous.averages.stress) /
      5;

    return moodStatsService.calculatePercentageChange(currentAvg, previousAvg);
  };

  const overallChange = calculateOverallChange();

  const getTrendIcon = () => {
    if (overallChange > 0) return <TrendingUp className="w-4 h-4" />;
    if (overallChange < 0) return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const getTrendColor = () => {
    if (overallChange > 0) return "bg-green-100 text-green-700";
    if (overallChange < 0) return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <Card
      className={`hover:shadow-lg transition-all duration-300 ${className}`}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">
              {title}
            </CardTitle>
            <div className="flex flex-col gap-1 mt-2">
              <p className="text-xs text-muted-foreground">
                Atual: {current.period} ({current.recordCount} registros)
              </p>
              <p className="text-xs text-muted-foreground">
                Anterior: {previous.period} ({previous.recordCount} registros)
              </p>
            </div>
          </div>
          <Badge variant="secondary" className={getTrendColor()}>
            {getTrendIcon()}
            <span className="ml-1">
              {moodStatsService.formatNumber(Math.abs(overallChange), 1)}%
            </span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="metric"
                tick={{ fontSize: 12 }}
                stroke="#64748b"
              />
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
              />
              <Legend />
              <Bar
                dataKey="anterior"
                fill="#94a3b8"
                name="Período Anterior"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="atual"
                fill="#8b5cf6"
                name="Período Atual"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
