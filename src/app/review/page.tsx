"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, Sparkles } from "lucide-react";
import { useSpacedRepetition } from "@/hooks/useSpacedRepetition";
import { Question } from "@/lib/types";
import { QuizContent } from "@/components/quiz/QuizContent";

export default function ReviewPage() {
  const { getDueItems, isLoaded: srLoaded } = useSpacedRepetition();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!srLoaded) return;

    const dueItems = getDueItems();
    if (dueItems.length === 0) {
      setLoading(false);
      return;
    }

    const dueIds = dueItems.map((item) => item.id);

    async function fetchQuestions() {
      try {
        const res = await fetch("/api/questions/ids", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: dueIds }),
        });
        if (res.ok) {
          const data = await res.json();
          // Shuffle them so review is not strictly in order
          const fetched = data.questions || [];
          fetched.sort(() => Math.random() - 0.5);
          setQuestions(fetched);
        }
      } catch (err) {
        console.error("Failed to fetch review questions", err);
      } finally {
        setLoading(false);
      }
    }
    fetchQuestions();
  }, [srLoaded, getDueItems]);

  if (!srLoaded || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <Sparkles className="w-8 h-8 text-amber-500 mb-4 animate-spin-slow" />
          <p className="text-muted-foreground font-medium">Loading your daily review...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-8 flex flex-col items-center justify-center">
        <div className="clean-card rounded-3xl p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-emerald-500" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">All Caught Up!</h1>
          <p className="text-muted-foreground mb-6">
            You have no pending questions for review right now. Go learn a new chapter or take a mock exam!
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/dashboard"
            className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Clock className="w-6 h-6 text-amber-500" />
              Daily Review
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {questions.length} questions mathematically scheduled for you today.
            </p>
          </div>
        </div>

        <div className="bg-background">
          <QuizContent
            bookId="narayan_reddy" 
            chapterId="review"
            mode="practice"
            questions={questions}
          />
        </div>
      </div>
    </div>
  );
}
