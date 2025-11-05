import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function CreditsPage() {
  const navigate = useNavigate();

  const logos = [
    {
      src: "/images/AMBITRANS_LOGOFINAL.png",
      alt: "Ambitrans",
    },
    {
      src: "/images/FP_vetor_oficial (1).png",
      alt: "FP",
    },
    {
      src: "/images/fundo_lgbtqia_logo.png",
      alt: "LGBTQIA+",
    },
    {
      src: "/images/Logo - Mestrado_Profissional_em_Psicologia.png",
      alt: "Mestrado em Psicologia",
    },
    {
      src: "/images/Logo - PPGSPI.png",
      alt: "PPGSPI",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50 p-4 sm:p-6 lg:p-8">
      {/* Header com botão voltar */}
      <div className="max-w-4xl mx-auto mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
      </div>

      {/* Título Principal */}
      <div className="max-w-4xl mx-auto mb-12 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
          Créditos
        </h1>
        <p className="text-muted-foreground text-lg">
          Conheça a equipe e as instituições que tornaram possível o Mentis
        </p>
      </div>

      {/* Seção de Apoio */}
      <Card className="max-w-4xl mx-auto mb-8">
        <CardHeader>
          <CardTitle>Apoio</CardTitle>
          <CardDescription>
            Parcerias que viabilizaram o desenvolvimento da plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 items-center justify-items-center">
            {logos.map((logo, index) => (
              <div
                key={index}
                className="flex items-center justify-center h-24 w-full"
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="h-20 object-contain opacity-70 hover:opacity-100 transition-opacity"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Seção da Equipe */}
      <Card className="max-w-4xl mx-auto mb-8">
        <CardHeader>
          <CardTitle>Apresentação da Equipe</CardTitle>
          <CardDescription>
            Profissionais dedicados ao desenvolvimento de pesquisas científicas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p className="text-muted-foreground leading-relaxed mb-6">
              A equipe é multidisciplinar e possui experiência no
              desenvolvimento de pesquisas científicas e tecnológicas, com
              ênfase em aplicações na área da saúde e com o uso de tecnologias
              computacionais e de interação humano-computador, sendo formada
              pela:
            </p>

            <ul className="space-y-3 text-muted-foreground list-none pl-0">
              <li className="leading-relaxed">
                <span className="font-semibold text-foreground">
                  Profa. Dra. Daniela Duarte da Silva Bagatini
                </span>
                <br />
                <span className="text-sm">
                  Departamento de Engenharias, Arquitetura e Computação e
                  Programa de Pós-Graduação em Sistemas e Processos Industriais
                  da UNISC
                </span>
              </li>
              <li className="leading-relaxed">
                <span className="font-semibold text-foreground">
                  Profa. Dra. Rejane Frozza
                </span>
                <br />
                <span className="text-sm">
                  Departamento de Engenharias, Arquitetura e Computação e
                  Programa de Pós-Graduação em Sistemas e Processos Industriais
                  da UNISC
                </span>
              </li>
              <li className="leading-relaxed">
                <span className="font-semibold text-foreground">
                  Profa. Dra. Silvia Virginia Coutinho Areosa
                </span>
                <br />
                <span className="text-sm">
                  Mestrado Profissional em Psicologia da UNISC
                </span>
              </li>
              <li className="leading-relaxed">
                <span className="font-semibold text-foreground">
                  Prof. Dr. Eduardo Steindorf Saraiva
                </span>
                <br />
                <span className="text-sm">
                  Mestrado Profissional em Psicologia da UNISC
                </span>
              </li>
              <li className="leading-relaxed">
                <span className="font-semibold text-foreground">
                  Iury da Silva
                </span>
                <br />
                <span className="text-sm">
                  Acadêmico do Curso de Ciência da Computação da UNISC
                </span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Seção de Desenvolvimento */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Desenvolvimento da Plataforma</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            <span className="font-semibold text-foreground">Iury da Silva</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default CreditsPage;
