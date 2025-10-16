import {
  FileText,
  Heart,
  TrendingUp,
  Award,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { OnboardingStep } from "./OnboardingModal";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const userOnboardingSteps: OnboardingStep[] = [
  {
    title: "Bem-vindo ao Mentis!",
    description:
      "Estamos felizes em ter você aqui. Vamos fazer um tour rápido pela plataforma para você aproveitar ao máximo.",
    icon: <Sparkles className="w-8 h-8 text-primary" />,
    image: "/images/discord-embed.png",
    content: (
      <div className="space-y-4">
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-purple-500/5">
          <CardContent>
            <p className="text-center text-muted-foreground">
              O Mentis é sua plataforma de apoio ao bem-estar mental,
              desenvolvida especialmente para você.
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-lg bg-muted/50 text-center">
            <div className="text-2xl font-bold text-primary mb-1">100%</div>
            <div className="text-xs text-muted-foreground">Confidencial</div>
          </div>
          <div className="p-4 rounded-lg bg-muted/50 text-center">
            <div className="text-2xl font-bold text-primary mb-1">24/7</div>
            <div className="text-xs text-muted-foreground">Disponível</div>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Questionários de Bem-Estar",
    description:
      "Responda questionários validados cientificamente para avaliar seu estado emocional e receber insights personalizados.",
    icon: <FileText className="w-8 h-8 text-blue-500" />,
    content: (
      <div className="space-y-4">
        <div className="grid gap-3">
          <Card>
            <CardContent className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">
                  Avaliações Personalizadas
                </h4>
                <p className="text-sm text-muted-foreground">
                  Questionários adaptados às suas necessidades e momento atual
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                <Award className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <h4 className="font-semibold mb-1">Ganhe Bonificações</h4>
                <p className="text-sm text-muted-foreground">
                  Receba materiais exclusivos ao completar questionários
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    ),
  },
  {
    title: "Registro de Humor",
    description:
      "Acompanhe suas emoções diariamente e identifique padrões que podem estar afetando seu bem-estar.",
    icon: <Heart className="w-8 h-8 text-pink-500" />,
    content: (
      <div className="space-y-4">
        <Card className="border-2 border-pink-500/20">
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 justify-center">
              <Badge variant="outline" className="text-xs">
                😊 Feliz
              </Badge>
              <Badge variant="outline" className="text-xs">
                😌 Calmo
              </Badge>
              <Badge variant="outline" className="text-xs">
                😔 Triste
              </Badge>
              <Badge variant="outline" className="text-xs">
                😰 Ansioso
              </Badge>
            </div>

            <p className="text-sm text-center text-muted-foreground">
              Registre como você está se sentindo e acompanhe a evolução do seu
              humor ao longo do tempo
            </p>
          </CardContent>
        </Card>

        <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center">
          <Heart className="w-4 h-4 text-pink-500" />
          <span>Leva menos de 1 minuto por dia</span>
        </div>
      </div>
    ),
  },
  {
    title: "Análises e Insights",
    description:
      "Receba relatórios personalizados sobre seu bem-estar e sugestões de ações para melhorar sua saúde mental.",
    icon: <TrendingUp className="w-8 h-8 text-green-500" />,
    content: (
      <div className="space-y-4">
        <Card className="border-2 border-green-500/20">
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Bem-estar geral</span>
                <Badge className="bg-green-500">Bom</Badge>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full w-3/4"></div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <span className="text-sm font-medium">Ansiedade</span>
                <Badge variant="outline">Moderada</Badge>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full w-1/2"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-sm text-center text-muted-foreground">
          Visualize seus progressos e identifique áreas que precisam de atenção
        </p>
      </div>
    ),
  },
  {
    title: "Pronto para Começar!",
    description:
      "Você está pronto para começar sua jornada de autocuidado. Vamos ao seu primeiro questionário!",
    icon: <Award className="w-8 h-8 text-yellow-500" />,
    content: (
      <div className="space-y-4">
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-purple-500/5">
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <p className="font-semibold">Lembre-se:</p>
              <ul className="text-sm text-muted-foreground space-y-2 text-left max-w-md mx-auto">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                  <span>Suas respostas são confidenciais</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                  <span>Não há respostas certas ou erradas</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                  <span>Seja honesto(a) consigo mesmo(a)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                  <span>O Mentis não substitui atendimento profissional</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Clique em "Começar" para ir ao seu primeiro questionário
          </p>
        </div>
      </div>
    ),
  },
];
