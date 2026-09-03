"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, ArrowLeft, BookOpen, Brain, ChevronRight, CheckCircle2 } from "lucide-react";
import { getChaptersForBook } from "@/lib/data/chapters";
import { getBookById } from "@/lib/data/books";
import { getQuestionsForChapter } from "@/lib/data/seed-questions";
import { useProgress } from "@/hooks/useProgress";
import { ProgressRing } from "@/components/quiz/ProgressRing";
import { BookId } from "@/lib/types";

export default function BookPage({ params }: PageProps<"/book/[bookId]">) {
  const { bookId } = use(params);
  const book = getBookById(bookId);
  const chapters = getChaptersForBook(bookId as BookId);
  const [search, setSearch] = useState("");
  const { getChapterMastery, isLoaded } = useProgress();
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    async function fetchCounts() {
      const { supabase } = await import("@/lib/supabase");
      const { data } = await supabase
        .from("questions")
        .select("chapter")
        .eq("book", bookId)
        .eq("verified", true);
        
      if (data) {
        const newCounts = data.reduce((acc: Record<string, number>, curr) => {
          acc[curr.chapter] = (acc[curr.chapter] || 0) + 1;
          return acc;
        }, {});
        setCounts(newCounts);
      }
    }
    fetchCounts();
  }, [bookId]);

  if (!book) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="clean-card rounded-2xl p-8 max-w-sm text-center">
          <h1 className="text-xl font-bold text-foreground mb-2">Book Not Found</h1>
          <Link href="/" className="text-primary text-sm font-semibold hover:underline">
            ← Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const isReddy = book.id === "narayan_reddy";

  const filtered = chapters.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.description?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header Band */}
      <div
        className={`sticky top-16 z-40 border-b px-4 sm:px-6 lg:px-8 shadow-sm transition-all duration-300 ${
          isScrolled ? "py-3 sm:py-4" : "py-8 sm:py-12"
        } ${
          isReddy
            ? "bg-gradient-to-r from-blue-950/95 via-slate-900/95 to-indigo-950/95 text-white border-blue-900/40 backdrop-blur-xl"
            : "bg-gradient-to-r from-teal-950/95 via-slate-900/95 to-emerald-950/95 text-white border-teal-900/40 backdrop-blur-xl"
        }`}
      >
        <div className="max-w-5xl mx-auto">
          {!isScrolled && (
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white/70 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>All Textbooks</span>
            </Link>
          )}

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
              <span className={`shrink-0 transition-all duration-300 ${isScrolled ? "text-2xl sm:text-3xl" : "text-4xl sm:text-5xl"}`}>
                {book.icon}
              </span>
              <div className="min-w-0">
                {!isScrolled && (
                  <span className="inline-block text-xs font-bold uppercase tracking-wider text-white/60 mb-1">
                    Standard Medical Reference
                  </span>
                )}
                <h1 className={`font-extrabold tracking-tight text-white transition-all duration-300 truncate ${
                  isScrolled ? "text-lg sm:text-xl" : "text-3xl sm:text-4xl mb-1"
                }`}>
                  {book.subject}
                </h1>
                {!isScrolled && (
                  <p className="text-white/80 text-sm font-medium truncate">{book.author}</p>
                )}
              </div>
            </div>

            <div className={`flex items-center gap-2 sm:gap-3 shrink-0 transition-all duration-300 ${isScrolled ? "scale-90 origin-right" : "scale-100"}`}>
              <div className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 text-center">
                <span className="block text-base sm:text-xl font-bold text-white leading-none mb-0.5">{chapters.length}</span>
                <span className="text-[9px] sm:text-[10px] uppercase font-semibold text-white/70">Ch</span>
              </div>
              <div className="hidden sm:block px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 text-center">
                <span className="block text-base sm:text-xl font-bold text-white leading-none mb-0.5">{book.totalQuestions}+</span>
                <span className="text-[9px] sm:text-[10px] uppercase font-semibold text-white/70">Qs</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 w-full flex-1">
        {/* Search Input Bar */}
        <div className="relative max-w-lg mb-8">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search chapters or topics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
          />
        </div>

        {/* Chapters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5 sm:gap-6">
          {filtered.map((chapter, idx) => {
            const chapterQuestions = getQuestionsForChapter(chapter.id);
            const liveCount = counts[chapter.id];
            const displayCount = liveCount !== undefined ? liveCount : chapterQuestions.length;
            
            const mastery = isLoaded ? getChapterMastery(bookId as BookId, chapter.id) : null;
            const accuracy = mastery?.accuracy_pct ?? 0;
            const attempted = mastery?.questions_attempted ?? 0;
            
            // Just for UI display, if < 25, we show that they can generate more
            const hasEnoughQuestions = displayCount >= 25;

            return (
              <div
                key={chapter.id}
                className="clean-card rounded-2xl p-5 hover:border-primary/50 transition-all hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-primary px-2 py-0.5 rounded-md bg-primary/10">
                      Ch {String(idx + 1).padStart(2, "0")}
                    </span>

                    {attempted > 0 ? (
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {accuracy}% accuracy
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold text-muted-foreground">
                        Not attempted
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors mb-1.5 leading-snug">
                    {chapter.name}
                  </h3>

                  {chapter.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-4">
                      {chapter.description}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-between mt-auto">
                  <span className="text-xs font-medium text-muted-foreground">
                    <strong className="text-foreground">{displayCount}</strong> questions available
                  </span>
                  
                  <div className="flex gap-2">
                    {!hasEnoughQuestions && (
                      <button
                        onClick={async () => {
                          alert(`Generating 10 more questions for ${chapter.name} via AI... This may take 15-30 seconds.`);
                          try {
                            const res = await fetch("/api/admin/generate", {
                              method: "POST",
                              headers: { "Content-Type": "application/json", "x-admin-key": "super-secret-admin-key-2026" },
                              body: JSON.stringify({ book: bookId, chapter: chapter.id })
                            });
                            if (res.ok) {
                              alert("Questions generated and added to offline bank!");
                              window.location.reload();
                            } else {
                              alert("Failed to generate questions. Check logs.");
                            }
                          } catch (e) {
                            alert("Error generating questions.");
                          }
                        }}
                        className="text-[10px] uppercase font-bold text-amber-500 bg-amber-500/10 hover:bg-amber-500/20 px-2 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                      >
                        <Brain className="w-3 h-3" />
                        Generate AI
                      </button>
                    )}
                    <Link
                      href={`/quiz?book=${bookId}&chapter=${chapter.id}`}
                      className="text-xs font-semibold text-white bg-primary hover:bg-primary/90 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors shadow-sm"
                    >
                      Start Quiz
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="clean-card rounded-2xl p-12 text-center max-w-md mx-auto mt-6">
            <Search className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
            <h3 className="text-base font-bold text-foreground">No chapters match your search</h3>
            <p className="text-xs text-muted-foreground mt-1">Try another keyword or clear the search field.</p>
          </div>
        )}
      </div>
    </div>
  );
}
