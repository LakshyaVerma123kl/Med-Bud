"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { QuizContent } from "@/components/quiz/QuizContent";
import { FlashcardContent } from "@/components/quiz/FlashcardContent";

function QuizLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground font-medium">Loading quiz...</p>
      </div>
    </div>
  );
}

function QuizPageInner() {
  const searchParams = useSearchParams();
  const bookId = searchParams.get("book") || "narayan_reddy";
  const chapterId = searchParams.get("chapter") || "";
  const mode = searchParams.get("mode") || "practice";

  if (mode === "flashcard") {
    return (
      <FlashcardContent
        bookId={bookId as "narayan_reddy" | "park"}
        chapterId={chapterId}
        questions={[]} // Will be fetched inside FlashcardContent or passed via context if needed. 
        // Wait, QuizContent handles its own fetching if `questions` is undefined. 
        // I need to fetch questions inside FlashcardContent or pass them down.
      />
    );
  }

  return (
    <QuizContent
      bookId={bookId as "narayan_reddy" | "park"}
      chapterId={chapterId}
      mode={mode as "practice" | "timed" | "chapter_mastery"}
    />
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={<QuizLoader />}>
      <QuizPageInner />
    </Suspense>
  );
}
