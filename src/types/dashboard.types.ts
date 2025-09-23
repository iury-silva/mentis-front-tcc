export interface DashboardSummary {
  totalUsers: number;
  totalQuestionnaires: number;
  totalBlocks: number;
  usersAnswered: number;
  usersNotAnswered: number;
  completionRate: number;
  averageResponsesPerUser: number;
  totalResponses: number;
}

export interface ChartDataItem {
  name: string;
  value: number;
  fill: string;
}

export interface UsersByRole {
  role: string;
  count: number;
  fill: string;
}

export interface RegistrationsByMonth {
  month: string;
  registrations: number;
  monthKey: string;
}

export interface BlockCompletionStats {
  blockTitle: string;
  questionnaire: string;
  totalQuestions: number;
  completedUsers: number;
  totalUsers: number;
  completionRate: number;
  partialResponses: number;
}

export interface ResponsesByBlock {
  block: string;
  responses: number;
  questionsCount: number;
  avgResponsesPerQuestion: number;
}

export interface ResponsesByMonth {
  month: string;
  responses: number;
  monthKey: string;
}

export interface QuestionTypeDistribution {
  type: string;
  count: number;
  fill: string;
}

export interface TopActiveUser {
  name: string;
  email: string;
  responses: number;
  lastActivity: string;
}

export interface DailyActivity {
  day: string;
  responses: number;
  dayKey: string;
}

export interface WeeklyGrowth {
  userGrowth: number;
  responseGrowth: number;
  currentWeekUsers: number;
  previousWeekUsers: number;
  currentWeekResponses: number;
  previousWeekResponses: number;
}

export interface DashboardData {
  summary: DashboardSummary;
  charts: {
    userDistribution: ChartDataItem[];
    usersByRole: UsersByRole[];
    registrationsByMonth: RegistrationsByMonth[];
    blockCompletionStats: BlockCompletionStats[];
    responsesByBlock: ResponsesByBlock[];
    responsesByMonth: ResponsesByMonth[];
    questionTypeDistribution: QuestionTypeDistribution[];
    topActiveUsers: TopActiveUser[];
  };
  trends: {
    dailyActivity: DailyActivity[];
    weeklyGrowth: WeeklyGrowth;
  };
}

export interface QuestionAnalysisOption {
  option: string;
  count: number;
  percentage: number;
  fill: string;
}

export interface QuestionAnalysisResponse {
  question: string;
  type: string;
  blockTitle: string;
  totalResponses: number;
  options?: QuestionAnalysisOption[];
  responses?: Array<{
    value: string;
    createdAt: string;
    user: string;
    userRole: string;
  }>;
}
