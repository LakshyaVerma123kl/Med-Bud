"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, PenLine, BookOpen, ArrowRight, Play, Sparkles, Filter } from "lucide-react";
import { useCustomQuestions } from "@/hooks/useCustomQuestions";
import { QuizContent } from "@/components/quiz/QuizContent";

export default function CustomQuizPage() {
  const { questions, isLoaded } = useCustomQuestions();
  const [isStarted, setIsStarted] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");

  // Extract distinct topics
  const uniqueTopics = useMemo(() => {
    const set = new Set<string>();
    questions.forEach((q) => {
      if (q.topic && q.topic.trim()) set.add(q.topic.trim());
    });
    return Array.from(set);
  }, [questions]);

  // Filter questions based on selections
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      if (selectedTopic !== "all" && q.topic?.trim() !== selectedTopic) {
        return false;
      }
      if (selectedDifficulty !== "all" && q.difficulty !== selectedDifficulty) {
        return false;
      }
      return true;
    });
  }, [questions, selectedTopic, selectedDifficulty]);

  // Stable shuffle when started
  const activeQuestions = useMemo(() => {
    return [...filteredQuestions].sort(() => Math.random() - 0.5);
  }, [filteredQuestions, isStarted]); // Re-shuffles when quiz is started

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Empty state (0 questions created yet)
  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="clean-card rounded-3xl p-10 sm:p-16 text-center max-w-md w-full">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6">
            <PenLine className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">No Custom Questions</h2>
          <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
            Create your own MCQs from class notes or college exams, then test yourself here.
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

  // Less than 2 questions overall
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
            You currently have {questions.length} custom question. Add at least one more to start a custom quiz!
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

  // Active quiz view
  if (isStarted && activeQuestions.length > 0) {
    return (
      <QuizContent
        bookId="narayan_reddy"
        chapterId="custom"
        mode="practice"
        questions={activeQuestions}
      />
    );
  }

  // Pre-quiz setup / filter lobby screen
  return (
    <div className="min-h-screen bg-background text-foreground py-10 px-4 sm:px-6 flex flex-col items-center justify-center">
      <div className="max-w-lg w-full">
        {/* Navigation back */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            href="/create"
            className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
            title="Back to Question Bank"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Custom Quiz Setup
            </h1>
            <p className="text-xs text-muted-foreground">
              Filter by topic or difficulty from your {questions.length} custom questions
            </p>
          </div>
        </div>

        {/* Setup Card */}
        <div className="clean-card rounded-3xl p-6 sm:p-8 space-y-6">
          {/* Topic Filter */}
          {uniqueTopics.length > 0 && (
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2.5 flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-primary" />
                Select Topic
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedTopic("all")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedTopic === "all"
                      ? "bg-primary text-white shadow-sm"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  All Topics ({questions.length})
                </button>
                {uniqueTopics.map((topic) => {
                  const count = questions.filter((q) => q.topic?.trim() === topic).length;
                  return (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => setSelectedTopic(topic)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        selectedTopic === topic
                          ? "bg-primary text-white shadow-sm"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {topic} ({count})
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Difficulty Filter */}
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2.5">
              Difficulty
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(["all", "easy", "medium", "hard"] as const).map((diff) => {
                const isSelected = selectedDifficulty === diff;
                return (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold capitalize text-center transition-all ${
                      isSelected
                        ? "bg-primary text-white shadow-sm"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {diff}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Questions Matching Counter */}
          <div className="p-4 rounded-2xl bg-muted/30 border border-border flex items-center justify-between">
            <div>
              <span className="text-xs text-muted-foreground block">Questions Selected</span>
              <span className="text-lg font-bold text-foreground">
                {filteredQuestions.length} {filteredQuestions.length === 1 ? "Question" : "Questions"}
              </span>
            </div>
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                filteredQuestions.length > 0
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "bg-rose-500/10 text-rose-500"
              }`}
            >
              {filteredQuestions.length > 0 ? "Ready" : "None match"}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <button
              onClick={() => setIsStarted(true)}
              disabled={filteredQuestions.length === 0}
              className="w-full py-3.5 px-4 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              <Play className="w-4 h-4 fill-white" />
              Start Custom Quiz ({filteredQuestions.length})
            </button>

            <Link
              href="/create"
              className="w-full py-2.5 px-4 rounded-xl border border-border text-muted-foreground hover:text-foreground text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <PenLine className="w-3.5 h-3.5" />
              Manage / Add Questions
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
