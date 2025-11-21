// Tipos para estatísticas de humor

export interface MoodAverages {
  score_mood: number;
  score_anxiety: number;
  score_energy: number;
  score_sleep: number;
  score_stress: number;
}

export interface MoodTrends {
  score_mood: number;
  score_anxiety: number;
  score_energy: number;
  score_sleep: number;
  score_stress: number;
}

export interface MoodStatsOverview {
  totalRecords: number;
  averages: MoodAverages | null;
  trends: MoodTrends | null;
  lastRecord: MoodRecordScore | null;
  streaks: number;
}

export interface MoodRecordScore {
  score_mood: number;
  score_anxiety: number;
  score_energy: number;
  score_sleep: number;
  score_stress: number;
  date: Date | string;
}

// Comparação de períodos
export interface PeriodData {
  period: string;
  recordCount: number;
  averages: {
    mood: number;
    anxiety: number;
    energy: number;
    sleep: number;
    stress: number;
  } | null;
}

export interface PeriodComparison {
  current: PeriodData;
  previous: PeriodData;
}

// Date range
export interface DateRangeParams {
  startDate: string;
  endDate: string;
}

export interface MoodRecordByRange {
  id: string;
  userId: string;
  score_mood: number;
  score_anxiety: number;
  score_energy: number;
  score_sleep: number;
  score_stress: number;
  date: Date | string;
  notes?: string;
  transcripted_audio?: string;
  ai_insight?: string;
  average_mood_score: number;
  created_at: Date | string;
  updated_at: Date | string;
}

export type PeriodType = "week" | "month" | "year";
