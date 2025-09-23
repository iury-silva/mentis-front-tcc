import React from "react";
import { useAuth } from "../../auth/useAuth";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  User,
  FileText,
  Clock,
  CheckCircle,
  TrendingUp,
  BookOpen,
  BarChart3,
  Heart,
  Sparkles,
  Target,
  AlertCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";

interface UserDashboardData {
  totalQuestions: number;
  answeredQuestions: number;
  completionRate: number;
  completedQuestionnaires: number;
  totalQuestionnaires: number;
  notAnsweredQuestionnaires: number;
}

// Skeleton Components
const UserStatsCardSkeleton = () => (
  <Card className="bg-white/70 backdrop-blur-sm shadow-xl">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-12" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
        <div className="space-y-2">
          <Skeleton className="w-12 h-12 rounded-full" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const QuickActionsSkeleton = () => (
  <Card className="bg-white/70 backdrop-blur-sm shadow-xl">
    <CardHeader>
      <div className="flex items-center gap-2">
        <Skeleton className="w-5 h-5" />
        <Skeleton className="h-5 w-24" />
      </div>
      <Skeleton className="h-4 w-48" />
    </CardHeader>
    <CardContent className="space-y-3">
      {[...Array(3)].map((_, index) => (
        <Card key={index} className="bg-slate-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
              <Skeleton className="h-6 w-8 rounded-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </CardContent>
  </Card>
);

const RecentActivitiesSkeleton = () => (
  <Card className="bg-white/70 backdrop-blur-sm shadow-xl">
    <CardHeader>
      <div className="flex items-center gap-2">
        <Skeleton className="w-5 h-5" />
        <Skeleton className="h-5 w-28" />
      </div>
      <Skeleton className="h-4 w-40" />
    </CardHeader>
    <CardContent className="space-y-4">
      {[...Array(2)].map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-3 p-3 rounded-lg bg-slate-50"
        >
          <Skeleton className="w-8 h-8 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      ))}
    </CardContent>
  </Card>
);

const ProgressSkeleton = () => (
  <Card className="bg-white/70 backdrop-blur-sm shadow-xl">
    <CardHeader>
      <div className="flex items-center gap-2">
        <Skeleton className="w-5 h-5" />
        <Skeleton className="h-5 w-24" />
      </div>
      <Skeleton className="h-4 w-52" />
    </CardHeader>
    <CardContent>
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-3 w-full rounded-full" />
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-3 w-full rounded-full" />
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="space-y-2">
            <Skeleton className="h-8 w-8 mx-auto" />
            <Skeleton className="h-3 w-20 mx-auto" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-8 w-8 mx-auto" />
            <Skeleton className="h-3 w-20 mx-auto" />
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const WeeklySummarySkeleton = () => (
  <Card className="bg-gradient-to-r from-white/60 to-purple-50/80 backdrop-blur-sm border-white/20 shadow-xl">
    <CardHeader>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-40" />
        </div>
      </div>
    </CardHeader>
    <Separator />
    <CardContent className="pt-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, index) => (
          <Card key={index} className="bg-white/50">
            <CardContent className="p-6 text-center">
              <Skeleton className="h-8 w-8 mx-auto mb-2" />
              <Skeleton className="h-4 w-24 mx-auto" />
            </CardContent>
          </Card>
        ))}
      </div>
    </CardContent>
  </Card>
);

const DashboardUserPage: React.FC = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const {
    data: dashboardData,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery<UserDashboardData>({
    queryKey: ["user-dashboard", user?.id],
    queryFn: () => api.get("/dashboard/user"),
    enabled: !!user?.id,
  });

  // Stats baseadas nos dados da API
  const stats = [
    {
      title: "Perguntas Respondidas",
      value: dashboardData?.answeredQuestions?.toString() || "0",
      description: `de ${dashboardData?.totalQuestions || 0} perguntas`,
      icon: CheckCircle,
      trend: `${dashboardData?.completionRate || 0}% concluído`,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
    {
      title: "Questionários Pendentes",
      value: dashboardData?.notAnsweredQuestionnaires?.toString() || "0",
      description: "Aguardando resposta",
      icon: Clock,
      trend: "Continue respondendo",
      color: "text-amber-600",
      bgColor: "bg-amber-100",
    },
    {
      title: "Taxa de Participação",
      value: `${dashboardData?.completionRate || 0}%`,
      description: "Progresso atual",
      icon: TrendingUp,
      trend: "Continue assim!",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
  ];

  const recentActivities = [
    {
      title: "Questionário de Bem-estar",
      description: "Última resposta registrada",
      status: "completed",
      date: new Date().toLocaleDateString("pt-BR"),
    },
    {
      title: "Registro de Humor",
      description: "Registre como você está se sentindo hoje",
      status: "pending",
      date: "Hoje",
    },
  ];

  const quickActions = [
    {
      title: "Responder Questionários",
      description: "Continue seu progresso nos questionários",
      icon: FileText,
      action: () => navigate("/questionnaire"),
      count: dashboardData?.notAnsweredQuestionnaires || 0,
      color: "from-blue-500 to-indigo-600",
    },
    {
      title: "Registro de Humor",
      description: "Como você está se sentindo hoje?",
      icon: Heart,
      action: () => navigate("/mood-tracker"),
      highlight: true,
      color: "from-pink-500 to-purple-600",
    },
    {
      title: "Ver Histórico",
      description: "Minhas respostas e progresso",
      icon: BarChart3,
      action: () => navigate("/questionnaire"),
      color: "from-emerald-500 to-teal-600",
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Header Skeleton */}
        <header className="bg-white/60 backdrop-blur-sm border-b border-white/20 sticky top-0 z-10 mt-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <Skeleton className="w-10 h-10 rounded-xl" />
                <div className="space-y-1">
                  <Skeleton className="h-5 w-40" />
                  {!isMobile && <Skeleton className="h-4 w-60" />}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="hidden sm:flex h-6 w-48 rounded-full" />
                <Skeleton className="h-8 w-20 rounded" />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Skeleton */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            {/* Stats Grid Skeleton */}
            <section>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, index) => (
                  <UserStatsCardSkeleton key={index} />
                ))}
              </div>
            </section>

            {/* Actions and Activities Skeleton */}
            <section>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <QuickActionsSkeleton />
                <RecentActivitiesSkeleton />
              </div>
            </section>

            {/* Progress Skeleton */}
            <section>
              <ProgressSkeleton />
            </section>

            {/* Weekly Summary Skeleton */}
            <section>
              <WeeklySummarySkeleton />
            </section>
          </div>
        </main>
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
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <div>
                <CardTitle className="text-xl mb-2">Erro ao Carregar</CardTitle>
                <CardDescription className="mb-4">
                  Não foi possível carregar seus dados
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/60 backdrop-blur-sm border-b border-white/20 sticky top-0 z-10 mt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-red-400 rounded-xl flex items-center justify-center shadow-lg">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">
                  Olá, {user?.name || "Usuário"}! 👋
                </h1>
                {!isMobile && (
                  <p className="text-sm text-slate-600">
                    Acompanhe seu progresso e cuide do seu bem-estar
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
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
          {/* Stats Grid */}
          <section>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <Card
                  key={index}
                  className="bg-white/70 backdrop-blur-sm hover:shadow-lg transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          {stat.title}
                        </p>
                        <p className="text-3xl font-bold">{stat.value}</p>
                        <p className="text-xs text-muted-foreground">
                          {stat.description}
                        </p>
                      </div>
                      <div
                        className={`p-3 rounded-full ${stat.bgColor} ${stat.color}`}
                      >
                        <stat.icon className="w-6 h-6" />
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-xs text-muted-foreground">
                        {stat.trend}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Quick Actions & Recent Activity */}
          <section>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Quick Actions */}
              <Card className="bg-white/70 backdrop-blur-sm shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Ações Rápidas
                  </CardTitle>
                  <CardDescription>
                    Acesso direto às principais funcionalidades
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {quickActions.map((action, index) => (
                    <Card
                      key={index}
                      className={`transition-all cursor-pointer hover:shadow-lg ${
                        action.highlight
                          ? "bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200"
                          : "bg-slate-50 hover:bg-slate-100"
                      }`}
                      onClick={action.action}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-lg bg-gradient-to-r ${action.color} text-white`}
                          >
                            <action.icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-sm">
                                {action.title}
                              </h4>
                              {action.count && action.count > 0 && (
                                <Badge
                                  variant="destructive"
                                  className="text-xs h-5"
                                >
                                  {action.count}
                                </Badge>
                              )}
                              {action.highlight && (
                                <Badge className="bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs h-5">
                                  Novo!
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {action.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="bg-white/70 backdrop-blur-sm shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Atividade Recente
                  </CardTitle>
                  <CardDescription>
                    Suas últimas interações no sistema
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg bg-slate-50"
                    >
                      <div className="flex-shrink-0">
                        {activity.status === "completed" ? (
                          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-emerald-600" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                            <Clock className="w-4 h-4 text-amber-600" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{activity.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.description}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {activity.date}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Progress Section */}
          <section>
            <Card className="bg-white/70 backdrop-blur-sm shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Seu Progresso
                </CardTitle>
                <CardDescription>
                  Acompanhe sua participação nos questionários
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        Perguntas Respondidas
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {dashboardData?.answeredQuestions || 0} de{" "}
                        {dashboardData?.totalQuestions || 0}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-green-500 h-3 rounded-full transition-all duration-500"
                        style={{
                          width: `${dashboardData?.completionRate || 0}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        Questionários Concluídos
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {dashboardData?.completedQuestionnaires || 0} de{" "}
                        {dashboardData?.totalQuestionnaires || 0}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-500"
                        style={{
                          width: `${
                            dashboardData?.totalQuestionnaires
                              ? (dashboardData.completedQuestionnaires /
                                  dashboardData.totalQuestionnaires) *
                                100
                              : 0
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-emerald-600">
                        {dashboardData?.answeredQuestions || 0}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Respostas Enviadas
                      </p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-blue-600">
                        {dashboardData?.completionRate || 0}%
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Taxa de Conclusão
                      </p>
                    </div>
                  </div>

                  {/* Motivational Message */}
                  {(dashboardData?.completionRate || 0) < 50 && (
                    <Alert>
                      <Sparkles className="h-4 w-4" />
                      <AlertDescription>
                        Continue respondendo os questionários para desbloquear
                        insights sobre seu bem-estar!
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Weekly Summary */}
          <section>
            <Card className="bg-gradient-to-r from-white/60 to-purple-50/80 backdrop-blur-sm border-white/20 shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Resumo da Semana</CardTitle>
                    <CardDescription>
                      Suas conquistas e progresso
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="bg-white/50">
                    <CardContent className="p-6 text-center">
                      <div className="text-2xl font-bold text-slate-900 mb-1">
                        {Math.round(
                          (dashboardData?.answeredQuestions || 0) / 7
                        )}
                      </div>
                      <CardDescription>
                        Média diária de respostas
                      </CardDescription>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/50">
                    <CardContent className="p-6 text-center">
                      <div className="text-2xl font-bold text-slate-900 mb-1">
                        {dashboardData?.totalQuestionnaires || 0}
                      </div>
                      <CardDescription>
                        Questionários disponíveis
                      </CardDescription>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/50">
                    <CardContent className="p-6 text-center">
                      <div className="text-2xl font-bold text-slate-900 mb-1">
                        {dashboardData?.completedQuestionnaires || 0}
                      </div>
                      <CardDescription>
                        Questionários finalizados
                      </CardDescription>
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

export default DashboardUserPage;
