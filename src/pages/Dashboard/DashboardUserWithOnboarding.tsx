import { useOnboarding } from "@/hooks/useOnboarding";
import { OnboardingScreen } from "@/components/Onboarding/OnboardingModal";
import { userOnboardingSteps } from "@/components/Onboarding/UserOnboardingSteps";
import DashboardUserPage from "@/pages/Dashboard/DashboardUserPage";

export default function DashboardUserWithOnboarding() {
  const { showOnboarding, completeOnboarding, isCheckingOnboarding } =
    useOnboarding();

  // Loading state enquanto verifica onboarding
  if (isCheckingOnboarding) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se precisa mostrar onboarding, renderiza fullscreen
  if (showOnboarding) {
    return (
      <OnboardingScreen
        steps={userOnboardingSteps}
        onComplete={completeOnboarding}
        redirectTo="/questionnaire"
        completingText="Finalizando tutorial..."
      />
    );
  }

  // Caso contrário, renderiza o dashboard normal
  return <DashboardUserPage />;
}
