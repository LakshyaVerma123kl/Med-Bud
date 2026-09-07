"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, PenLine, BookOpen, ArrowRight } from "lucide-react";
import { useCustomQuestions } from "@/hooks/useCustomQuestions";
import { QuizContent } from "@/components/quiz/QuizContent";

export default function CustomQuizPage() {
  const { questions, isLoaded } = useCustomQuestions();

  const shuffled = useMemo(() => {
    return [...questions].sort(() => Math.random() - 0.5);
  }, [questions]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Empty state
  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="clean-card rounded-3xl p-10 sm:p-16 text-center max-w-md w-full">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6">
            <PenLine className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">No Custom Questions</h2>
          <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
            Create your own MCQs first, then come back here to quiz yourself on them.
          </p>
          <Link
            href="/create"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-all shadow-md"
          >
            <PenLine className="w-4 h-4" />
            Create Questions
          </Link>
        </div>
      </div>
    );
  }

  // Too few for a quiz
  if (questions.length < 2) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="clean-card rounded-3xl p-10 text-center max-w-md w-full">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">
            You need at least 2 questions
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            You currently have {questions.length} custom question. Add one more to start a quiz!
          </p>
          <Link
            href="/create"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-all shadow-md"
          >
            Create More
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <QuizContent
      bookId="narayan_reddy"
      chapterId="custom"
      mode="practice"
      questions={shuffled}
    />
  );
}
