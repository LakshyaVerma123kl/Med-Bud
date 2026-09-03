"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Lightbulb,
  RotateCcw,
  BarChart3,
  Trophy,
  Flame,
  Clock,
  BookOpen
} from "lucide-react";
import { useQuiz } from "@/hooks/useQuiz";
import { useProgress } from "@/hooks/useProgress";
import { getQuestionsForChapter, getQuestionsForBook } from "@/lib/data/seed-questions";
import { getChapterById } from "@/lib/data/chapters";
import { getBookById } from "@/lib/data/books";
import { getMotivationalFeedback, getStreakMessage, getCompletionMessage } from "@/lib/feedback";
import { ProgressRing } from "./ProgressRing";
import { BookId, QuizMode, Question } from "@/lib/types";

interface QuizContentProps {
  bookId: BookId;
  chapterId: string;
  mode: string;
  questions?: Question[];
}

export function QuizContent({ bookId, chapterId, mode, questions: initialQuestions }: QuizContentProps) {
  const chapter = getChapterById(chapterId);
  const book = getBookById(bookId);
  const [dbQuestions, setDbQuestions] = useState<Question[]>(initialQuestions || []);
  const [loading, setLoading] = useState(!initialQuestions);

  // Fallback static questions
  const staticQuestions = chapterId
    ? getQuestionsForChapter(chapterId)
    : getQuestionsForBook(bookId);

  useEffect(() => {
    if (initialQuestions) return; // Skip fetch if questions provided

    async function fetchQuestions() {
      try {
        setLoading(true);
        // Call the dynamic API route which guarantees LIVE filesystem reading
        const url = chapterId 
          ? `/api/questions?chapter=${chapterId}` 
          : `/api/questions?book=${bookId}`;
          
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch questions");
        
        const data = await res.json();
        if (data.questions && data.questions.length > 0) {
          setDbQuestions(data.questions);
        } else {
          // Absolute fallback if API is empty
          setDbQuestions(staticQuestions);
        }
      } catch (err) {
        setDbQuestions(staticQuestions);
      } finally {
        setLoading(false);
      }
    }
    fetchQuestions();
  }, [bookId, chapterId, initialQuestions]);

  const questions = dbQuestions;

  const {
    state,
    currentQuestion,
    shuffledOptionIndices,
    selectOption,
    nextQuestion,
    getResult,
    restart,
    progress: quizProgress,
  } = useQuiz({
    questions,
    mode: (mode as QuizMode) || "practice",
    bookId,
    chapterId,
    questionCount: Math.min(questions.length, 25),
  });

  const { updateAfterQuiz } = useProgress();
  const [feedback, setFeedback] = useState<{ message: string; emoji: string; type: string } | null>(null);
  const [hasRecordedResult, setHasRecordedResult] = useState(false);

  // If no questions found
  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="clean-card rounded-2xl p-8 max-w-md w-full text-center">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">No Questions Found</h2>
          <p className="text-sm text-muted-foreground mb-6">
            We are continuously curating verified questions for this chapter.
          </p>
          <Link
            href={`/book/${bookId}`}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Chapters
          </Link>
        </div>
      </div>
    );
  }

  // ── Results Summary Screen ────────────────────────────────────────────────
  if (state.isComplete) {
    const result = getResult();

    if (!hasRecordedResult) {
      updateAfterQuiz(bookId, chapterId, result.correctAnswers, result.totalQuestions, state.streak);
      setHasRecordedResult(true);
    }

    const minutes = Math.floor(result.timeTaken / 60);
    const seconds = Math.round(result.timeTaken % 60);

    return (
      <div className="min-h-screen bg-background py-10 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Main Result Card */}
          <div className="clean-card rounded-3xl p-8 sm:p-10 text-center mb-8">
            <div className="flex justify-center mb-6">
              <ProgressRing progress={result.accuracy} size={130} strokeWidth={9} showLabel={true} />
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Quiz Completed!
            </h2>
            <p className="text-muted-foreground text-base max-w-md mx-auto mb-8">
              {getCompletionMessage(result.accuracy)}
            </p>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-muted/40 border border-border/60 mb-8 max-w-md mx-auto">
              <div className="text-center">
                <span className="block text-xl font-bold text-emerald-600 dark:text-emerald-400">
                  {result.correctAnswers}
                </span>
                <span className="text-xs text-muted-foreground font-medium">Correct</span>
              </div>
              <div className="text-center border-x border-border">
                <span className="block text-xl font-bold text-rose-600 dark:text-rose-400">
                  {result.totalQuestions - result.correctAnswers}
                </span>
                <span className="text-xs text-muted-foreground font-medium">Incorrect</span>
              </div>
              <div className="text-center">
                <span className="block text-xl font-bold text-foreground">
                  {minutes}:{seconds.toString().padStart(2, "0")}
                </span>
                <span className="text-xs text-muted-foreground font-medium">Duration</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <button
                onClick={() => {
                  restart();
                  setHasRecordedResult(false);
                  setFeedback(null);
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 min-h-[56px] rounded-xl bg-primary text-white text-base sm:text-lg font-bold hover:bg-primary/90 transition-all shadow-md active:scale-95"
              >
                <RotateCcw className="w-5 h-5" />
                Retry Quiz
              </button>
              <Link
                href={`/book/${bookId}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 min-h-[56px] rounded-xl bg-card border border-border text-foreground text-base sm:text-lg font-bold hover:bg-muted transition-all active:scale-95"
              >
                <ArrowLeft className="w-5 h-5" />
                Other Chapters
              </Link>
              <Link
                href="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 min-h-[56px] rounded-xl bg-card border border-border text-foreground text-base sm:text-lg font-bold hover:bg-muted transition-all active:scale-95"
              >
                <BarChart3 className="w-5 h-5" />
                Dashboard
              </Link>
            </div>
          </div>

          {/* Detailed Question Review */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground">Detailed Question Review</h3>
            {result.questionsWithAnswers.map((qa, index) => (
              <div
                key={qa.question.id}
                className="clean-card rounded-2xl p-6 border-l-4"
                style={{
                  borderLeftColor: qa.isCorrect ? "#10B981" : "#F43F5E"
                }}
              >
                <div className="flex items-start gap-3 mb-4">
                  {qa.isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Question {index + 1}
                    </span>
                    <h4 className="text-base font-semibold text-foreground mt-1 leading-snug">
                      {qa.question.question}
                    </h4>
                  </div>
                </div>

                {/* Options list */}
                <div className="space-y-2 ml-8 mb-4">
                  {qa.question.options.map((opt, optIdx) => {
                    const isCorrectOpt = optIdx === qa.question.correct_index;
                    const isUserChoice = optIdx === qa.chosenIndex;

                    let badgeStyle = "text-muted-foreground bg-muted/40 border-transparent";
                    if (isCorrectOpt) {
                      badgeStyle = "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 font-semibold";
                    } else if (isUserChoice && !isCorrectOpt) {
                      badgeStyle = "text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800 line-through";
                    }

                    return (
                      <div
                        key={optIdx}
                        className={`text-sm px-3.5 py-2 rounded-lg border flex items-center justify-between ${badgeStyle}`}
                      >
                        <span>
                          <strong className="mr-2">{String.fromCharCode(65 + optIdx)}.</strong>
                          {opt}
                        </span>
                        {isCorrectOpt && <span className="text-xs font-bold">✓ Correct Answer</span>}
                        {isUserChoice && !isCorrectOpt && <span className="text-xs font-bold">✗ Your Answer</span>}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                <div className="ml-8 p-3.5 rounded-xl bg-muted/50 border border-border text-xs leading-relaxed text-muted-foreground">
                  <div className="flex items-center gap-1.5 font-bold text-foreground mb-1">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                    <span>Clinical Rationale & Reference</span>
                  </div>
                  <p>{qa.question.explanation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Active Question Screen ────────────────────────────────────────────────
  if (!currentQuestion) return null;

  const handleSelect = (originalIndex: number) => {
    const isCorrect = originalIndex === currentQuestion.correct_index;
    const fb = getMotivationalFeedback(isCorrect);
    setFeedback(fb);
    selectOption(originalIndex);
  };

  const streakMsg = getStreakMessage(state.streak);

  return (
    <div className="min-h-screen bg-background py-8 px-4 flex flex-col items-center justify-start">
      <div className="w-full max-w-2xl mx-auto">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href={`/book/${bookId}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="truncate max-w-[200px] sm:max-w-none">
              {chapter?.name || book?.subject || "Back"}
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {state.streak >= 2 && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold border border-amber-500/20">
                <Flame className="w-3.5 h-3.5" />
                <span>Streak {state.streak}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
              <Trophy className="w-3.5 h-3.5" />
              <span>Score {state.score}/{quizProgress.total}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-2">
            <span>
              Question {quizProgress.current} of {quizProgress.total}
            </span>
            <span>{quizProgress.percentage}% Completed</span>
          </div>
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${quizProgress.percentage}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="clean-card rounded-2xl p-6 sm:p-8 mb-6">
          {/* Metadata badges */}
          <div className="flex items-center gap-2 mb-4">
            <span
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${
                currentQuestion.difficulty === "easy"
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : currentQuestion.difficulty === "medium"
                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                  : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
              }`}
            >
              {currentQuestion.difficulty}
            </span>
            {currentQuestion.topic && (
              <span className="text-xs text-muted-foreground font-medium">
                • {currentQuestion.topic}
              </span>
            )}
          </div>

          {/* Question Text */}
          <h2 className="text-lg sm:text-xl font-bold text-foreground leading-relaxed mb-6">
            {currentQuestion.question}
          </h2>

          {/* Options */}
          <div className="space-y-3.5 sm:space-y-4">
            {shuffledOptionIndices.map((originalIndex, displayIndex) => {
              const optionText = currentQuestion.options[originalIndex];
              const isSelected = state.selectedOption === originalIndex;
              const isCorrect = originalIndex === currentQuestion.correct_index;
              const isAnswered = state.isAnswered;

              let optionStateClass = "";
              if (isAnswered) {
                if (isCorrect) optionStateClass = "correct";
                else if (isSelected && !isCorrect) optionStateClass = "incorrect";
              } else if (isSelected) {
                optionStateClass = "selected";
              }

              return (
                <button
                  key={originalIndex}
                  onClick={() => handleSelect(originalIndex)}
                  disabled={isAnswered}
                  className={`quiz-option min-h-[64px] ${optionStateClass}`}
                >
                  <span className="option-letter">
                    {isAnswered && isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    ) : isAnswered && isSelected && !isCorrect ? (
                      <XCircle className="w-4 h-4 text-white" />
                    ) : (
                      String.fromCharCode(65 + displayIndex)
                    )}
                  </span>
                  <span className="flex-1 text-[15px] sm:text-base font-medium leading-relaxed">
                    {optionText}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Motivational Streak Notice */}
        {streakMsg && !state.isAnswered && (
          <div className="text-center text-xs font-semibold text-amber-600 dark:text-amber-400 mb-4">
            🔥 {streakMsg}
          </div>
        )}

        {/* Answer Rationale & Next Button */}
        <AnimatePresence>
          {state.showExplanation && feedback && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 mb-24 sm:mb-8"
            >
              {/* Feedback banner */}
              <div
                className={`p-4 rounded-xl border flex items-center gap-3 ${
                  feedback.type === "correct"
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                    : "bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-400"
                }`}
              >
                <span className="text-xl">{feedback.emoji}</span>
                <span className="text-sm font-semibold">{feedback.message}</span>
              </div>

              {/* Rationale explanation box */}
              <div className="clean-card rounded-xl p-5 border border-border">
                <div className="flex items-center gap-2 text-sm font-bold text-foreground mb-2">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <span>Clinical Rationale & Textbook Reference</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {currentQuestion.explanation}
                </p>
              </div>

              {/* Next Question Button (Desktop) */}
              <button
                onClick={() => {
                  nextQuestion();
                  setFeedback(null);
                }}
                className="hidden sm:flex w-full py-4 px-6 min-h-[56px] rounded-xl bg-primary text-white font-bold text-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 items-center justify-center gap-2 active:scale-[0.98]"
              >
                <span>{quizProgress.current === quizProgress.total ? "View Results Summary" : "Next Question"}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Sticky Next Button */}
        <AnimatePresence>
          {state.showExplanation && feedback && (
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed bottom-0 left-0 right-0 z-50 sm:hidden bg-background/85 backdrop-blur-2xl border-t border-border p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]"
            >
              <button
                onClick={() => {
                  nextQuestion();
                  setFeedback(null);
                }}
                className="w-full py-4 min-h-[56px] rounded-xl bg-primary text-white font-bold text-lg shadow-xl shadow-primary/20 flex items-center justify-center gap-2 active:scale-95 transition-transform"
              >
                <span>{quizProgress.current === quizProgress.total ? "View Results" : "Next Question"}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
