// ─── Core Data Types ─────────────────────────────────────────────────────────

export type BookId = "narayan_reddy" | "park";
export type Difficulty = "easy" | "medium" | "hard";
export type QuestionSource = "seed" | "ai_variation" | "ai_generated";
export type QuizMode = "practice" | "timed" | "chapter_mastery" | "weak_areas";

export interface Question {
  id: string;
  book: BookId;
  chapter: string;
  topic?: string;
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
  difficulty: Difficulty;
  source: QuestionSource;
  verified: boolean;
  verified_by?: string;
  confidence?: number;
  content_hash: string;
  created_at: string;
  updated_at: string;
}

export interface QuizAttempt {
  id: string;
  user_id: string;
  question_id: string;
  chosen_index: number;
  correct: boolean;
  answered_at: string;
}

export interface ChapterMastery {
  user_id: string;
  book: BookId;
  chapter: string;
  accuracy_pct: number;
  questions_attempted: number;
  current_streak: number;
  last_practiced: string;
}

export interface Chapter {
  id: string;
  name: string;
  book: BookId;
  questionCount: number;
  description?: string;
}

export interface Book {
  id: BookId;
  title: string;
  author: string;
  subject: string;
  description: string;
  icon: string;
  chapterCount: number;
  totalQuestions: number;
  color: string;
  gradient: string;
}

// ─── Quiz State ──────────────────────────────────────────────────────────────

export interface QuizState {
  questions: Question[];
  currentIndex: number;
  answers: (number | null)[];
  score: number;
  streak: number;
  startTime: number;
  endTime?: number;
  mode: QuizMode;
  bookId: BookId;
  chapterId: string;
  isComplete: boolean;
  showExplanation: boolean;
  selectedOption: number | null;
  isAnswered: boolean;
}

export interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  timeTaken: number;
  streak: number;
  questionsWithAnswers: {
    question: Question;
    chosenIndex: number | null;
    isCorrect: boolean;
  }[];
}

// ─── AI Pipeline Types ───────────────────────────────────────────────────────

export type AIProvider = "gemini" | "groq_gen" | "groq_verify" | "openai" | "anthropic";

export interface AIProviderConfig {
  provider: AIProvider;
  apiKey: string;
  model: string;
  baseUrl?: string;
}

export interface GenerationResult {
  questions: Omit<Question, "id" | "content_hash" | "created_at" | "updated_at" | "verified" | "verified_by" | "confidence" | "source">[];
  provider: AIProvider;
  success: boolean;
  error?: string;
}

export interface VerificationResult {
  isAccurate: boolean;
  issues: string[];
  suggestedCorrection: string | null;
  confidence: number;
  provider: AIProvider;
}

// ─── Motivational Feedback ───────────────────────────────────────────────────

export interface MotivationalFeedback {
  message: string;
  type: "correct" | "incorrect";
  emoji: string;
}

// ─── User Progress ───────────────────────────────────────────────────────────

export interface UserProgress {
  totalQuestionsAnswered: number;
  totalCorrect: number;
  overallAccuracy: number;
  currentStreak: number;
  longestStreak: number;
  chaptersStarted: number;
  chaptersMastered: number;
  lastActive: string;
  badges: Badge[];
  chapterProgress: Record<string, ChapterMastery>;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: string;
  requirement: {
    type: "chapter_mastery" | "streak" | "total_questions" | "accuracy";
    value: number;
    chapter?: string;
    book?: BookId;
  };
}
