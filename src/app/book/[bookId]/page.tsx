"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, ArrowLeft, BookOpen, Brain, ChevronRight, CheckCircle2, FileText, Repeat, ArrowRight } from "lucide-react";
import { getChaptersForBook } from "@/lib/data/chapters";
import { getBookById } from "@/lib/data/books";
import { getQuestionsForChapter } from "@/lib/data/seed-questions";
import { useProgress } from "@/hooks/useProgress";
import { ProgressRing } from "@/components/quiz/ProgressRing";
import { BookId } from "@/lib/types";
import { SummaryModal } from "@/components/quiz/SummaryModal";
import { NotesModal } from "@/components/quiz/NotesModal";

export default function BookPage({ params }: PageProps<"/book/[bookId]">) {
  const { bookId } = use(params);
  const book = getBookById(bookId);
  const chapters = getChaptersForBook(bookId as BookId);
  const [search, setSearch] = useState("");
  const { getChapterMastery, isLoaded } = useProgress();
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSummaryChapter, setActiveSummaryChapter] = useState<{ id: string, name: string } | null>(null);
  const [activeNotesChapter, setActiveNotesChapter] = useState<{ id: string, name: string } | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    async function fetchCounts() {
      try {
        const res = await fetch(`/api/questions?book=${bookId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.questions) {
            const newCounts = data.questions.reduce((acc: Record<string, number>, curr: any) => {
              acc[curr.chapter] = (acc[curr.chapter] || 0) + 1;
              return acc;
            }, {});
            setCounts(newCounts);
          }
        }
      } catch (err) {
        console.error("Failed to fetch accurate counts", err);
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
        className={`sticky top-16 z-40 border-b px-4 sm:px-6 lg:px-8 shadow-sm transition-all duration-300 ${isScrolled ? "py-3 sm:py-4" : "py-8 sm:py-12"
          } ${isReddy
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
                <h1 className={`font-extrabold tracking-tight text-white transition-all duration-300 truncate ${isScrolled ? "text-lg sm:text-xl" : "text-3xl sm:text-4xl mb-1"
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
                <span className="block text-base sm:text-xl font-bold text-white leading-none mb-0.5">
                  {Object.keys(counts).length > 0
                    ? Object.values(counts).reduce((a, b) => a + b, 0)
                    : book.totalQuestions}+
                </span>
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

        {/* Chapters List */}
        <div className="flex flex-col border-t border-border">
          {filtered.map((chapter, idx) => {
            const chapterQuestions = getQuestionsForChapter(chapter.id);
            const liveCount = counts[chapter.id];
            const displayCount = liveCount !== undefined ? liveCount : chapterQuestions.length;

            const mastery = isLoaded ? getChapterMastery(bookId as BookId, chapter.id) : null;
            const accuracy = mastery?.accuracy_pct ?? 0;
            const attempted = mastery?.questions_attempted ?? 0;

            const hasEnoughQuestions = displayCount >= 25;

            return (
              <div
                key={chapter.id}
                className="group flex flex-col sm:flex-row sm:items-center justify-between py-6 border-b border-border hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-start gap-4 sm:gap-6 mb-4 sm:mb-0">
                  <div className="font-serif font-bold text-muted-foreground text-xl sm:text-2xl mt-0.5 w-8 shrink-0">
                    {String(idx + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-serif font-bold text-foreground group-hover:text-primary transition-colors leading-snug mb-1">
                      {chapter.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-muted-foreground font-medium">
                      <span>{displayCount} questions</span>
                      {attempted > 0 ? (
                        <>
                          <span className="opacity-50">·</span>
                          <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {accuracy}% mastery
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="opacity-50">·</span>
                          <span>Not attempted</span>
                        </>
                      )}
                      
                      {/* Exports hidden on mobile, shown on desktop hover */}
                      <div className="hidden sm:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                        <span className="opacity-50 mr-1">·</span>
                        <button
                          onClick={async () => {
                            try {
                              const res = await fetch(`/api/questions?chapter=${chapter.id}`);
                              const data = await res.json();
                              if (data.questions && data.questions.length > 0) {
                                const { generateAnkiTSV, downloadFile } = await import("@/lib/export");
                                const tsv = generateAnkiTSV(data.questions);
                                downloadFile(tsv, `${chapter.id}-anki.txt`);
                              } else {
                                alert("No questions found for this chapter.");
                              }
                            } catch (e) {
                              alert("Failed to export questions.");
                            }
                          }}
                          className="p-1 hover:text-primary transition-colors"
                          title="Export to Anki"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                        </button>
                        <Link
                          href={`/print?book=${bookId}&chapter=${chapter.id}`}
                          target="_blank"
                          className="p-1 hover:text-rose-500 transition-colors"
                          title="Export as PDF"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                    {chapter.description && (
                      <p className="text-sm text-muted-foreground mt-2 max-w-xl italic">
                        {chapter.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:gap-3 pl-12 sm:pl-0 shrink-0">
                  {!hasEnoughQuestions && (
                    <button
                      onClick={async () => {
                        try {
                          const res = await fetch("/api/admin/generate", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ book: bookId, chapter: chapter.id }),
                          });
                          if (res.ok) window.location.reload();
                          else alert("Failed to generate questions. Check logs.");
                        } catch (e) { alert("Error generating questions."); }
                      }}
                      className="text-xs font-semibold text-amber-600 border border-amber-600/30 bg-amber-600/5 hover:bg-amber-600/10 px-3 py-1.5 rounded-md transition-colors"
                    >
                      Generate AI
                    </button>
                  )}
                  <button
                    onClick={() => setActiveSummaryChapter({ id: chapter.id, name: chapter.name })}
                    className="text-xs font-semibold text-primary border border-primary/20 bg-primary/5 hover:bg-primary/10 px-3 py-1.5 rounded-md transition-colors"
                  >
                    Summary
                  </button>
                  <button
                    onClick={() => setActiveNotesChapter({ id: chapter.id, name: chapter.name })}
                    className="text-xs font-semibold text-muted-foreground border border-border bg-transparent hover:bg-muted/50 px-3 py-1.5 rounded-md transition-colors"
                  >
                    Notes
                  </button>
                  <Link
                    href={`/quiz?book=${bookId}&chapter=${chapter.id}&mode=flashcard`}
                    className="text-xs font-semibold text-muted-foreground border border-border bg-transparent hover:bg-muted/50 px-3 py-1.5 rounded-md transition-colors"
                  >
                    Flashcards
                  </Link>
                  <Link
                    href={`/quiz?book=${bookId}&chapter=${chapter.id}`}
                    className="text-xs font-bold text-primary-foreground bg-primary hover:bg-primary/90 px-4 py-1.5 rounded-md transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    Start Quiz <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
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

      <SummaryModal
        isOpen={!!activeSummaryChapter}
        onClose={() => setActiveSummaryChapter(null)}
        book={bookId as BookId}
        chapterId={activeSummaryChapter?.id || ""}
        chapterName={activeSummaryChapter?.name || ""}
      />

      <NotesModal
        isOpen={!!activeNotesChapter}
        onClose={() => setActiveNotesChapter(null)}
        book={bookId as BookId}
        chapterId={activeNotesChapter?.id || ""}
        chapterName={activeNotesChapter?.name || ""}
      />
    </div>
  );
}
