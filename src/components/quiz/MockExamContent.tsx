"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
  Lightbulb,
  RotateCcw,
  BarChart3,
  ListTodo
} from "lucide-react";
import { Question } from "@/lib/types";

interface MockExamContentProps {
  questions: Question[];
  durationMinutes: number;
}

export function MockExamContent({ questions, durationMinutes }: MockExamContentProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [viewState, setViewState] = useState<"exam" | "grid" | "results">("exam");

  // Timer logic
  useEffect(() => {
    if (isSubmitted || timeLeft <= 0) {
      if (timeLeft <= 0 && !isSubmitted) {
        handleSubmit();
      }
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, isSubmitted]);

  const currentQuestion = questions[currentIndex];
  
  const handleSelect = (index: number) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: index }));
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    setViewState("results");
  };

  // Format time
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const timeString = `${mins}:${secs.toString().padStart(2, "0")}`;

  // Results calculation
  const correctCount = questions.reduce((acc, q) => {
    return answers[q.id] === q.correct_index ? acc + 1 : acc;
  }, 0);
  const accuracy = Math.round((correctCount / questions.length) * 100);

  // ── Results View ──────────────────────────────────────────────────────────
  if (viewState === "results") {
    return (
      <div className="min-h-screen bg-background py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="clean-card p-8 rounded-3xl text-center mb-8 bg-gradient-to-br from-card to-muted">
            <h2 className="text-3xl font-bold mb-4">Exam Completed!</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="p-4 bg-background rounded-2xl border border-border">
                <span className="block text-2xl font-bold text-primary">{accuracy}%</span>
                <span className="text-sm text-muted-foreground">Score</span>
              </div>
              <div className="p-4 bg-background rounded-2xl border border-border">
                <span className="block text-2xl font-bold text-emerald-500">{correctCount}</span>
                <span className="text-sm text-muted-foreground">Correct</span>
              </div>
              <div className="p-4 bg-background rounded-2xl border border-border">
                <span className="block text-2xl font-bold text-rose-500">{questions.length - correctCount}</span>
                <span className="text-sm text-muted-foreground">Incorrect</span>
              </div>
              <div className="p-4 bg-background rounded-2xl border border-border">
                <span className="block text-2xl font-bold text-amber-500">{durationMinutes - Math.ceil(timeLeft/60)}m</span>
                <span className="text-sm text-muted-foreground">Time Taken</span>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 rounded-xl bg-primary text-white font-bold inline-flex items-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Take Another
              </button>
              <Link
                href="/dashboard"
                className="px-6 py-3 rounded-xl border border-border font-bold inline-flex items-center gap-2"
              >
                <BarChart3 className="w-5 h-5" />
                Dashboard
              </Link>
            </div>
          </div>

          <h3 className="text-xl font-bold mb-6">Detailed Review</h3>
          <div className="space-y-6">
            {questions.map((q, idx) => {
              const isCorrect = answers[q.id] === q.correct_index;
              const isUnanswered = answers[q.id] === undefined;

              return (
                <div key={q.id} className="clean-card rounded-2xl p-6 border-l-4" style={{ borderLeftColor: isUnanswered ? "#f59e0b" : isCorrect ? "#10b981" : "#f43f5e" }}>
                  <div className="flex items-start gap-3 mb-4">
                    <span className="font-bold text-muted-foreground mt-0.5">Q{idx + 1}.</span>
                    <h4 className="text-base font-semibold">{q.question}</h4>
                  </div>
                  
                  <div className="space-y-2 ml-8 mb-4">
                    {q.options.map((opt, optIdx) => {
                      const isRightOpt = optIdx === q.correct_index;
                      const isUserChoice = optIdx === answers[q.id];
                      
                      let style = "bg-muted/40 text-muted-foreground";
                      if (isRightOpt) style = "bg-emerald-500/10 text-emerald-700 border border-emerald-500/50 font-bold";
                      else if (isUserChoice && !isRightOpt) style = "bg-rose-500/10 text-rose-700 border border-rose-500/50 line-through";

                      return (
                        <div key={optIdx} className={`px-4 py-2 rounded-lg text-sm ${style}`}>
                          {opt}
                        </div>
                      );
                    })}
                  </div>

                  <div className="ml-8 p-4 bg-muted/50 rounded-xl text-sm text-muted-foreground">
                    <strong className="flex items-center gap-2 text-foreground mb-2">
                      <Lightbulb className="w-4 h-4 text-amber-500" /> Explanation
                    </strong>
                    {q.explanation}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ── Grid View ─────────────────────────────────────────────────────────────
  if (viewState === "grid") {
    return (
      <div className="min-h-screen bg-background py-8 px-4 flex flex-col items-center">
        <div className="w-full max-w-4xl">
          <div className="flex justify-between items-center mb-8">
            <button onClick={() => setViewState("exam")} className="inline-flex items-center gap-2 font-semibold">
              <ArrowLeft className="w-5 h-5" /> Back to Exam
            </button>
            <div className={`px-4 py-2 rounded-full font-bold font-mono text-lg flex items-center gap-2 ${timeLeft < 300 ? 'bg-rose-500/10 text-rose-500' : 'bg-primary/10 text-primary'}`}>
              <Clock className="w-5 h-5" /> {timeString}
            </div>
          </div>
          
          <h2 className="text-2xl font-bold mb-6">Question Overview</h2>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-3 mb-8">
            {questions.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => {
                  setCurrentIndex(idx);
                  setViewState("exam");
                }}
                className={`aspect-square rounded-xl flex items-center justify-center font-bold text-lg transition-colors
                  ${answers[q.id] !== undefined ? 'bg-primary text-white' : 'bg-muted hover:bg-muted/80'}
                  ${currentIndex === idx ? 'ring-4 ring-primary/30' : ''}
                `}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              className="px-8 py-4 bg-rose-500 text-white font-bold rounded-xl shadow-lg hover:bg-rose-600 transition-colors"
            >
              Submit Exam
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Exam View ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background py-8 px-4 flex flex-col items-center justify-start">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => setViewState("grid")}
            className="p-2 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
            title="View all questions"
          >
            <ListTodo className="w-6 h-6" />
          </button>
          
          <div className={`px-6 py-2 rounded-full font-bold font-mono text-2xl flex items-center gap-3 shadow-sm ${timeLeft < 300 ? 'bg-rose-500/10 text-rose-500' : 'bg-card border border-border'}`}>
            <Clock className="w-6 h-6" /> {timeString}
          </div>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-rose-500 text-white text-sm font-bold rounded-lg hover:bg-rose-600 transition-colors shadow-sm"
          >
            Submit
          </button>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm font-bold text-muted-foreground mb-2">
            <span>Question {currentIndex + 1} of {questions.length}</span>
            <span>{Object.keys(answers).length} Answered</span>
          </div>
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary" style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }} />
          </div>
        </div>

        {/* Question */}
        <div className="clean-card rounded-3xl p-5 sm:p-10 mb-8 sm:min-h-[400px]">
          <h2 className="text-[17px] sm:text-2xl font-bold mb-6 sm:mb-8 leading-relaxed">
            {currentQuestion.question}
          </h2>
          
          <div className="space-y-2.5 sm:space-y-3">
            {currentQuestion.options.map((opt, idx) => {
              const isSelected = answers[currentQuestion.id] === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  className={`w-full text-left p-3.5 sm:p-5 rounded-2xl border-2 transition-all text-[15px] sm:text-lg font-medium leading-snug
                    ${isSelected 
                      ? 'border-primary bg-primary/5 text-primary' 
                      : 'border-border/50 bg-card hover:border-primary/30 hover:bg-muted/50'
                    }
                  `}
                >
                  <span className="inline-block w-7 sm:w-8 text-muted-foreground font-bold">
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation - Desktop */}
        <div className="hidden sm:flex items-center justify-between mt-8">
          <button
            onClick={prevQuestion}
            disabled={currentIndex === 0}
            className="px-6 py-4 rounded-2xl font-bold inline-flex items-center gap-2 bg-card border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="w-5 h-5" /> Previous
          </button>
          
          {currentIndex < questions.length - 1 ? (
            <button
              onClick={nextQuestion}
              className="px-6 py-4 rounded-2xl font-bold inline-flex items-center gap-2 bg-primary text-white shadow-lg hover:bg-primary/90 transition-colors active:scale-95"
            >
              Next <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={() => setViewState("grid")}
              className="px-6 py-4 rounded-2xl font-bold inline-flex items-center gap-2 bg-amber-500 text-white shadow-lg hover:bg-amber-600 transition-colors active:scale-95"
            >
              Review All <ListTodo className="w-5 h-5" />
            </button>
          )}
        </div>
        
        {/* Navigation - Mobile Sticky */}
        <div className="flex sm:hidden fixed bottom-0 left-0 right-0 p-4 bg-background/85 backdrop-blur-2xl border-t border-border z-50 gap-3 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
          <button
            onClick={prevQuestion}
            disabled={currentIndex === 0}
            className="flex-1 py-3.5 rounded-xl font-bold inline-flex items-center justify-center gap-2 bg-card border border-border hover:bg-muted disabled:opacity-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Prev
          </button>
          
          {currentIndex < questions.length - 1 ? (
            <button
              onClick={nextQuestion}
              className="flex-[1.5] py-3.5 rounded-xl font-bold inline-flex items-center justify-center gap-2 bg-primary text-white shadow-lg active:scale-95 transition-transform"
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setViewState("grid")}
              className="flex-[1.5] py-3.5 rounded-xl font-bold inline-flex items-center justify-center gap-2 bg-amber-500 text-white shadow-lg active:scale-95 transition-transform"
            >
              Review <ListTodo className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
