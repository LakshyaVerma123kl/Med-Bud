"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, Sparkles, Download } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { BookId } from "@/lib/types";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";

import { TTSButton } from "@/components/ui/TTSButton";
import { downloadMarkdown } from "@/lib/export";

interface NotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: BookId;
  chapterId: string;
  chapterName: string;
}

export function NotesModal({ isOpen, onClose, book, chapterId, chapterName }: NotesModalProps) {
  const [notes, setNotes] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Reset when chapter changes
  useEffect(() => {
    setNotes(null);
    setError(null);
  }, [chapterId, book]);

  useEffect(() => {
    if (isOpen && !notes) {
      setLoading(true);
      setError(null);
      fetch(`/api/notes?book=${book}&chapter=${chapterId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) throw new Error(data.error);
          setNotes(data.notes);
        })
        .catch((err) => {
          setError(err.message || "Failed to load notes");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, book, chapterId, notes]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          <div className="fixed inset-0 flex items-center justify-center p-4 z-[101] pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-3xl max-h-[90vh] bg-background border border-border rounded-3xl shadow-2xl flex flex-col pointer-events-auto overflow-hidden relative"
            >
              {/* Header */}
              <div className="p-5 sm:p-6 border-b border-border flex items-start justify-between bg-card/50">
                <div className="pr-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
                      <FileText className="w-4 h-4" />
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-500">
                      Short Notes
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground leading-tight">
                    {chapterName}
                  </h2>
                </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {notes && (
                      <>
                        <button
                          onClick={() => {
                            import("@/lib/export").then(({ generateAnkiTSVFromNote, downloadFile }) => {
                              const tsv = generateAnkiTSVFromNote(`Short Notes: ${chapterName}`, notes);
                              downloadFile(tsv, `${chapterId}_notes_anki.txt`);
                            });
                          }}
                          title="Export to Anki"
                          className="p-1.5 sm:p-2 text-muted-foreground hover:bg-primary/10 hover:text-primary rounded-full transition-colors flex items-center justify-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                        </button>
                        <button
                          onClick={() => window.open(`/print-note?book=${book}&chapter=${chapterId}&type=notes`, "_blank")}
                          title="Export as PDF"
                          className="p-1.5 sm:p-2 text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 rounded-full transition-colors flex items-center justify-center"
                        >
                          <FileText className="w-4.5 h-4.5" />
                        </button>
                        <button
                          onClick={() => downloadMarkdown(notes, `${chapterName} — Short Notes`, `${chapterName.replace(/\s+/g, "_")}_notes.md`)}
                          title="Download Markdown"
                          className="p-1.5 sm:p-2 text-muted-foreground hover:bg-muted hover:text-blue-500 rounded-full transition-colors flex items-center justify-center"
                        >
                          <Download className="w-4.5 h-4.5" />
                        </button>
                        <div className="w-px h-6 bg-border mx-1"></div>
                      </>
                    )}
                    {notes && <TTSButton text={notes} />}
                    <button
                    onClick={onClose}
                    className="p-2 hover:bg-muted rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>
              </div>

              {/* Content area */}
              <div ref={contentRef} className="p-5 sm:p-8 overflow-y-auto flex-1 relative">
                {loading ? (
                  <div className="flex flex-col items-center justify-center h-48 sm:h-64 space-y-4">
                    <div className="relative w-12 h-12">
                      <div className="absolute inset-0 rounded-full border-4 border-blue-500/20"></div>
                      <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
                      <Sparkles className="absolute inset-0 m-auto w-4 h-4 text-blue-500 animate-pulse" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground animate-pulse">
                      Generating comprehensive study notes...
                    </p>
                    <p className="text-xs text-muted-foreground/60">
                      This may take 15-30 seconds for detailed content
                    </p>
                  </div>
                ) : error ? (
                  <div className="flex flex-col items-center justify-center h-48 text-center">
                    <p className="text-red-500 font-medium mb-4">{error}</p>
                    <button
                      onClick={() => setNotes(null)}
                      className="px-4 py-2 bg-blue-500/10 text-blue-500 rounded-xl font-semibold hover:bg-blue-500/20 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                ) : notes ? (
                  <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none
                    prose-headings:text-foreground prose-headings:font-bold
                    prose-h2:text-lg prose-h2:text-blue-500 prose-h2:border-b prose-h2:border-border/50 prose-h2:pb-2 prose-h2:mt-8 prose-h2:mb-4
                    prose-h3:text-base prose-h3:text-foreground prose-h3:mt-6 prose-h3:mb-3
                    prose-p:leading-relaxed prose-p:text-foreground/80
                    prose-li:text-foreground/80 prose-li:my-1
                    prose-strong:text-foreground prose-strong:font-semibold
                    prose-table:text-sm prose-th:bg-muted/50 prose-th:px-3 prose-th:py-2 prose-td:px-3 prose-td:py-2
                    prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs
                  ">
                    <ReactMarkdown
                      remarkPlugins={[remarkMath, remarkGfm]}
                      rehypePlugins={[rehypeKatex]}
                    >
                      {notes}
                    </ReactMarkdown>
                  </div>
                ) : null}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-border bg-muted/30 text-center flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <FileText className="w-3.5 h-3.5" />
                <span>AI-generated short notes for rapid revision</span>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
