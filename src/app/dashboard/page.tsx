"use client";

import Link from "next/link";
import {
  Trophy, Target, Flame, BookOpen, TrendingUp, Award,
  BarChart3, ArrowRight, Clock, Star, AlertCircle
} from "lucide-react";
import { useProgress, availableBadges } from "@/hooks/useProgress";
import { ProgressRing } from "@/components/quiz/ProgressRing";
import { getChapterById } from "@/lib/data/chapters";
import { getBookById } from "@/lib/data/books";

export default function DashboardPage() {
  const { progress, isLoaded, getWeakChapters } = useProgress();
  const weakChapters = isLoaded ? getWeakChapters() : [];

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const hasActivity = progress.totalQuestionsAnswered > 0;
  const chapterEntries = Object.entries(progress.chapterProgress);

  return (
    <div className="min-h-screen bg-background text-foreground py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-1">
            Performance Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Track chapter mastery, identify weak topics, and monitor your streaks.
          </p>
        </div>

        {!hasActivity ? (
          /* Empty State */
          <div className="clean-card rounded-3xl p-10 sm:p-16 text-center max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">No Quiz Attempts Yet</h2>
            <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
              Complete your first chapter quiz in Forensic Medicine or Community Medicine to populate your personalized analytics.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-all shadow-md"
            >
              Start Your First Quiz
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          /* Active Dashboard */
          <div className="space-y-8">
            {/* Top 4 Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                {
                  label: "Questions Answered",
                  value: progress.totalQuestionsAnswered,
                  icon: Target,
                  color: "text-blue-500",
                  bg: "bg-blue-500/10",
                },
                {
                  label: "Overall Accuracy",
                  value: `${progress.overallAccuracy}%`,
                  icon: TrendingUp,
                  color: "text-emerald-500",
                  bg: "bg-emerald-500/10",
                },
                {
                  label: "Longest Streak",
                  value: progress.longestStreak,
                  icon: Flame,
                  color: "text-amber-500",
                  bg: "bg-amber-500/10",
                },
                {
                  label: "Chapters Mastered",
                  value: progress.chaptersMastered,
                  icon: Trophy,
                  color: "text-purple-500",
                  bg: "bg-purple-500/10",
                },
              ].map((stat) => (
                <div key={stat.label} className="clean-card rounded-2xl p-5">
                  <div className={`w-9 h-9 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-3`}>
                    <stat.icon className="w-4 h-4" />
                  </div>
                  <span className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                    {stat.value}
                  </span>
                  <p className="text-xs font-medium text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left 2 Cols: Chapter Progress Table */}
              <div className="lg:col-span-2 clean-card rounded-3xl p-6 sm:p-7">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    Chapter Mastery
                  </h2>
                  <span className="text-xs text-muted-foreground font-medium">
                    {chapterEntries.length} chapters attempted
                  </span>
                </div>

                <div className="space-y-3">
                  {chapterEntries.map(([key, mastery]) => {
                    const chapter = getChapterById(mastery.chapter);
                    const book = getBookById(mastery.book);
                    return (
                      <div
                        key={key}
                        className="flex items-center gap-4 p-4 rounded-xl border border-border/80 hover:border-primary/40 transition-colors"
                      >
                        <ProgressRing progress={mastery.accuracy_pct} size={48} strokeWidth={4} />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-foreground truncate">
                            {chapter?.name || mastery.chapter}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {book?.subject || mastery.book} • {mastery.questions_attempted} Qs attempted
                          </p>
                        </div>
                        <Link
                          href={`/quiz?book=${mastery.book}&chapter=${mastery.chapter}`}
                          className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-semibold hover:bg-primary hover:text-white transition-colors"
                        >
                          Revise
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Col: Weak Areas + Badges */}
              <div className="space-y-6">
                {/* Weak Areas */}
                {weakChapters.length > 0 && (
                  <div className="clean-card rounded-3xl p-6 border-rose-200 dark:border-rose-950/60">
                    <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-4">
                      <AlertCircle className="w-4 h-4 text-rose-500" />
                      Priority Revision Areas
                    </h3>
                    <div className="space-y-2.5">
                      {weakChapters.slice(0, 4).map((wc) => {
                        const ch = getChapterById(wc.chapter);
                        return (
                          <Link
                            key={`${wc.book}::${wc.chapter}`}
                            href={`/quiz?book=${wc.book}&chapter=${wc.chapter}`}
                            className="flex items-center justify-between p-3 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 text-xs hover:border-rose-400 transition-colors"
                          >
                            <div className="min-w-0 pr-2">
                              <p className="font-semibold text-rose-950 dark:text-rose-200 truncate">
                                {ch?.name || wc.chapter}
                              </p>
                              <span className="text-rose-600 dark:text-rose-400 font-bold">
                                {wc.accuracy_pct}% Accuracy
                              </span>
                            </div>
                            <ArrowRight className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Badges Grid */}
                <div className="clean-card rounded-3xl p-6">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2 mb-4">
                    <Award className="w-4 h-4 text-amber-500" />
                    Milestone Badges
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {availableBadges.map((badge) => {
                      const isEarned = progress.badges.some((b) => b.id === badge.id);
                      return (
                        <div
                          key={badge.id}
                          className={`flex flex-col items-center p-3 rounded-xl text-center border transition-all ${
                            isEarned
                              ? "bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200"
                              : "bg-muted/30 border-border opacity-40 grayscale"
                          }`}
                          title={badge.description}
                        >
                          <span className="text-2xl mb-1">{badge.icon}</span>
                          <span className="text-[10px] font-bold leading-tight">{badge.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
