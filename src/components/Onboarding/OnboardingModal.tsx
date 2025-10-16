import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, ChevronLeft, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface OnboardingStep {
  title: string;
  description: string;
  image?: string;
  icon?: React.ReactNode;
  content?: React.ReactNode;
}

interface OnboardingScreenProps {
  steps: OnboardingStep[];
  onComplete: () => Promise<void>;
  redirectTo?: string;
  completingText?: string;
}

export function OnboardingScreen({
  steps,
  onComplete,
  redirectTo,
  completingText = "Finalizando...",
}: OnboardingScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleting, setIsCompleting] = useState(false);
  const navigate = useNavigate();

  const totalSteps = steps.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;
  const isLastStep = currentStep === totalSteps - 1;
  const isFirstStep = currentStep === 0;

  const handleNext = async () => {
    if (isLastStep) {
      setIsCompleting(true);
      try {
        await onComplete();
        if (redirectTo) {
          navigate(redirectTo);
        }
      } catch (error) {
        console.error("Erro ao completar onboarding:", error);
      } finally {
        setIsCompleting(false);
      }
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSkip = async () => {
    setIsCompleting(true);
    try {
      await onComplete();
      if (redirectTo) {
        navigate(redirectTo);
      }
    } catch (error) {
      console.error("Erro ao pular onboarding:", error);
    } finally {
      setIsCompleting(false);
    }
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="fixed inset-0 z-50 bg-background overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-500/5 to-background" />
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:40px_40px]" />

      {/* Header */}
      <header className="relative z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2">
                <img
                  src="/images/logo-mentisV2.png"
                  alt="Mentis"
                  className="h-5 sm:h-6"
                />
                <span className="text-xs text-muted-foreground">
                  {currentStep + 1} de {totalSteps}
                </span>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              disabled={isCompleting}
              className="gap-1.5 h-8 sm:h-9"
            >
              <span className="text-xs sm:text-sm">Pular</span>
              <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Button>
          </div>
          <Progress value={progress} className="h-1" />
        </div>
      </header>

      {/* Main Content - Scrollable */}
      <main className="relative z-10 h-[calc(100vh-56px-73px)] sm:h-[calc(100vh-64px-81px)] overflow-y-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          <div className="max-w-3xl mx-auto">
            <div className="space-y-6 sm:space-y-8">
              {/* Icon */}
              {currentStepData.icon && (
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl opacity-50" />
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center backdrop-blur-sm border border-primary/20 shadow-lg">
                      {currentStepData.icon}
                    </div>
                  </div>
                </div>
              )}

              {/* Title & Description */}
              <div className="text-center space-y-2 sm:space-y-3">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">
                  {currentStepData.title}
                </h2>
                <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  {currentStepData.description}
                </p>
              </div>

              {/* Image */}
              {currentStepData.image && (
                <div className="relative w-full max-w-2xl mx-auto">
                  <div className="relative aspect-video rounded-xl overflow-hidden shadow-xl border border-border/50 bg-muted">
                    <img
                      src={currentStepData.image}
                      alt={currentStepData.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
              )}

              {/* Custom Content */}
              {currentStepData.content && (
                <div className="w-full max-w-2xl mx-auto">
                  {currentStepData.content}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 z-20 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[73px] sm:h-[81px] gap-3 sm:gap-4">
            {/* Step Indicators */}
            <div className="hidden sm:flex items-center gap-1.5">
              {steps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  disabled={isCompleting}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    index === currentStep
                      ? "w-8 bg-primary"
                      : index < currentStep
                      ? "w-2 bg-primary/50 hover:bg-primary/70"
                      : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  )}
                  aria-label={`Ir para passo ${index + 1}`}
                />
              ))}
            </div>

            {/* Mobile: Simple dots */}
            <div className="flex sm:hidden items-center gap-1">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "h-1.5 w-1.5 rounded-full transition-all",
                    index === currentStep
                      ? "bg-primary w-6"
                      : index < currentStep
                      ? "bg-primary/50"
                      : "bg-muted-foreground/30"
                  )}
                />
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={isFirstStep || isCompleting}
                className="gap-1.5 h-9 sm:h-10"
                size="sm"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Anterior</span>
              </Button>

              <Button
                onClick={handleNext}
                disabled={isCompleting}
                className="gap-1.5 h-9 sm:h-10 shadow-lg"
                size="sm"
              >
                {isCompleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    <span className="hidden sm:inline">{completingText}</span>
                  </>
                ) : isLastStep ? (
                  <>
                    <span>Começar</span>
                    <Check className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <span>Próximo</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
