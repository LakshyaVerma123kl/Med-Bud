"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, BookOpen, Repeat, RotateCcw } from "lucide-react";
import { Question, BookId } from "@/lib/types";
import { TTSButton } from "@/components/ui/TTSButton";
import { getBookById } from "@/lib/data/books";
import { getChapterById } from "@/lib/data/chapters";
import { getQuestionsForChapter, getQuestionsForBook } from "@/lib/data/seed-questions";

interface FlashcardContentProps {
  questions?: Question[];
  bookId: BookId;
  chapterId: string;
}

export function FlashcardContent({ questions: initialQuestions, bookId, chapterId }: FlashcardContentProps) {
  const [dbQuestions, setDbQuestions] = useState<Question[]>(initialQuestions || []);
  const [loading, setLoading] = useState(!initialQuestions || initialQuestions.length === 0);
  
  // Fetch logic
  useEffect(() => {
    if (initialQuestions && initialQuestions.length > 0) return;

    async function fetchQuestions() {
      try {
        setLoading(true);
        const url = chapterId 
          ? `/api/questions?chapter=${chapterId}` 
          : `/api/questions?book=${bookId}`;
          
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed");
        
        const data = await res.json();
        if (data.questions && data.questions.length > 0) {
          setDbQuestions(data.questions);
        } else {
          setDbQuestions(chapterId ? getQuestionsForChapter(chapterId) : getQuestionsForBook(bookId));
        }
      } catch (err) {
        setDbQuestions(chapterId ? getQuestionsForChapter(chapterId) : getQuestionsForBook(bookId));
      } finally {
        setLoading(false);
      }
    }
    fetchQuestions();
  }, [bookId, chapterId, initialQuestions]);

  const questions = dbQuestions;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const book = getBookById(bookId);
  const chapter = getChapterById(chapterId);

  const currentQuestion = questions[currentIndex];
  const progressPercent = ((currentIndex + 1) / questions.length) * 100;

  const nextCard = () => {
    setIsFlipped(false);
    if (currentIndex < questions.length - 1) {
      setTimeout(() => setCurrentIndex(prev => prev + 1), 150);
    }
  };

  const prevCard = () => {
    setIsFlipped(false);
    if (currentIndex > 0) {
      setTimeout(() => setCurrentIndex(prev => prev - 1), 150);
    }
  };

  const restart = () => {
    setIsFlipped(false);
    setCurrentIndex(0);
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <p className="text-muted-foreground text-lg">No questions available for flashcards.</p>
      </div>
    );
  }

  // End screen
  if (currentIndex === questions.length - 1 && isFlipped) {
    // Add a slight delay before showing the end screen or just keep the last card?
    // Let's just add an end screen option.
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/40">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href={`/book/${bookId}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to {book?.title}</span>
          </Link>
          <div className="flex flex-col items-end">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Flashcard Mode</span>
            <span className="text-sm font-medium text-foreground">{chapter?.name}</span>
          </div>
        </div>
        {/* Progress Bar */}
        <div className="h-1 bg-muted w-full">
          <div
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </header>

      {/* Main Flashcard Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-3xl perspective-1000">
          
          <div className="mb-6 flex items-center justify-between">
            <span className="text-sm font-bold text-muted-foreground">
              Card {currentIndex + 1} of {questions.length}
            </span>
            <div className="flex items-center gap-2">
              <TTSButton text={isFlipped ? currentQuestion.explanation : currentQuestion.question} />
            </div>
          </div>

          <motion.div
            className="relative w-full min-h-[400px] cursor-pointer"
            onClick={() => setIsFlipped(!isFlipped)}
            initial={false}
            animate={{ rotateX: isFlipped ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* FRONT OF CARD */}
            <div
              className={`absolute inset-0 w-full h-full clean-card rounded-3xl p-8 sm:p-12 flex flex-col justify-center backface-hidden ${
                isFlipped ? "pointer-events-none" : ""
              }`}
              style={{ backfaceVisibility: "hidden" }}
            >
              <div className="absolute top-6 left-6 flex items-center gap-2 text-primary/80">
                <BookOpen className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-widest">Question</span>
              </div>
              
              {currentQuestion.image_url && (
                <div className="w-full max-h-48 flex justify-center mb-6 mt-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={currentQuestion.image_url} alt="Question figure" className="max-h-48 object-contain rounded-xl border border-border/50 shadow-sm" />
                </div>
              )}

              <h2 className="text-2xl sm:text-3xl font-bold text-foreground leading-snug text-center mt-4">
                {currentQuestion.question}
              </h2>
              
              <div className="mt-auto pt-8 text-center animate-pulse text-muted-foreground/50 text-sm font-medium">
                Click anywhere to flip
              </div>
            </div>

            {/* BACK OF CARD */}
            <div
              className={`absolute inset-0 w-full h-full clean-card rounded-3xl p-8 sm:p-12 flex flex-col backface-hidden`}
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateX(180deg)",
              }}
            >
              <div className="absolute top-6 left-6 flex items-center gap-2 text-emerald-500/80">
                <Repeat className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-widest">Answer</span>
              </div>

              <div className="flex-1 flex flex-col justify-center overflow-y-auto mt-6 pb-6 custom-scrollbar">
                <h3 className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400 text-center mb-6">
                  {currentQuestion.options[currentQuestion.correct_index]}
                </h3>

                <div className="w-full h-px bg-border/50 my-4" />

                <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none text-foreground/90">
                  <p className="font-semibold text-primary mb-2">Explanation:</p>
                  <p className="leading-relaxed">{currentQuestion.explanation}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Controls */}
        <div className="w-full max-w-3xl mt-12 flex items-center justify-between gap-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevCard();
            }}
            disabled={currentIndex === 0}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-card border border-border text-foreground font-bold hover:bg-muted transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          >
            <ArrowLeft className="w-5 h-5" />
            Previous
          </button>
          
          <div className="hidden sm:flex gap-2">
            <button
              onClick={restart}
              className="p-4 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
              title="Restart Deck"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              nextCard();
            }}
            disabled={currentIndex === questions.length - 1}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-all active:scale-95 shadow-md disabled:opacity-50 disabled:pointer-events-none"
          >
            Next
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </main>
    </div>
  );
}
