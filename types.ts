export type ProficiencyLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type UserRole = 'student' | 'admin';

export interface UserProfile {
  educationLevel: string;
  branch: string;
  currentYearSemester: string;
  college: string;
  interests: string[];
  targetCareerId: string;
  phone?: string;
  avatarUrl?: string;
  bio?: string;
  onboardingCompleted: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  profile: UserProfile;
}

export interface Skill {
  id: string;
  name: string;
  category: 'Programming' | 'Computer Science' | 'Web Development' | 'Core Engineering' | 'Soft Skills';
  description: string;
  iconName: string;
  popularIn: string[];
}

export interface SkillHistoryEntry {
  date: string;
  level: ProficiencyLevel;
  score: number;
  note: string;
}

export interface UserSkill {
  id: string;
  userId: string;
  skillId: string;
  skillName?: string;
  category?: string;
  iconName?: string;
  description?: string;
  level: ProficiencyLevel;
  score: number;
  lastAssessedAt: string;
  history: SkillHistoryEntry[];
}

export interface RequiredSkill {
  skillId: string;
  skillName?: string;
  category?: string;
  iconName?: string;
  minProficiency: ProficiencyLevel;
  weight: number;
}

export interface Career {
  id: string;
  title: string;
  category: string;
  description: string;
  averageSalaryIndia?: string;
  averageSalary?: string;
  demandLevel: 'High' | 'Very High' | 'Moderate';
  requiredSkills: RequiredSkill[];
  skills?: RequiredSkill[];
}

export interface GapItem {
  skillId: string;
  skillName: string;
  category: string;
  currentLevel: ProficiencyLevel | 'None';
  requiredLevel: ProficiencyLevel;
  currentScore: number;
  weight: number;
  gapType: 'Met' | 'Low' | 'Medium' | 'High' | 'Critical';
  statusText: string;
  isMet: boolean;
}

export interface GapAnalysisResponse {
  career: {
    id: string;
    title: string;
    category: string;
    description: string;
    averageSalary?: string;
    demandLevel: string;
  };
  gaps: GapItem[];
  stats: {
    totalRequired: number;
    metCount: number;
    criticalCount: number;
    overallReadinessPercent: number;
  };
}

export interface CodeExample {
  language: string;
  title: string;
  code: string;
  explanation: string;
}

export interface ModuleQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface CourseModule {
  id: string;
  skillId: string;
  careerId?: string;
  title: string;
  order: number;
  level: ProficiencyLevel;
  estimatedMinutes: number;
  description: string;
  videoPlaceholderUrl?: string;
  notes: string;
  codeExamples: CodeExample[];
  practiceQuestions: ModuleQuestion[];
}

export interface LearningPathStep {
  id: string;
  stepNumber: number;
  title: string;
  skillId: string;
  skillName: string;
  level: ProficiencyLevel;
  estimatedMinutes: number;
  description: string;
  status: 'completed' | 'in_progress' | 'not_started';
  progressPercent: number;
  isCurrent: boolean;
  questionCount: number;
  codeExampleCount: number;
}

export interface LearningPathResponse {
  careerGoal: string;
  totalModules: number;
  completedModules: number;
  overallPathPercent: number;
  sequence: LearningPathStep[];
}

export interface AssessmentSummaryItem {
  skillId: string;
  skillName: string;
  category: string;
  iconName: string;
  questionCount: number;
  currentLevel: ProficiencyLevel | 'Unassessed';
  currentScore: number;
  lastAttemptDate: string | null;
  lastAttemptScore: number | null;
  hasQuestions: boolean;
}

export interface TrainerInfo {
  name: string;
  role: string;
  organization: string;
  avatarUrl?: string;
  experience?: string;
  bio: string;
  audioIntroScript?: string;
  rules: string[];
  tips: string[];
}

export interface SkillVideoLecture {
  id: string;
  skillId: string;
  title: string;
  instructor: string;
  durationMinutes: number;
  videoUrl: string;
  thumbnailUrl?: string;
  summary: string;
  topicsCovered: string[];
  keyCheatSheetNotes: string[];
}

export interface QuestionVideoSolution {
  questionId: string;
  videoUrl: string;
  title: string;
  duration: string;
  instructor: string;
  keyTakeaway: string;
  timeComplexity?: string;
  spaceComplexity?: string;
  codeWalkthrough?: string;
  timestamps: { time: string; label: string }[];
}

export interface QuestionBreakdownItem {
  id: string;
  question: string;
  codeSnippet?: string;
  options: string[];
  userAnswerIndex: number | null;
  correctIndex: number;
  isCorrect: boolean;
  explanation: string;
  trainerHint?: string;
  videoSolution?: QuestionVideoSolution;
}

export interface AssessmentResult {
  message: string;
  skillName: string;
  summary: {
    correctCount: number;
    totalQuestions: number;
    percentage: number;
    estimatedLevel: ProficiencyLevel;
    previousLevel: string;
    previousScore: number;
    newScore: number;
    levelImproved: boolean;
    scoreImproved: boolean;
  };
  breakdown: QuestionBreakdownItem[];
}

export interface PracticeQuestionItem {
  id: string;
  title: string;
  category: 'MCQ' | 'Coding' | 'Aptitude' | 'Technical';
  skillId: string;
  skillName: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  templateCode?: string;
  options?: string[];
  hasCode: boolean;
  solved: boolean;
  attemptsCount: number;
  lastScore: number;
  explanation?: string;
}

export interface ProgressAnalyticsResponse {
  careerGoal: string;
  overallCareerReadiness: number;
  capacityStatement: string;
  improvements: {
    skillName: string;
    fromLevel: ProficiencyLevel;
    toLevel: ProficiencyLevel;
    scoreDelta: number;
    description: string;
  }[];
  highlightImprovement: string;
  stats: {
    streakDays: number;
    completedModulesCount: number;
    inProgressCount: number;
    totalSolvedPractice: number;
    assessmentsTaken: number;
    estimatedHoursSpent: number;
  };
  strongSkills: { skillId: string; skillName: string; level: ProficiencyLevel; score: number }[];
  weakSkills: { skillId: string; skillName: string; level: ProficiencyLevel; score: number }[];
  skillReadinessBreakdown: {
    skillId: string;
    skillName: string;
    currentLevel: string;
    requiredLevel: string;
    score: number;
    readinessPct: number;
    isReady: boolean;
  }[];
  timeline: {
    week: string;
    capacityScore: number;
    benchmarkTarget: number;
    dsaScore: number;
    cppScore: number;
    dbmsScore: number;
    oopScore: number;
    hoursSpent: number;
    problemsSolved: number;
    modulesCompleted: number;
  }[];
}

export interface CareerReadinessResponse {
  career: {
    id: string;
    title: string;
    category: string;
    averageSalary?: string;
    demandLevel: string;
  };
  readinessPercent: number;
  skills: {
    skillId: string;
    skillName: string;
    category: string;
    currentLevel: string;
    requiredLevel: string;
    score: number;
    weight: number;
    isReady: boolean;
  }[];
  readySkills: any[];
  weakSkills: any[];
  suggestedNextSteps: {
    title: string;
    action: string;
    impact: string;
  }[];
}

export interface AIRecommendationResponse {
  recommendedNextSkill: string;
  recommendedSkillReason: string;
  gapExplanation: string;
  studySuggestions: string[];
  weakAreaRecommendations: {
    skillName: string;
    gap: string;
    actionableTip: string;
  }[];
  generatedAt: string;
}
