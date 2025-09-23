import { api } from "@/api";
import type { DashboardData, QuestionAnalysisResponse } from "@/types/dashboard.types";

export const dashboardService = {
  // Busca todos os dados do dashboard
  async getDashboardData(): Promise<DashboardData> {
    try {
      const data = (await api.get("/dashboard")) as DashboardData;
      return data;
    } catch (error) {
      console.error("Erro ao buscar dados do dashboard:", error);
      throw error;
    }
  },

  // Busca análise específica de uma pergunta
  async getQuestionAnalysis(
    questionId: string
  ): Promise<QuestionAnalysisResponse> {
    try {
      const data = (await api.get(
        `/dashboard/question/${questionId}/analysis`
      )) as QuestionAnalysisResponse;
      return data;
    } catch (error) {
      console.error("Erro ao buscar análise da pergunta:", error);
      throw error;
    }
  },

  // Função para formatar números
  formatNumber(value: number, decimals: number = 0): string {
    return new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  },

  // Função para formatar porcentagem
  formatPercentage(value: number, decimals: number = 1): string {
    return `${this.formatNumber(value, decimals)}%`;
  },

  // Função para formatar data
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  },

  // Função para obter cor baseada no valor
  getColorByValue(value: number, max: number): string {
    const percentage = (value / max) * 100;
    if (percentage >= 80) return "#10b981"; // green-500
    if (percentage >= 60) return "#f59e0b"; // amber-500
    if (percentage >= 40) return "#f97316"; // orange-500
    return "#ef4444"; // red-500
  },

  // Função para calcular crescimento
  calculateGrowth(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  },
};
