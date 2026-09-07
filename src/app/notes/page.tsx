"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, StickyNote, Search, Trash2, ArrowRight, BookOpen } from "lucide-react";
import { useNotes } from "@/hooks/useNotes";
import { useCustomQuestions } from "@/hooks/useCustomQuestions";
import { getChapterById } from "@/lib/data/chapters";
import { getBookById } from "@/lib/data/books";
import { seedQuestions } from "@/lib/data/seed-questions";
import { Question } from "@/lib/types";

export default function NotesPage() {
  const { getAllNotes, deleteNote, isLoaded } = useNotes();
  const { questions: customQuestions } = useCustomQuestions();
  const [search, setSearch] = useState("");

  // Build a lookup of question IDs → question objects from seed data + user's custom questions
  const questionMap = useMemo(() => {
    const map: Record<string, Question> = {};
    seedQuestions.forEach((q) => {
      map[q.id] = q;
    });
    customQuestions.forEach((q) => {
      map[q.id] = q;
    });
    return map;
  }, [customQuestions]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const allNotes = getAllNotes();

  const filteredNotes = search.trim()
    ? allNotes.filter((note) => {
        const q = questionMap[note.questionId];
        const haystack = [
          note.text,
          q?.question || "",
          q?.topic || "",
          q?.chapter || "",
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(search.toLowerCase());
      })
    : allNotes;

  // Group by chapter
  const grouped: Record<string, typeof filteredNotes> = {};
  filteredNotes.forEach((note) => {
    const q = questionMap[note.questionId];
    const chapterId = q?.chapter || "unknown";
    const chapter = getChapterById(chapterId);
    const label = chapter?.name || chapterId;
    if (!grouped[label]) grouped[label] = [];
    grouped[label].push(note);
  });

  return (
    <div className="min-h-screen bg-background text-foreground py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link
            href="/dashboard"
            className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground flex items-center gap-2">
              <StickyNote className="w-6 h-6 text-amber-500" />
              My Notes
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {allNotes.length} note{allNotes.length !== 1 ? "s" : ""} across your quiz sessions
            </p>
          </div>
        </div>

        {/* Search */}
        {allNotes.length > 0 && (
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notes, questions, or topics..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none transition-all"
            />
          </div>
        )}

        {/* Empty State */}
        {allNotes.length === 0 && (
          <div className="clean-card rounded-3xl p-10 sm:p-16 text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto mb-6">
              <StickyNote className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">No Notes Yet</h2>
            <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
              During a quiz, tap the 📝 icon on any question to add personal notes, mnemonics, or key observations.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-all shadow-md"
            >
              <BookOpen className="w-4 h-4" />
              Start a Quiz
            </Link>
          </div>
        )}

        {/* Notes by Chapter */}
        {Object.entries(grouped).map(([chapterName, notes]) => (
          <div key={chapterName} className="mb-8">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5" />
              {chapterName}
            </h2>
            <div className="space-y-3">
              {notes.map((note) => {
                const q = questionMap[note.questionId];
                const book = q ? getBookById(q.book) : null;
                return (
                  <div
                    key={note.questionId}
                    className="clean-card rounded-2xl p-5 border-l-4 border-l-amber-500/50"
                  >
                    {/* Question preview */}
                    {q && (
                      <p className="text-sm font-semibold text-foreground mb-2 line-clamp-2 leading-snug">
                        {q.question}
                      </p>
                    )}

                    {/* Note text */}
                    <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/15 text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap mb-3">
                      {note.text}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground font-medium">
                        {new Date(note.updatedAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                        {book && ` • ${book.subject}`}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            if (confirm("Delete this note?")) {
                              deleteNote(note.questionId);
                            }
                          }}
                          className="p-1.5 rounded-md hover:bg-error/10 text-muted-foreground hover:text-error transition-colors"
                          title="Delete note"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        {q && (
                          <Link
                            href={`/quiz?book=${q.book}&chapter=${q.chapter}`}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                          >
                            Practice
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* No results */}
        {filteredNotes.length === 0 && allNotes.length > 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-muted-foreground">
              No notes match &ldquo;{search}&rdquo;
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
