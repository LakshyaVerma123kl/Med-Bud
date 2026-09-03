"use client";

import { useState, useEffect, useCallback } from "react";
import { UserProgress, ChapterMastery, Badge, BookId } from "@/lib/types";

const PROGRESS_KEY = "medquiz_progress";

const defaultProgress: UserProgress = {
  totalQuestionsAnswered: 0,
  totalCorrect: 0,
  overallAccuracy: 0,
  currentStreak: 0,
  longestStreak: 0,
  chaptersStarted: 0,
  chaptersMastered: 0,
  lastActive: new Date().toISOString(),
  badges: [],
  chapterProgress: {},
};

const availableBadges: Badge[] = [
  { id: "first-quiz", name: "First Steps", description: "Complete your first quiz", icon: "🎯", requirement: { type: "total_questions", value: 1 } },
  { id: "ten-questions", name: "Getting Started", description: "Answer 10 questions", icon: "📝", requirement: { type: "total_questions", value: 10 } },
  { id: "fifty-questions", name: "Dedicated Learner", description: "Answer 50 questions", icon: "📚", requirement: { type: "total_questions", value: 50 } },
  { id: "hundred-questions", name: "Century Scholar", description: "Answer 100 questions", icon: "💯", requirement: { type: "total_questions", value: 100 } },
  { id: "streak-5", name: "Hot Streak", description: "Get 5 correct in a row", icon: "🔥", requirement: { type: "streak", value: 5 } },
  { id: "streak-10", name: "Unstoppable", description: "Get 10 correct in a row", icon: "⚡", requirement: { type: "streak", value: 10 } },
  { id: "streak-20", name: "Legendary Streak", description: "Get 20 correct in a row", icon: "👑", requirement: { type: "streak", value: 20 } },
  { id: "accuracy-80", name: "Sharp Mind", description: "Achieve 80% overall accuracy", icon: "🎓", requirement: { type: "accuracy", value: 80 } },
  { id: "accuracy-90", name: "Near Perfect", description: "Achieve 90% overall accuracy", icon: "🏆", requirement: { type: "accuracy", value: 90 } },
  { id: "mastery-1", name: "Chapter Master", description: "Master your first chapter (≥80%)", icon: "⭐", requirement: { type: "chapter_mastery", value: 1 } },
  { id: "mastery-5", name: "Multi-Master", description: "Master 5 chapters", icon: "🌟", requirement: { type: "chapter_mastery", value: 5 } },
  { id: "nr-asphyxia", name: "Asphyxia Specialist", description: "Master the Asphyxia chapter", icon: "🫁", requirement: { type: "chapter_mastery", value: 80, chapter: "nr-09", book: "narayan_reddy" } },
  { id: "pk-epi", name: "Epidemiology Pro", description: "Master Principles of Epidemiology", icon: "📊", requirement: { type: "chapter_mastery", value: 80, chapter: "pk-02", book: "park" } },
  { id: "pk-immun", name: "Immunization Expert", description: "Master the Immunization chapter", icon: "💉", requirement: { type: "chapter_mastery", value: 80, chapter: "pk-14", book: "park" } },
  { id: "nr-tox", name: "Toxicology Ace", description: "Master General Toxicology", icon: "☠️", requirement: { type: "chapter_mastery", value: 80, chapter: "nr-14", book: "narayan_reddy" } },
];

function loadProgress(): UserProgress {
  if (typeof window === "undefined") return defaultProgress;
  try {
    const stored = localStorage.getItem(PROGRESS_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return { ...defaultProgress };
}

function saveProgress(progress: UserProgress) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch {}
}

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(defaultProgress);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setProgress(loadProgress());
    setIsLoaded(true);
  }, []);

  const updateAfterQuiz = useCallback(
    (
      bookId: BookId,
      chapterId: string,
      correctAnswers: number,
      totalQuestions: number,
      maxStreak: number
    ) => {
      setProgress((prev) => {
        const newTotal = prev.totalQuestionsAnswered + totalQuestions;
        const newCorrect = prev.totalCorrect + correctAnswers;
        const newAccuracy = newTotal > 0 ? Math.round((newCorrect / newTotal) * 100) : 0;
        const newLongestStreak = Math.max(prev.longestStreak, maxStreak);

        // Update chapter mastery
        const chapterKey = `${bookId}::${chapterId}`;
        const existing = prev.chapterProgress[chapterKey];
        const newAttempted = (existing?.questions_attempted ?? 0) + totalQuestions;
        const oldTotalCorrect = existing
          ? Math.round((existing.accuracy_pct / 100) * existing.questions_attempted)
          : 0;
        const newChapterCorrect = oldTotalCorrect + correctAnswers;
        const newChapterAccuracy = newAttempted > 0 ? Math.round((newChapterCorrect / newAttempted) * 100) : 0;

        const chapterMastery: ChapterMastery = {
          user_id: "local",
          book: bookId,
          chapter: chapterId,
          accuracy_pct: newChapterAccuracy,
          questions_attempted: newAttempted,
          current_streak: maxStreak,
          last_practiced: new Date().toISOString(),
        };

        const newChapterProgress = {
          ...prev.chapterProgress,
          [chapterKey]: chapterMastery,
        };

        const chaptersStarted = Object.keys(newChapterProgress).length;
        const chaptersMastered = Object.values(newChapterProgress).filter(
          (c) => c.accuracy_pct >= 80 && c.questions_attempted >= 5
        ).length;

        // Check badges
        const earnedBadges = checkBadges(
          {
            totalQuestionsAnswered: newTotal,
            totalCorrect: newCorrect,
            overallAccuracy: newAccuracy,
            currentStreak: maxStreak,
            longestStreak: newLongestStreak,
            chaptersStarted,
            chaptersMastered,
            lastActive: new Date().toISOString(),
            badges: prev.badges,
            chapterProgress: newChapterProgress,
          },
          prev.badges
        );

        const updated: UserProgress = {
          totalQuestionsAnswered: newTotal,
          totalCorrect: newCorrect,
          overallAccuracy: newAccuracy,
          currentStreak: maxStreak,
          longestStreak: newLongestStreak,
          chaptersStarted,
          chaptersMastered,
          lastActive: new Date().toISOString(),
          badges: earnedBadges,
          chapterProgress: newChapterProgress,
        };

        saveProgress(updated);
        return updated;
      });
    },
    []
  );

  const getChapterMastery = useCallback(
    (bookId: BookId, chapterId: string): ChapterMastery | null => {
      const key = `${bookId}::${chapterId}`;
      return progress.chapterProgress[key] ?? null;
    },
    [progress]
  );

  const getWeakChapters = useCallback((): ChapterMastery[] => {
    return Object.values(progress.chapterProgress)
      .filter((c) => c.accuracy_pct < 70 && c.questions_attempted >= 3)
      .sort((a, b) => a.accuracy_pct - b.accuracy_pct);
  }, [progress]);

  const resetProgress = useCallback(() => {
    const fresh = { ...defaultProgress };
    saveProgress(fresh);
    setProgress(fresh);
  }, []);

  return {
    progress,
    isLoaded,
    updateAfterQuiz,
    getChapterMastery,
    getWeakChapters,
    resetProgress,
  };
}

function checkBadges(progress: UserProgress, existingBadges: Badge[]): Badge[] {
  const earned = [...existingBadges];
  const earnedIds = new Set(earned.map((b) => b.id));

  for (const badge of availableBadges) {
    if (earnedIds.has(badge.id)) continue;

    let shouldEarn = false;
    const { type, value, chapter, book } = badge.requirement;

    switch (type) {
      case "total_questions":
        shouldEarn = progress.totalQuestionsAnswered >= value;
        break;
      case "streak":
        shouldEarn = progress.longestStreak >= value;
        break;
      case "accuracy":
        shouldEarn = progress.overallAccuracy >= value && progress.totalQuestionsAnswered >= 10;
        break;
      case "chapter_mastery":
        if (chapter && book) {
          const key = `${book}::${chapter}`;
          const cm = progress.chapterProgress[key];
          shouldEarn = cm !== undefined && cm.accuracy_pct >= value && cm.questions_attempted >= 5;
        } else {
          shouldEarn = progress.chaptersMastered >= value;
        }
        break;
    }

    if (shouldEarn) {
      earned.push({ ...badge, earnedAt: new Date().toISOString() });
    }
  }

  return earned;
}

export { availableBadges };
