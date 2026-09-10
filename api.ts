import {
  User,
  Skill,
  UserSkill,
  Career,
  GapAnalysisResponse,
  CourseModule,
  LearningPathResponse,
  AssessmentSummaryItem,
  AssessmentResult,
  TrainerInfo,
  SkillVideoLecture,
  QuestionVideoSolution,
  PracticeQuestionItem,
  ProgressAnalyticsResponse,
  CareerReadinessResponse,
  AIRecommendationResponse,
} from './types';

const TOKEN_KEY = 'capacity_connect_token';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMsg = `Request failed: ${response.statusText}`;
    try {
      const data = await response.json();
      if (data.error) errorMsg = data.error;
    } catch {
      // ignore
    }
    throw new Error(errorMsg);
  }

  return response.json();
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    request<{ user: User; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (payload: any) =>
    request<{ user: User; token: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  demoLogin: (role: 'student' | 'admin') =>
    request<{ user: User; token: string }>('/api/auth/demo-login', {
      method: 'POST',
      body: JSON.stringify({ role }),
    }),

  getMe: () => request<{ user: User }>('/api/auth/me'),

  updateProfile: (payload: any) =>
    request<{ message: string; user: User }>('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  forgotPassword: (email: string) =>
    request<{ message: string }>('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  // Skills & Gaps
  getSkills: () => request<Skill[]>('/api/skills'),
  getUserSkills: (userId?: string) =>
    request<UserSkill[]>(userId ? `/api/skills/user?userId=${userId}` : '/api/skills/user'),
  updateUserSkill: (skillId: string, level: string, score?: number, note?: string) =>
    request<{ message: string; userSkill: UserSkill }>('/api/skills/user', {
      method: 'POST',
      body: JSON.stringify({ skillId, level, score, note }),
    }),
  getSkillGap: (careerId?: string) =>
    request<GapAnalysisResponse>(careerId ? `/api/skills/gap?careerId=${careerId}` : '/api/skills/gap'),

  // Careers
  getCareers: () => request<Career[]>('/api/careers'),
  getCareer: (id: string) => request<Career>(`/api/careers/${id}`),

  // Assessments
  getAssessments: () => request<AssessmentSummaryItem[]>('/api/assessments'),
  getAssessmentQuestions: (skillId: string) =>
    request<{
      skill: { id: string; name: string; category: string };
      totalQuestions: number;
      timeLimitMinutes: number;
      trainer?: TrainerInfo;
      preTestLecture?: SkillVideoLecture;
      questions: {
        id: string;
        question: string;
        codeSnippet?: string;
        options: string[];
        difficulty: string;
        trainerHint?: string;
        videoSolution?: QuestionVideoSolution;
      }[];
    }>(`/api/assessments/${skillId}/questions`),

  submitAssessment: (skillId: string, answers: Record<string, number>) =>
    request<AssessmentResult>('/api/assessments/submit', {
      method: 'POST',
      body: JSON.stringify({ skillId, answers }),
    }),

  getAssessmentHistory: () => request<any[]>('/api/assessments/history'),

  // Learning Path
  getLearningPath: () => request<LearningPathResponse>('/api/learning/path'),
  getModule: (id: string) =>
    request<{
      module: CourseModule;
      skillName: string;
      progress: {
        status: string;
        progressPercent: number;
        notes?: string;
        quizScore?: number;
      };
      nextModuleId: string | null;
      nextModuleTitle: string | null;
    }>(`/api/learning/modules/${id}`),

  updateModuleProgress: (id: string, status: string, progressPercent?: number, notes?: string, quizScore?: number) =>
    request<{ message: string; progress: any }>(`/api/learning/modules/${id}/progress`, {
      method: 'POST',
      body: JSON.stringify({ status, progressPercent, notes, quizScore }),
    }),

  // Practice
  getPracticeQuestions: (params?: { category?: string; difficulty?: string; skillId?: string }) => {
    const q = new URLSearchParams();
    if (params?.category) q.set('category', params.category);
    if (params?.difficulty) q.set('difficulty', params.difficulty);
    if (params?.skillId) q.set('skillId', params.skillId);
    return request<PracticeQuestionItem[]>(`/api/practice?${q.toString()}`);
  },

  submitPractice: (questionId: string, selectedOption?: number, userSolution?: string) =>
    request<{
      solved: boolean;
      score: number;
      feedback: string;
      explanation?: string;
      correctOptionIndex?: number;
    }>('/api/practice/submit', {
      method: 'POST',
      body: JSON.stringify({ questionId, selectedOption, userSolution }),
    }),

  getPracticeStats: () =>
    request<{
      totalQuestions: number;
      solvedCount: number;
      attemptsTotal: number;
      accuracyPercentage: number;
    }>('/api/practice/stats'),

  // Progress Analytics & Career Readiness
  getProgressAnalytics: () => request<ProgressAnalyticsResponse>('/api/progress/analytics'),
  getCareerReadiness: () => request<CareerReadinessResponse>('/api/progress/career-readiness'),

  // AI Recommendations
  getAIRecommendations: () => request<AIRecommendationResponse>('/api/recommendations'),

  // Admin
  getAdminStats: () =>
    request<{
      totalStudents: number;
      totalSkills: number;
      totalCareers: number;
      totalModules: number;
      totalAssessmentsTaken: number;
      averageReadiness: number;
    }>('/api/admin/stats'),

  getAdminStudents: () => request<any[]>('/api/admin/students'),

  createAdminSkill: (skill: any) =>
    request<{ message: string; skill: Skill }>('/api/admin/skills', {
      method: 'POST',
      body: JSON.stringify(skill),
    }),

  createAdminCareer: (career: any) =>
    request<{ message: string; career: Career }>('/api/admin/careers', {
      method: 'POST',
      body: JSON.stringify(career),
    }),

  createAdminCourse: (module: any) =>
    request<{ message: string; module: CourseModule }>('/api/admin/courses', {
      method: 'POST',
      body: JSON.stringify(module),
    }),

  createAdminQuestion: (question: any) =>
    request<{ message: string; question: any }>('/api/admin/questions', {
      method: 'POST',
      body: JSON.stringify(question),
    }),

  resetDemoDb: () =>
    request<{ message: string }>('/api/admin/reset-demo', {
      method: 'POST',
    }),
};
