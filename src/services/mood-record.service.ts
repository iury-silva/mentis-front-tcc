import { api } from "@/api";
import { decrypt } from "@/utils/crypto";
import type {
  CreateMoodDto,
  AnalyzeMoodVoiceResponse,
  AnalyzeMoodTextResponse,
} from "@/types/mood-record.types";

const API_URL = import.meta.env.VITE_API_URL;

export const moodRecordService = {
  /**
   * Analisa áudio de voz usando IA
   * Nota: usa fetch direto porque precisa enviar FormData (não JSON)
   */
  analyzeVoice: async (audioFile: File): Promise<AnalyzeMoodVoiceResponse> => {
    const formData = new FormData();
    formData.append("file", audioFile);

    const token = decrypt(localStorage.getItem("authToken") || "");

    const response = await fetch(`${API_URL}/mood-record/analyze-voice`, {
      method: "POST",
      headers: {
        // NÃO incluir Content-Type aqui - o browser define automaticamente para multipart/form-data
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    if (response.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      window.location.href = "/login?expired=true";
      throw new Error("Sessão expirada");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: "Erro ao analisar áudio",
      }));
      throw new Error(errorData.message || "Erro ao analisar áudio");
    }

    return response.json();
  },

  /**
   * Analisa registro de humor por texto/sliders
   */
  analyzeText: async (
    data: CreateMoodDto
  ): Promise<AnalyzeMoodTextResponse> => {
    return api.post("/mood-record/analyze-text", data);
  },

  /**
   * Histórico de registros de humor do usuário
   */
  getMoodHistory: async ({ page, limit }: { page: number; limit: number }) => {
    return api.get(`/mood-record/history?page=${page}&limit=${limit}`);
  },

  /**
   *  Remover registro de humor por ID
   */
  deleteMoodRecord: async (id: string): Promise<void> => {
    return api.delete(`/mood-record/delete/${id}`);
  },
};
