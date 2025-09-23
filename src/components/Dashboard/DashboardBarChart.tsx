import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type {
  RegistrationsByMonth,
  ResponsesByBlock,
  ResponsesByMonth,
  DailyActivity,
} from "@/types/dashboard.types";

type BarChartData =
  | RegistrationsByMonth
  | ResponsesByBlock
  | ResponsesByMonth
  | DailyActivity
  | { [key: string]: string | number };

interface DashboardBarChartProps {
  title: string;
  data: BarChartData[];
  dataKey: string;
  xAxisKey: string;
  description?: string;
  color?: string;
  className?: string;
}

export function DashboardBarChart({
  title,
  data,
  dataKey,
  xAxisKey,
  description,
  color = "#8884d8",
  className = "",
}: DashboardBarChartProps) {
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{ value: number; name: string }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-slate-600">
            {payload[0].name}: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card
      className={`hover:shadow-lg transition-all duration-300 ${className}`}
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
            <BarChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey={xAxisKey}
                tick={{ fontSize: 12 }}
                stroke="#64748b"
              />
              <YAxis tick={{ fontSize: 12 }} stroke="#64748b" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
