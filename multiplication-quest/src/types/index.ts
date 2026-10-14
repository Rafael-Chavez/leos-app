// Core multiplication fact types
export interface MultiplicationFact {
  factor1: number;
  factor2: number;
  product: number;
  normalizedKey: string; // e.g., "3x4" (always smaller factor first)
  displayKey: string; // e.g., "4x3" (as displayed)
}

// Mastery tracking
export type MasteryStatus = 'new' | 'learning' | 'practicing' | 'mastered';

export interface FactProgress {
  normalizedKey: string;
  attempts: number;
  correctAttempts: number;
  recentOutcomes: boolean[]; // last 10 attempts
  consecutiveCorrect: number;
  lastPracticedAt: string | null;
  lastMasteredAt: string | null;
  masteryStatus: MasteryStatus;
}

// Question types
export type QuestionType = 'direct' | 'missing-factor' | 'word-problem';
export type AnswerType = 'multiple-choice' | 'typed';

export interface Question {
  id: string;
  type: QuestionType;
  answerType: AnswerType;
  factor1: number;
  factor2: number;
  correctAnswer: number;
  questionText: string;
  choices?: number[]; // for multiple choice
  missingPosition?: 'factor1' | 'factor2' | 'product'; // for missing-factor
  normalizedKey: string;
}

export interface QuestionAttempt {
  questionId: string;
  question: Question;
  userAnswer: number | null;
  isCorrect: boolean;
  timestamp: string;
  responseTime?: number; // milliseconds
}

// Quiz and Practice
export interface QuizSettings {
  questionCount: 5 | 10 | 20;
  selectedTables: number[]; // 0-10
  questionTypes: QuestionType[];
  answerType: AnswerType;
  timed: boolean;
  timeLimit?: number; // seconds
  hintsEnabled: boolean;
}

export interface QuizSession {
  id: string;
  type: 'practice' | 'test';
  settings: QuizSettings;
  questions: Question[];
  attempts: QuestionAttempt[];
  startedAt: string;
  completedAt: string | null;
  status: 'in-progress' | 'completed' | 'abandoned';
}

// Assessment
export interface AssessmentResult {
  id: string;
  questionCount: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  score: number; // percentage
  missedFacts: MultiplicationFact[];
  factsByTable: Record<number, { correct: number; total: number }>;
  completedAt: string;
}

// Student Profile
export interface StudentProfile {
  id: string;
  displayName: string;
  level: number;
  experiencePoints: number;
  coins: number;
  currentStreak: number;
  lastActiveDate: string;
  dailyGoal: number; // questions per day
  createdAt: string;
}

// Game and Adventure
export interface AdventureArea {
  id: string;
  name: string;
  description: string;
  theme: string;
  unlocked: boolean;
  completed: boolean;
  challenges: Challenge[];
  stars: number;
  maxStars: number;
}

export interface Challenge {
  id: string;
  areaId: string;
  name: string;
  description: string;
  questionCount: number;
  difficulty: 'easy' | 'medium' | 'hard';
  completed: boolean;
  stars: number;
  bestScore: number;
}

export interface GameProgress {
  unlockedAreas: string[];
  completedChallenges: string[];
  achievements: Achievement[];
  cosmeticUnlocks: string[];
  bestScores: Record<string, number>;
  totalStars: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string | null;
  progress: number;
  target: number;
}

// Rewards
export interface Reward {
  type: 'xp' | 'coins' | 'star' | 'achievement' | 'unlock';
  amount?: number;
  itemId?: string;
  message: string;
}

// Lessons
export interface Lesson {
  id: string;
  title: string;
  description: string;
  table: number; // which multiplication table (0-10)
  content: LessonContent;
  practiceQuestions: Question[];
  completed: boolean;
}

export interface LessonContent {
  explanation: string;
  visualExamples: VisualExample[];
  strategies: string[];
  workedExamples: WorkedExample[];
}

export interface VisualExample {
  type: 'array' | 'groups' | 'number-line' | 'pattern';
  description: string;
  imageData?: string; // SVG or data URL
}

export interface WorkedExample {
  problem: string;
  steps: string[];
  answer: number;
}

// Parent Dashboard
export interface LearningAnalytics {
  totalAttempts: number;
  totalCorrect: number;
  overallAccuracy: number;
  recentAccuracy: number; // last 50 questions
  masteredCount: number;
  learningCount: number;
  needsReviewCount: number;
  newCount: number;
  studySessionsCompleted: number;
  testsCompleted: number;
  averageTestScore: number;
  totalLearningTime: number; // minutes
  factsByStatus: Record<string, FactProgress>;
  weakestTables: number[];
  strongestTables: number[];
}

// Settings
export interface AppSettings {
  dailyGoal: number;
  defaultQuizLength: 5 | 10 | 20;
  defaultTimerEnabled: boolean;
  defaultTimeLimit: number;
  hintsEnabled: boolean;
  soundEnabled: boolean;
  animationsEnabled: boolean;
  masteryThresholds: {
    consecutiveCorrect: number;
    minimumSessions: number;
    accuracyPercentage: number;
  };
}

// Storage schema
export interface StorageSchema {
  version: number;
  student: StudentProfile;
  factProgress: Record<string, FactProgress>;
  sessions: QuizSession[];
  assessments: AssessmentResult[];
  gameProgress: GameProgress;
  lessons: Record<string, { completed: boolean; lastAccessedAt: string }>;
  settings: AppSettings;
  lastSyncedAt: string;
}
