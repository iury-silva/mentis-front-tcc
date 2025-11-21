import { api } from "@/api";
import { decrypt } from "@/utils/crypto";
import type {
  MoodStatsOverview,
  PeriodComparison,
  PeriodType,
  DateRangeParams,
  MoodRecordByRange,
} from "@/types/mood-stats.types";

class MoodStatsService {
  private readonly baseUrl = "/mood-record";

  /**
   * Busca visão geral das estatísticas do usuário
   * Retorna médias, tendências, total de registros e streak
   */
  async getStatsOverview(): Promise<MoodStatsOverview> {
    try {
      const data = await api.get(`${this.baseUrl}/stats`);
      return data as MoodStatsOverview;
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
      throw error;
    }
  }

  /**
   * Compara períodos (semana, mês ou ano)
   * Retorna dados do período atual vs período anterior
   */
  async comparePeriods(period: PeriodType): Promise<PeriodComparison> {
    try {
      const data = await api.get(
        `${this.baseUrl}/compare-periods?period=${period}`
      );
      return data as PeriodComparison;
    } catch (error) {
      console.error("Erro ao comparar períodos:", error);
      throw error;
    }
  }

  /**
   * Busca registros por intervalo de datas customizado
   */
  async getByDateRange(params: DateRangeParams): Promise<MoodRecordByRange[]> {
    try {
      const data = await api.get(
        `${this.baseUrl}/range?startDate=${params.startDate}&endDate=${params.endDate}`
      );
      return data as MoodRecordByRange[];
    } catch (error) {
      console.error("Erro ao buscar registros por período:", error);
      throw error;
    }
  }

  /**
   * Gera e faz download do relatório PDF
   * Abre o PDF em uma nova aba do navegador
   */
  async generatePdfReport(): Promise<void> {
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const encryptedToken = localStorage.getItem("authToken");

      if (!encryptedToken) {
        throw new Error("Token de autenticação não encontrado");
      }

      // Descriptografar o token
      const token = decrypt(encryptedToken);

      // Fazer requisição com fetch para obter o blob
      const response = await fetch(`${API_URL}${this.baseUrl}/report/pdf`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao gerar relatório PDF");
      }

      // Obter o blob do PDF
      const blob = await response.blob();

      // Criar URL do blob
      const url = window.URL.createObjectURL(blob);

      // Criar link temporário para download
      const link = document.createElement("a");
      link.href = url;
      link.download = `relatorio-mentis-${
        new Date().toISOString().split("T")[0]
      }.pdf`;

      // Adicionar ao DOM, clicar e remover
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Liberar o objeto URL
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao gerar relatório PDF:", error);
      throw error;
    }
  }

  // Funções auxiliares para formatação

  /**
   * Formata um número com casas decimais
   */
  formatNumber(value: number, decimals: number = 1): string {
    return new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  }

  /**
   * Retorna cor baseada no score (1-5)
   */
  getColorByScore(score: number): string {
    if (score >= 4) return "text-green-600";
    if (score >= 3) return "text-yellow-600";
    if (score >= 2) return "text-orange-600";
    return "text-red-600";
  }

  /**
   * Retorna emoji baseado no score
   */
  getEmojiByScore(score: number): string {
    if (score >= 4.5) return "😊";
    if (score >= 3.5) return "🙂";
    if (score >= 2.5) return "😐";
    if (score >= 1.5) return "😟";
    return "😢";
  }

  /**
   * Calcula a diferença percentual entre dois valores
   */
  calculatePercentageChange(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  }

  /**
   * Formata tendência com sinal + ou -
   */
  formatTrend(value: number, decimals: number = 1): string {
    const formatted = this.formatNumber(Math.abs(value), decimals);
    return value >= 0 ? `+${formatted}` : `-${formatted}`;
  }

  /**
   * Retorna label legível para métrica
   */
  getMetricLabel(metric: string): string {
    const labels: Record<string, string> = {
      score_mood: "Humor",
      mood: "Humor",
      score_anxiety: "Ansiedade",
      anxiety: "Ansiedade",
      score_energy: "Energia",
      energy: "Energia",
      score_sleep: "Sono",
      sleep: "Sono",
      score_stress: "Estresse",
      stress: "Estresse",
    };
    return labels[metric] || metric;
  }

  /**
   * Retorna cor Tailwind para gráficos baseada na métrica
   */
  getChartColor(metric: string): string {
    const colors: Record<string, string> = {
      score_mood: "#8b5cf6", // purple
      mood: "#8b5cf6",
      score_anxiety: "#f59e0b", // amber
      anxiety: "#f59e0b",
      score_energy: "#10b981", // green
      energy: "#10b981",
      score_sleep: "#3b82f6", // blue
      sleep: "#3b82f6",
      score_stress: "#ef4444", // red
      stress: "#ef4444",
    };
    return colors[metric] || "#6b7280";
  }
}

export const moodStatsService = new MoodStatsService();
