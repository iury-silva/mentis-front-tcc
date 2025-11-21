import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { PageCustom } from "@/components/Layout/PageCustom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  TrendingUp,
  Calendar as CalendarIcon,
  FileText,
  Download,
} from "lucide-react";
import { useIsMobile } from "@/hooks/useMobile";
import { moodStatsService } from "@/services/mood-stats.service";
import {
  MoodStatsCards,
  MoodAveragesRadarChart,
  PeriodComparisonChart,
  PeriodSelector,
  MoodTimelineChart,
  MoodHeatmap,
} from "@/components/MoodStats";
import type { PeriodType } from "@/types/mood-stats.types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

const MoodStatsPage: React.FC = () => {
  const isMobile = useIsMobile();
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>("week");
  const [activeTab, setActiveTab] = useState<
    "overview" | "comparison" | "timeline"
  >("overview");

  // Query para estatísticas gerais
  const {
    data: statsData,
    isLoading: isLoadingStats,
    error: statsError,
  } = useQuery({
    queryKey: ["mood-stats"],
    queryFn: () => moodStatsService.getStatsOverview(),
  });

  // Query para comparação de períodos
  const { data: comparisonData, isLoading: isLoadingComparison } = useQuery({
    queryKey: ["mood-comparison", selectedPeriod],
    queryFn: () => moodStatsService.comparePeriods(selectedPeriod),
  });

  // Query para timeline (últimos 30 dias)
  const { data: timelineData, isLoading: isLoadingTimeline } = useQuery({
    queryKey: ["mood-timeline"],
    queryFn: () => {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);

      return moodStatsService.getByDateRange({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });
    },
  });

  // Mutation para gerar PDF
  const generatePdfMutation = useMutation({
    mutationFn: () => moodStatsService.generatePdfReport(),
    onSuccess: () => {
      toast.success("📄 Relatório PDF baixado com sucesso!", {
        duration: 4000,
        icon: "✅",
      });
    },
    onError: (error) => {
      console.error("Erro ao gerar PDF:", error);
      toast.error("❌ Erro ao gerar relatório. Tente novamente.", {
        duration: 4000,
      });
    },
  });

  // Loading state
  if (isLoadingStats) {
    return (
      <PageCustom
        title="Estatísticas"
        subtitle={!isMobile ? "Carregando suas estatísticas..." : undefined}
        icon={
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <BarChart3 className="w-5 h-5 text-primary-foreground" />
          </div>
        }
      >
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </PageCustom>
    );
  }

  // Error state
  if (statsError) {
    return (
      <PageCustom
        title="Estatísticas"
        subtitle={!isMobile ? "Erro ao carregar estatísticas" : undefined}
        icon={
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <BarChart3 className="w-5 h-5 text-primary-foreground" />
          </div>
        }
      >
        <Alert variant="destructive">
          <AlertDescription>
            Erro ao carregar estatísticas. Tente novamente mais tarde.
          </AlertDescription>
        </Alert>
      </PageCustom>
    );
  }

  return (
    <PageCustom
      title="Estatísticas de Humor"
      subtitle={!isMobile ? "Análise detalhada do seu bem-estar" : undefined}
      icon={
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
          <BarChart3 className="w-5 h-5 text-primary-foreground" />
        </div>
      }
      actions={
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            <TrendingUp className="w-3 h-3 mr-1" />
            {statsData?.totalRecords || 0} registros
          </Badge>
          <Button
            size={isMobile ? "sm" : "default"}
            variant="outline"
            onClick={() => generatePdfMutation.mutate()}
            disabled={generatePdfMutation.isPending || !statsData?.totalRecords}
            className="gap-2"
          >
            {generatePdfMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {!isMobile && "Gerando..."}
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                {!isMobile && "Gerar Relatório PDF"}
              </>
            )}
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Cards de Estatísticas */}
        {statsData && <MoodStatsCards stats={statsData} />}

        {/* Card de Ação - Gerar Relatório */}
        {statsData && statsData.totalRecords > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    Baixe seu Relatório Completo
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Gere um PDF com análise detalhada dos últimos 30 dias,
                    incluindo insights da IA, tendências e estatísticas
                    completas.
                  </p>
                </div>
              </div>
              <Button
                size="lg"
                onClick={() => generatePdfMutation.mutate()}
                disabled={generatePdfMutation.isPending}
                className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex-shrink-0"
              >
                {generatePdfMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Gerando PDF...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Gerar Relatório
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Tabs de Visualizações */}
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as typeof activeTab)}
          className="w-full"
        >
          <div className="pb-6 -mx-6 px-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview" className="gap-2">
                <BarChart3 className="w-4 h-4" />
                {!isMobile && "Visão Geral"}
              </TabsTrigger>
              <TabsTrigger value="comparison" className="gap-2">
                <TrendingUp className="w-4 h-4" />
                {!isMobile && "Comparação"}
              </TabsTrigger>
              <TabsTrigger value="timeline" className="gap-2">
                <CalendarIcon className="w-4 h-4" />
                {!isMobile && "Linha do Tempo"}
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab: Visão Geral */}
          <TabsContent value="overview" className="mt-0">
            {statsData?.averages ? (
              <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
                <MoodAveragesRadarChart averages={statsData.averages} />
              </div>
            ) : (
              <Alert>
                <AlertDescription>
                  Nenhum dado disponível ainda. Comece a registrar seu humor
                  para ver as estatísticas!
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          {/* Tab: Comparação */}
          <TabsContent value="comparison" className="mt-0 space-y-6">
            <PeriodSelector
              selectedPeriod={selectedPeriod}
              onPeriodChange={setSelectedPeriod}
            />

            {isLoadingComparison ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : comparisonData ? (
              <PeriodComparisonChart comparison={comparisonData} />
            ) : (
              <Alert>
                <AlertDescription>
                  Dados insuficientes para comparação de períodos.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          {/* Tab: Linha do Tempo */}
          <TabsContent value="timeline" className="mt-0">
            {isLoadingTimeline ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : timelineData && timelineData.length > 0 ? (
              <div className="space-y-6">
                {/* Heatmap */}
                <MoodHeatmap
                  records={timelineData}
                  title="Mapa de Calor - Humor"
                  description="Padrões de humor por dia da semana"
                  metric="score_mood"
                />

                {/* Gráficos de linha */}
                <MoodTimelineChart
                  records={timelineData}
                  title="Últimos 30 Dias - Todas as Métricas"
                  selectedMetrics={[
                    "score_mood",
                    "score_anxiety",
                    "score_energy",
                    "score_sleep",
                    "score_stress",
                  ]}
                />
                <MoodTimelineChart
                  records={timelineData}
                  title="Últimos 30 Dias - Humor e Energia"
                  description="Foco em bem-estar geral"
                  selectedMetrics={["score_mood", "score_energy"]}
                />
              </div>
            ) : (
              <Alert>
                <AlertDescription>
                  Nenhum registro encontrado nos últimos 30 dias.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PageCustom>
  );
};

export default MoodStatsPage;
