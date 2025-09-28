import React from "react";
import { useQuery } from "@tanstack/react-query";
import { PageCustom } from "@/components/Layout/PageCustom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { StatsCard } from "@/components/Dashboard/StatsCard";
import { DashboardPieChart } from "@/components/Dashboard/DashboardPieChart";
import { DashboardBarChart } from "@/components/Dashboard/DashboardBarChart";
import { DashboardLineChart } from "@/components/Dashboard/DashboardLineChart";
import { TopActiveUsers } from "@/components/Dashboard/TopActiveUsers";
import { dashboardService } from "@/services/dashboard.service";
import {
  Users,
  FileText,
  Layers,
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw,
  BarChart3,
  TrendingUp,
} from "lucide-react";
import { useIsMobile } from "@/hooks/useMobile";

// Skeleton Components
const StatsCardSkeleton = () => (
  <Card className="bg-card/70 backdrop-blur-sm">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-3 w-32" />
        </div>
        <Skeleton className="w-10 h-10 rounded-lg" />
      </div>
    </CardContent>
  </Card>
);

const ChartSkeleton = () => (
  <Card className="bg-card/70 backdrop-blur-sm">
    <CardHeader className="pb-4">
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-4 w-48" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-64 w-full rounded-lg" />
    </CardContent>
  </Card>
);

const BlockPerformanceSkeleton = () => (
  <Card className="bg-card/70 backdrop-blur-sm border-border/50 shadow-xl">
    <CardHeader>
      <div className="flex items-center gap-3">
        <Skeleton className="w-8 h-8 rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-56" />
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <Card key={index} className="bg-card/80 border-border/30">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1 space-y-3 min-w-0">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-6 h-6 rounded" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                  <Skeleton className="h-4 w-48" />
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-24 rounded-full" />
                  </div>
                </div>
                <div className="text-center sm:text-right flex-shrink-0">
                  <Skeleton className="h-8 w-16 mx-auto sm:mx-0 mb-2" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </CardContent>
  </Card>
);

const TopActiveUsersSkeleton = () => (
  <Card className="bg-card/70 backdrop-blur-sm">
    <CardHeader className="pb-4">
      <div className="flex items-center gap-2">
        <Skeleton className="w-5 h-5" />
        <Skeleton className="h-5 w-32" />
      </div>
      <Skeleton className="h-4 w-48" />
    </CardHeader>
    <CardContent className="space-y-4">
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className="flex items-start sm:items-center justify-between p-3 sm:p-4 bg-muted rounded-lg gap-3"
        >
          <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
            <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
            <div className="flex-1 min-w-0 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <Skeleton className="h-6 w-16 rounded-full flex-shrink-0" />
        </div>
      ))}
    </CardContent>
  </Card>
);

const SystemSummarySkeleton = () => (
  <Card className="bg-gradient-to-r from-card/60 to-muted/80 backdrop-blur-sm border-border/50 shadow-xl">
    <CardHeader>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
    </CardHeader>
    <Separator />
    <CardContent className="pt-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, index) => (
          <Card key={index} className="bg-card/50">
            <CardContent className="p-6 text-center">
              <Skeleton className="h-8 w-16 mx-auto mb-2" />
              <Skeleton className="h-4 w-32 mx-auto" />
            </CardContent>
          </Card>
        ))}
      </div>
    </CardContent>
  </Card>
);

const DashboardAdminPage: React.FC = () => {
  const isMobile = useIsMobile();
  const {
    data: dashboardData,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["dashboard"],
    queryFn: dashboardService.getDashboardData,
    refetchInterval: 30000,
    staleTime: 10000,
  });

  if (isLoading) {
    return (
      <PageCustom
        title="Dashboard Administrativo"
        subtitle="Carregando dados..."
        icon={
          <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
        }
        actions={
          <div className="flex items-center gap-3">
            <Skeleton className="hidden sm:flex h-6 w-48 rounded-full" />
            <Skeleton className="h-8 w-20 rounded" />
          </div>
        }
      >
        <div className="space-y-8">
          {/* Stats Overview Skeleton */}
          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <StatsCardSkeleton key={index} />
              ))}
            </div>
          </section>

          {/* Distribution Charts Skeleton */}
          <section>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartSkeleton />
              <ChartSkeleton />
            </div>
          </section>

          {/* Trend Charts Skeleton */}
          <section>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartSkeleton />
              <ChartSkeleton />
            </div>
          </section>

          {/* Block Analysis Skeleton */}
          <section>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartSkeleton />
              <ChartSkeleton />
            </div>
          </section>

          {/* Block Performance Skeleton */}
          <section>
            <BlockPerformanceSkeleton />
          </section>

          {/* Top Active Users Skeleton */}
          <section>
            <TopActiveUsersSkeleton />
          </section>

          {/* Response Evolution Skeleton */}
          <section>
            <ChartSkeleton />
          </section>

          {/* System Summary Skeleton */}
          <section>
            <SystemSummarySkeleton />
          </section>
        </div>
      </PageCustom>
    );
  }

  if (isError || !dashboardData) {
    return (
      <PageCustom
        title="Dashboard Administrativo"
        subtitle="Erro ao carregar dados"
        icon={
          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-red-500" />
          </div>
        }
        actions={
          <Button onClick={() => refetch()} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Tentar novamente
          </Button>
        }
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto">
                  <XCircle className="w-8 h-8 text-red-500" />
                </div>
                <div>
                  <CardTitle className="text-xl mb-2">
                    Dados Indisponíveis
                  </CardTitle>
                  <CardDescription className="mb-4">
                    Não foi possível carregar os dados do dashboard
                    administrativo
                  </CardDescription>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageCustom>
    );
  }

  const { summary, charts, trends } = dashboardData;

  return (
    <PageCustom
      title="Dashboard Admin"
      subtitle={!isMobile ? "Análises e métricas do sistema" : undefined}
      icon={
        <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
          <BarChart3 className="w-5 h-5 text-white" />
        </div>
      }
      badge={
        <Badge
          variant="outline"
          className="hidden sm:flex items-center gap-2 border border-border"
        >
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          Última atualização: {new Date().toLocaleTimeString("pt-BR")}
        </Badge>
      }
      actions={
        <Button
          size="sm"
          variant="ghost"
          onClick={() => refetch()}
          disabled={isFetching}
          className="bg-card/70 backdrop-blur-sm"
        >
          {isFetching ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4 mr-2" />
          )}
          Atualizar
        </Button>
      }
    >
      <div className="space-y-8">
        {/* Stats Overview */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total de Usuários"
              value={dashboardService.formatNumber(summary.totalUsers)}
              description={`${summary.usersAnswered} responderam questionários`}
              icon={Users}
              trend={{
                value: Math.round(trends.weeklyGrowth.userGrowth * 100) / 100,
                isPositive: trends.weeklyGrowth.userGrowth >= 0,
              }}
              className="bg-card/70 backdrop-blur-sm"
            />

            <StatsCard
              title="Questionários"
              value={dashboardService.formatNumber(summary.totalQuestionnaires)}
              description={`${summary.totalBlocks} blocos no total`}
              icon={FileText}
              className="bg-card/70 backdrop-blur-sm"
            />

            <StatsCard
              title="Blocos Ativos"
              value={dashboardService.formatNumber(summary.totalBlocks)}
              description="Blocos de perguntas disponíveis"
              icon={Layers}
              className="bg-card/70 backdrop-blur-sm"
            />

            <StatsCard
              title="Taxa de Participação"
              value={dashboardService.formatPercentage(summary.completionRate)}
              description={`${summary.totalResponses} respostas coletadas`}
              icon={CheckCircle}
              trend={{
                value:
                  Math.round(trends.weeklyGrowth.responseGrowth * 100) / 100,
                isPositive: trends.weeklyGrowth.responseGrowth >= 0,
              }}
              className="bg-card/70 backdrop-blur-sm"
            />
          </div>
        </section>

        {/* Distribution Charts */}
        <section>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DashboardPieChart
              title="Participação dos Usuários"
              data={charts.userDistribution}
              description="Usuários que responderam vs não responderam"
              className="bg-card/70 backdrop-blur-sm"
            />

            <DashboardPieChart
              title="Usuários por Função"
              data={charts.usersByRole}
              description="Distribuição por tipo de usuário"
              className="bg-card/70 backdrop-blur-sm"
            />
          </div>
        </section>

        {/* Trend Charts */}
        <section>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DashboardBarChart
              title="Cadastros por Mês"
              data={charts.registrationsByMonth}
              dataKey="registrations"
              xAxisKey="month"
              description="Novos usuários cadastrados nos últimos 6 meses"
              color="#8884d8"
              className="bg-card/70 backdrop-blur-sm"
            />

            <DashboardLineChart
              title="Atividade Diária"
              data={trends.dailyActivity}
              dataKey="responses"
              xAxisKey="day"
              description="Respostas coletadas nos últimos 7 dias"
              color="#10b981"
              className="bg-card/70 backdrop-blur-sm"
            />
          </div>
        </section>

        {/* Block Analysis */}
        <section>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DashboardBarChart
              title="Respostas por Bloco"
              data={charts.responsesByBlock}
              dataKey="responses"
              xAxisKey="block"
              description="Total de respostas coletadas por bloco"
              color="#f59e0b"
              className="bg-card/70 backdrop-blur-sm"
            />

            <DashboardPieChart
              title="Tipos de Pergunta"
              data={charts.questionTypeDistribution}
              description="Distribuição por tipo de pergunta"
              className="bg-card/70 backdrop-blur-sm"
            />
          </div>
        </section>

        <section>
          <Card className="bg-card/70 backdrop-blur-sm border-border/50 shadow-xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle>Performance dos Blocos</CardTitle>
                  <CardDescription>
                    Taxa de conclusão por bloco de questionário
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {charts.blockCompletionStats.map((block, index) => (
                  <Card
                    key={index}
                    className="bg-card/80 border-border/30 hover:shadow-lg transition-all duration-300"
                  >
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex-1 space-y-3 min-w-0">
                          <div className="flex items-center gap-3">
                            <Badge
                              variant="secondary"
                              className="w-6 h-6 p-0 flex items-center justify-center flex-shrink-0"
                            >
                              {index + 1}
                            </Badge>
                            <CardTitle className="text-sm sm:text-base truncate">
                              {block.blockTitle}
                            </CardTitle>
                          </div>
                          <CardDescription className="truncate">
                            {block.questionnaire}
                          </CardDescription>
                          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                            <Badge variant="outline" className="gap-1 text-xs">
                              <div className="w-2 h-2 bg-blue-400 rounded-full" />
                              <span className="hidden sm:inline">
                                {block.totalQuestions} perguntas
                              </span>
                              <span className="sm:hidden">
                                {block.totalQuestions}p
                              </span>
                            </Badge>
                            <Badge variant="outline" className="gap-1 text-xs">
                              <div className="w-2 h-2 bg-green-400 rounded-full" />
                              <span className="hidden sm:inline">
                                {block.completedUsers} concluído
                              </span>
                              <span className="sm:hidden">
                                {block.completedUsers}c
                              </span>
                            </Badge>
                          </div>
                        </div>
                        <div className="text-center sm:text-right flex-shrink-0">
                          <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                            {dashboardService.formatPercentage(
                              block.completionRate
                            )}
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            taxa de conclusão
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Top Active Users */}
        <section>
          <TopActiveUsers
            users={charts.topActiveUsers}
            className="bg-card/70 backdrop-blur-sm"
          />
        </section>

        {/* Response Evolution */}
        <section>
          <DashboardLineChart
            title="Evolução de Respostas"
            data={charts.responsesByMonth}
            dataKey="responses"
            xAxisKey="month"
            description="Respostas coletadas ao longo dos meses"
            color="#8b5cf6"
            className="bg-card/70 backdrop-blur-sm"
          />
        </section>

        {/* System Summary */}
        <section>
          <Card className="bg-gradient-to-r from-card/60 to-muted/80 backdrop-blur-sm border-border/50 shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Resumo do Sistema</CardTitle>
                  <CardDescription>
                    Métricas consolidadas do sistema
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-card/50">
                  <CardContent className="p-6 text-center">
                    <div className="text-2xl font-bold text-foreground mb-1">
                      {dashboardService.formatNumber(
                        summary.averageResponsesPerUser,
                        1
                      )}
                    </div>
                    <CardDescription>
                      Média de respostas por usuário
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="bg-card/50">
                  <CardContent className="p-6 text-center">
                    <div className="text-2xl font-bold text-foreground mb-1">
                      {dashboardService.formatNumber(
                        trends.weeklyGrowth.currentWeekUsers
                      )}
                    </div>
                    <CardDescription>
                      Usuários ativos esta semana
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="bg-card/50">
                  <CardContent className="p-6 text-center">
                    <div className="text-2xl font-bold text-foreground mb-1">
                      {dashboardService.formatNumber(
                        trends.weeklyGrowth.currentWeekResponses
                      )}
                    </div>
                    <CardDescription>Respostas esta semana</CardDescription>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </PageCustom>
  );
};

export default DashboardAdminPage;
