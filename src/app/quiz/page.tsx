"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { QuizContent } from "@/components/quiz/QuizContent";

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
