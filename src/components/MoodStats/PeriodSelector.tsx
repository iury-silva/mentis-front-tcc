import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import type { PeriodType } from "@/types/mood-stats.types";

interface PeriodSelectorProps {
  selectedPeriod: PeriodType;
  onPeriodChange: (period: PeriodType) => void;
  className?: string;
}

export function PeriodSelector({
  selectedPeriod,
  onPeriodChange,
  className = "",
}: PeriodSelectorProps) {
  const periods: { value: PeriodType; label: string }[] = [
    { value: "week", label: "Semana" },
    { value: "month", label: "Mês" },
    { value: "year", label: "Ano" },
  ];

  return (
    <Card className={className}>
      <CardContent>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">
            Comparar com:
          </span>
          <div className="flex gap-2 ml-auto">
            {periods.map((period) => (
              <Button
                key={period.value}
                size="sm"
                variant={
                  selectedPeriod === period.value ? "default" : "outline"
                }
                onClick={() => onPeriodChange(period.value)}
              >
                {period.label}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
