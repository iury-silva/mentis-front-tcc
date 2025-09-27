import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Heart, Wrench, Clock, Calendar, BarChart3, Users } from "lucide-react";
import { useIsMobile } from "@/hooks/useMobile";

const MoodTracker: React.FC = () => {
  const isMobile = useIsMobile();
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-300/50 to-white">
      {/* Header */}
      <header className="border-b border-white/20 pt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">
                  Registro de Humor
                </h1>
                {!isMobile && (
                  <p className="text-sm text-slate-600">
                    Monitore seu bem-estar emocional
                  </p>
                )}
              </div>
            </div>
            <Badge
              variant="secondary"
              className="bg-orange-100 text-orange-700"
            >
              <Wrench className="w-3 h-3 mr-1" />
              Em desenvolvimento
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Status Card */}
          <Card className="bg-gradient-to-r from-white/80 to-blue-50/60 backdrop-blur-sm shadow-xl border-blue-200">
            <CardHeader className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wrench className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl text-slate-800">
                Funcionalidade em Desenvolvimento
              </CardTitle>
              <CardDescription className="text-base">
                Estamos trabalhando para trazer uma experiência completa de
                registro e acompanhamento de humor
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Features Preview */}
          <Card className="bg-white/70 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                Em breve você poderá:
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-r from-pink-50 to-purple-50">
                  <Heart className="w-6 h-6 text-pink-600 mt-1" />
                  <div>
                    <h4 className="font-medium text-slate-900">
                      Registrar Humor Diário
                    </h4>
                    <p className="text-sm text-slate-600">
                      Acompanhe como você se sente todos os dias
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
                  <BarChart3 className="w-6 h-6 text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-medium text-slate-900">
                      Gráficos e Estatísticas
                    </h4>
                    <p className="text-sm text-slate-600">
                      Visualize tendências e padrões do seu humor
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-r from-emerald-50 to-teal-50">
                  <Calendar className="w-6 h-6 text-emerald-600 mt-1" />
                  <div>
                    <h4 className="font-medium text-slate-900">
                      Histórico Completo
                    </h4>
                    <p className="text-sm text-slate-600">
                      Acesse todos os seus registros anteriores
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-r from-orange-50 to-yellow-50">
                  <Users className="w-6 h-6 text-orange-600 mt-1" />
                  <div>
                    <h4 className="font-medium text-slate-900">
                      Insights Personalizados
                    </h4>
                    <p className="text-sm text-slate-600">
                      Receba dicas baseadas nos seus registros
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Info */}
          <Alert className="bg-amber-50 border-amber-200">
            <Clock className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <strong>Status:</strong> Esta funcionalidade está sendo
              desenvolvida pela nossa equipe. Em breve você terá acesso completo
              ao sistema de registro de humor com gráficos, estatísticas e
              insights personalizados.
            </AlertDescription>
          </Alert>
        </div>
      </main>
    </div>
  );
};

export default MoodTracker;
