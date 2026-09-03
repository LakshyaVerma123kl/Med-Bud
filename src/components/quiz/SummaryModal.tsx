import { motion, AnimatePresence } from "framer-motion";
import { X, Brain, Sparkles, BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { BookId } from "@/lib/types";
import ReactMarkdown from "react-markdown";

interface SummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: BookId;
  chapterId: string;
  chapterName: string;
}

export function SummaryModal({ isOpen, onClose, book, chapterId, chapterName }: SummaryModalProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && !summary) {
      setLoading(true);
      setError(null);
      fetch(`/api/summary?book=${book}&chapter=${chapterId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) throw new Error(data.error);
          setSummary(data.summary);
        })
        .catch((err) => {
          setError(err.message || "Failed to load summary");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, book, chapterId, summary]);

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
              className="w-full max-w-2xl max-h-[85vh] bg-background border border-border rounded-3xl shadow-2xl flex flex-col pointer-events-auto overflow-hidden relative"
            >
              {/* Header */}
              <div className="p-5 sm:p-6 border-b border-border flex items-start justify-between bg-card/50">
                <div className="pr-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="p-1.5 rounded-lg bg-primary/10 text-primary">
                      <Brain className="w-4 h-4" />
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">
                      AI Revision Summary
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground leading-tight">
                    {chapterName}
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-muted rounded-full transition-colors shrink-0"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Content area */}
              <div className="p-5 sm:p-8 overflow-y-auto flex-1 relative">
                {loading ? (
                  <div className="flex flex-col items-center justify-center h-48 sm:h-64 space-y-4">
                    <div className="relative w-12 h-12">
                      <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
                      <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                      <Sparkles className="absolute inset-0 m-auto w-4 h-4 text-primary animate-pulse" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground animate-pulse">
                      Synthesizing high-yield concepts...
                    </p>
                  </div>
                ) : error ? (
                  <div className="flex flex-col items-center justify-center h-48 text-center">
                    <p className="text-error font-medium mb-4">{error}</p>
                    <button
                      onClick={() => setSummary(null)} // Retriggers fetch
                      className="px-4 py-2 bg-primary/10 text-primary rounded-xl font-semibold hover:bg-primary/20 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                ) : summary ? (
                  <div className="max-w-none">
                    <ReactMarkdown
                      components={{
                        h3: ({ node, ...props }) => (
                          <h3 className="text-sm font-bold text-primary uppercase tracking-wider mt-8 mb-4 flex items-center gap-2 border-b border-border/50 pb-2" {...props} />
                        ),
                        p: ({ node, ...props }) => (
                          <p className="text-sm sm:text-base text-foreground/80 leading-relaxed mb-4" {...props} />
                        ),
                        ul: ({ node, ...props }) => (
                          <ul className="space-y-3 mb-6" {...props} />
                        ),
                        li: ({ node, ...props }) => (
                          <li className="flex items-start gap-2.5 text-sm sm:text-base text-foreground/80 leading-relaxed">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary/50 mt-2 shrink-0 shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
                            <span className="flex-1">{props.children}</span>
                          </li>
                        ),
                        strong: ({ node, ...props }) => (
                          <strong className="font-semibold text-foreground bg-primary/5 px-1 rounded" {...props} />
                        ),
                      }}
                    >
                      {summary
                        .replace(/\\n/g, "\n")
                        .replace(/^#\s+Revision Summary.*\n?/im, "")
                        .replace(/^##\s+Chapter.*\n?/im, "")
                        .trim()}
                    </ReactMarkdown>
                  </div>
                ) : null}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-border bg-muted/30 text-center flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Generated via MedQuiz AI for rapid revision</span>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
