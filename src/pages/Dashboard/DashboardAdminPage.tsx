import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../auth/useAuth";
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
// import { Alert, AlertDescription } from "@/components/ui/alert";
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
  // AlertCircle,
} from "lucide-react";

const DashboardAdminPage: React.FC = () => {
  const { user } = useAuth();

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-red-400 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <Loader2 className="w-8 h-8 animate-spin text-white" />
              </div>
              <div>
                <CardTitle className="text-xl mb-2">
                  Carregando Dashboard
                </CardTitle>
                <CardDescription>Coletando dados do sistema...</CardDescription>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError || !dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto">
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
              <div>
                <CardTitle className="text-xl mb-2">Erro ao Carregar</CardTitle>
                <CardDescription className="mb-4">
                  Não foi possível carregar os dados do dashboard
                </CardDescription>
                <Button onClick={() => refetch()} variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Tentar novamente
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { summary, charts, trends } = dashboardData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/60 backdrop-blur-sm border-b border-white/20 sticky top-0 z-10 mt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-red-400 rounded-xl flex items-center justify-center shadow-lg">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">
                  Dashboard Admin
                </h1>
                <p className="text-sm text-slate-600">
                  Análises e métricas do sistema
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge
                variant="subtle"
                className="hidden sm:flex items-center gap-2"
              >
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Última atualização: {new Date().toLocaleTimeString("pt-BR")}
              </Badge>
              <Button
                size="sm"
                variant="outline"
                onClick={() => refetch()}
                disabled={isFetching}
                className="bg-white/70 backdrop-blur-sm"
              >
                {isFetching ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                Atualizar
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                className="bg-white/70 backdrop-blur-sm"
              />

              <StatsCard
                title="Questionários"
                value={dashboardService.formatNumber(
                  summary.totalQuestionnaires
                )}
                description={`${summary.totalBlocks} blocos no total`}
                icon={FileText}
                className="bg-white/70 backdrop-blur-sm"
              />

              <StatsCard
                title="Blocos Ativos"
                value={dashboardService.formatNumber(summary.totalBlocks)}
                description="Blocos de perguntas disponíveis"
                icon={Layers}
                className="bg-white/70 backdrop-blur-sm"
              />

              <StatsCard
                title="Taxa de Participação"
                value={dashboardService.formatPercentage(
                  summary.completionRate
                )}
                description={`${summary.totalResponses} respostas coletadas`}
                icon={CheckCircle}
                trend={{
                  value:
                    Math.round(trends.weeklyGrowth.responseGrowth * 100) / 100,
                  isPositive: trends.weeklyGrowth.responseGrowth >= 0,
                }}
                className="bg-white/70 backdrop-blur-sm"
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
                className="bg-white/70 backdrop-blur-sm"
              />

              <DashboardPieChart
                title="Usuários por Função"
                data={charts.usersByRole}
                description="Distribuição por tipo de usuário"
                className="bg-white/70 backdrop-blur-sm"
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
                className="bg-white/70 backdrop-blur-sm"
              />

              <DashboardLineChart
                title="Atividade Diária"
                data={trends.dailyActivity}
                dataKey="responses"
                xAxisKey="day"
                description="Respostas coletadas nos últimos 7 dias"
                color="#10b981"
                className="bg-white/70 backdrop-blur-sm"
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
                className="bg-white/70 backdrop-blur-sm"
              />

              <DashboardPieChart
                title="Tipos de Pergunta"
                data={charts.questionTypeDistribution}
                description="Distribuição por tipo de pergunta"
                className="bg-white/70 backdrop-blur-sm"
              />
            </div>
          </section>

          {/* Block Performance */}
          <section>
            <Card className="bg-white/70 backdrop-blur-sm border-white/20 shadow-xl">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-white" />
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
                      className="bg-white/80 border-white/30 hover:shadow-lg transition-all duration-300"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-3">
                              <Badge
                                variant="secondary"
                                className="w-6 h-6 p-0 flex items-center justify-center"
                              >
                                {index + 1}
                              </Badge>
                              <CardTitle className="text-base">
                                {block.blockTitle}
                              </CardTitle>
                            </div>
                            <CardDescription>
                              {block.questionnaire}
                            </CardDescription>
                            <div className="flex items-center gap-6">
                              <Badge variant="outline" className="gap-1">
                                <div className="w-2 h-2 bg-blue-400 rounded-full" />
                                {block.totalQuestions} perguntas
                              </Badge>
                              <Badge variant="outline" className="gap-1">
                                <div className="w-2 h-2 bg-green-400 rounded-full" />
                                {block.completedUsers} concluído
                              </Badge>
                              <Badge variant="outline" className="gap-1">
                                <div className="w-2 h-2 bg-amber-400 rounded-full" />
                                {block.partialResponses} parcial
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
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
              className="bg-white/70 backdrop-blur-sm"
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
              className="bg-white/70 backdrop-blur-sm"
            />
          </section>

          {/* System Summary */}
          <section>
            <Card className="bg-gradient-to-r from-white/60 to-blue-50/80 backdrop-blur-sm border-white/20 shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Resumo do Sistema</CardTitle>
                    <CardDescription>
                      Métricas consolidadas do sistema
                    </CardDescription>
                  </div>
                  <Badge variant="outline">Admin: {user?.email}</Badge>
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="bg-white/50">
                    <CardContent className="p-6 text-center">
                      <div className="text-2xl font-bold text-slate-900 mb-1">
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

                  <Card className="bg-white/50">
                    <CardContent className="p-6 text-center">
                      <div className="text-2xl font-bold text-slate-900 mb-1">
                        {dashboardService.formatNumber(
                          trends.weeklyGrowth.currentWeekUsers
                        )}
                      </div>
                      <CardDescription>
                        Usuários ativos esta semana
                      </CardDescription>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/50">
                    <CardContent className="p-6 text-center">
                      <div className="text-2xl font-bold text-slate-900 mb-1">
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
      </main>
    </div>
  );
};

export default DashboardAdminPage;
