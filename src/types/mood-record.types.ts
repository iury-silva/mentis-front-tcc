export interface MoodScores {
  score_mood: number;
  score_anxiety: number;
  score_energy: number;
  score_sleep: number;
  score_stress: number;
}

export interface VoiceMetricsAnalysis {
  duration_seconds: number;
  rms: number;
  tempo_bpm: number;
  mfccs_mean: number[];
  spectral_centroid: number;
  spectral_bandwidth: number;
  rolloff: number;
  zcr: number;
  pitch_mean: number;
  pitch_std: number;
  jitter_local: number;
  shimmer_local: number;
  hnr: number;
  formant_f1: number;
  formant_f2: number;
  formant_f3: number;
}

export interface MoodAnalysisResponse extends MoodScores {
  notes?: string;
  transcripted_audio?: string;
  ai_insight: string;
  ai_features?: VoiceMetricsAnalysis;
}

export interface CreateMoodDto extends MoodScores {
  notes?: string;
}

export interface AnalyzeMoodVoiceResponse {
  transcription?: string;
  voiceMetrics?: VoiceMetricsAnalysis;
  aiAnalysis?: MoodAnalysisResponse;
  message?: string;
}

export interface AnalyzeMoodTextResponse {
  aiAnalysis?: MoodAnalysisResponse;
  createdRecord?: Record<string, unknown>;
  message?: string;
}

export interface MoodRecordItem {
  id: string;
  userId: string;
  score_mood: number;
  score_anxiety: number;
  score_energy: number;
  score_sleep: number;
  score_stress: number;
  notes?: string;
  transcripted_audio?: string;
  ai_insight: string;
  date: string;
  average_mood_score: number;
  createdAt: string;
  updatedAt: string;
}

// Tipo da paginação
export interface Pagination {
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

// Histórico completo com paginação
export interface MoodRecordsHistory {
  records: MoodRecordItem[];
  pagination: Pagination;
}

// Dados simples (ex: cards, dashboard etc)
export interface MoodRecordsCardData {
  records: MoodRecordItem[];
}

export interface HasMoodRecordTodayResponse {
  hasRecordToday: boolean;
}

export type MoodRecordMode = "text" | "voice";
