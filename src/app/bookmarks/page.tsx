"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bookmark, Sparkles } from "lucide-react";
import { useBookmarks } from "@/hooks/useBookmarks";
import { Question } from "@/lib/types";
import { QuizContent } from "@/components/quiz/QuizContent";

export default function BookmarksPage() {
  const { bookmarkedIds, isLoaded: bookmarksLoaded } = useBookmarks();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bookmarksLoaded) return;

    if (bookmarkedIds.length === 0) {
      setLoading(false);
      return;
    }

    async function fetchQuestions() {
      try {
        const res = await fetch("/api/questions/ids", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: bookmarkedIds }),
        });
        if (res.ok) {
          const data = await res.json();
          setQuestions(data.questions || []);
        }
      } catch (err) {
        console.error("Failed to fetch bookmarked questions", err);
      } finally {
        setLoading(false);
      }
    }
    fetchQuestions();
  }, [bookmarksLoaded, bookmarkedIds.length]);

  if (!bookmarksLoaded || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <Sparkles className="w-8 h-8 text-blue-500 mb-4 animate-spin-slow" />
          <p className="text-muted-foreground font-medium">Loading bookmarks...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-8 flex flex-col items-center justify-center">
        <div className="clean-card rounded-3xl p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Bookmark className="w-8 h-8 text-blue-500" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">No Bookmarks Yet</h1>
          <p className="text-muted-foreground mb-6">
            When you're taking a quiz, click the bookmark icon on any question to save it here for quick review later.
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
              <Bookmark className="w-6 h-6 text-blue-500" />
              Bookmarked Questions
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Review your {questions.length} saved high-yield questions.
            </p>
          </div>
        </div>

        {/* We reuse QuizContent in practice mode but with arbitrary questions */}
        <div className="bg-background">
          <QuizContent
            bookId="narayan_reddy" // Dummy ids just to satisfy props
            chapterId="bookmarks"
            mode="practice"
            questions={questions}
          />
        </div>
      </div>
    </div>
  );
}
