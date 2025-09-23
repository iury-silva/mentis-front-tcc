import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type {
  ChartDataItem,
  UsersByRole,
  QuestionTypeDistribution,
} from "@/types/dashboard.types";

type ChartData =
  | ChartDataItem
  | UsersByRole
  | QuestionTypeDistribution
  | { name: string; value: number; fill: string };

interface DashboardPieChartProps {
  title: string;
  data: ChartData[];
  description?: string;
  className?: string;
}

export function DashboardPieChart({
  title,
  data,
  description,
  className = "",
}: DashboardPieChartProps) {
  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: Array<{
      name: string;
      value: number;
      payload: { total: number };
    }>;
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-slate-600">
            {data.value} (
            {((data.value / data.payload.total) * 100 || 0).toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  // Função auxiliar para obter o valor correto independente do tipo
  const getValue = (item: ChartData): number => {
    if ("value" in item) return item.value;
    if ("count" in item) return item.count;
    return 0;
  };

  const dataWithTotal = data.map((item) => ({
    ...item,
    name:
      "name" in item
        ? item.name
        : "role" in item
        ? item.role
        : "type" in item
        ? item.type
        : "",
    value: getValue(item),
    fill: item.fill,
    total: data.reduce((acc, curr) => acc + getValue(curr), 0),
  }));

  return (
    <Card
      className={`hover:shadow-xl transition-all duration-500 hover:scale-[1.01] border-white/20 ${className}`}
    >
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-slate-800">
          {title}
        </CardTitle>
        {description && <p className="text-sm text-slate-600">{description}</p>}
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dataWithTotal}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {dataWithTotal.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: "20px", fontSize: "12px" }}
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
