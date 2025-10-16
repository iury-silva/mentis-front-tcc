import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  TrendingUp,
} from "lucide-react";
import type { OnboardingStep } from "./OnboardingModal";
import { Card, CardContent } from "@/components/ui/card";

export const adminOnboardingSteps: OnboardingStep[] = [
  {
    title: "Bem-vindo ao Painel Admin! 👨‍💼",
    description:
      "Vamos te mostrar como gerenciar a plataforma Mentis e acompanhar os usuários.",
    icon: <LayoutDashboard className="w-8 h-8 text-primary" />,
    content: (
      <div className="space-y-4">
        <Card className="border-2 border-primary/20">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">
              Como administrador, você tem acesso a ferramentas poderosas para
              gerenciar questionários, visualizar estatísticas e apoiar os
              usuários.
            </p>
          </CardContent>
        </Card>
      </div>
    ),
  },
  {
    title: "Dashboard de Estatísticas",
    description:
      "Acompanhe métricas importantes sobre o uso da plataforma e bem-estar dos usuários.",
    icon: <TrendingUp className="w-8 h-8 text-blue-500" />,
    content: (
      <div className="space-y-4">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-lg bg-blue-500/10 text-center">
                <div className="text-2xl font-bold text-blue-500 mb-1">245</div>
                <div className="text-xs text-muted-foreground">
                  Usuários Ativos
                </div>
              </div>
              <div className="p-4 rounded-lg bg-green-500/10 text-center">
                <div className="text-2xl font-bold text-green-500 mb-1">
                  1.2k
                </div>
                <div className="text-xs text-muted-foreground">
                  Questionários
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Visualize dados em tempo real e gere relatórios
            </p>
          </CardContent>
        </Card>
      </div>
    ),
  },
  {
    title: "Gerenciamento de Questionários",
    description:
      "Crie, edite e gerencie questionários para os usuários da plataforma.",
    icon: <FileText className="w-8 h-8 text-purple-500" />,
    content: (
      <div className="space-y-4">
        <Card>
          <CardContent className="pt-6">
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Criar novos questionários e blocos</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Editar questionários existentes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Visualizar respostas dos usuários</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>Gerenciar bonificações</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    ),
  },
  {
    title: "Gestão de Usuários",
    description: "Visualize e gerencie os usuários da plataforma.",
    icon: <Users className="w-8 h-8 text-orange-500" />,
    content: (
      <div className="space-y-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Acesse informações dos usuários, monitore atividades e ofereça
              suporte quando necessário.
            </p>
            <div className="flex items-center justify-center gap-2">
              <Users className="w-4 h-4 text-orange-500" />
              <span className="text-sm">
                Gerenciamento completo de usuários
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    ),
  },
  {
    title: "Pronto para Administrar! 🚀",
    description: "Você está pronto para começar. Vamos ao dashboard!",
    icon: <Settings className="w-8 h-8 text-green-500" />,
    content: (
      <div className="space-y-4">
        <Card className="border-2 border-primary/20">
          <CardContent className="pt-6">
            <p className="text-center font-semibold mb-4">
              Recursos disponíveis:
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="p-3 rounded-lg bg-muted text-center">
                📊 Dashboard
              </div>
              <div className="p-3 rounded-lg bg-muted text-center">
                📝 Questionários
              </div>
              <div className="p-3 rounded-lg bg-muted text-center">
                👥 Usuários
              </div>
              <div className="p-3 rounded-lg bg-muted text-center">
                ⚙️ Configurações
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    ),
  },
];
