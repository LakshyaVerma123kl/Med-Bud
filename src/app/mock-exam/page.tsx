"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Play, Timer, Sparkles, Settings2 } from "lucide-react";
import { Question } from "@/lib/types";
import { MockExamContent } from "@/components/quiz/MockExamContent";

export default function MockExamPage() {
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [questionCount, setQuestionCount] = useState<number>(100);
  const [duration, setDuration] = useState<number>(90); // minutes

  const startExam = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/questions/random?count=${questionCount}`);
      if (res.ok) {
        const data = await res.json();
        setQuestions(data.questions || []);
      }
    } catch (err) {
      console.error("Failed to start exam", err);
    } finally {
      setLoading(false);
    }
  };

  if (questions) {
    return <MockExamContent questions={questions} durationMinutes={duration} />;
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-lg">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Dashboard
        </Link>

        <div className="clean-card rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <Timer className="w-64 h-64 text-primary rotate-12" />
          </div>

          <div className="relative z-10">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
              <Timer className="w-8 h-8 text-primary" />
            </div>

            <h1 className="text-3xl font-bold mb-4 tracking-tight">Grand Mock Exam</h1>
            <p className="text-muted-foreground mb-10 leading-relaxed">
              Simulate the real NEET-PG environment. Questions are randomly pulled from all chapters across Forensic and Community Medicine.
            </p>

            <div className="space-y-6 mb-10">
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-foreground mb-3 uppercase tracking-wider">
                  <Settings2 className="w-4 h-4 text-primary" /> Question Count
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[25, 50, 100].map((num) => (
                    <button
                      key={num}
                      onClick={() => {
                        setQuestionCount(num);
                        setDuration(num === 25 ? 30 : num === 50 ? 45 : 90);
                      }}
                      className={`py-3 rounded-xl font-bold border-2 transition-all ${
                        questionCount === num
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border/50 text-muted-foreground hover:border-border hover:bg-muted/50"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-sm font-medium flex items-start gap-3">
                <Timer className="w-5 h-5 shrink-0 mt-0.5" />
                <p>
                  You will have <strong>{duration} minutes</strong> to complete {questionCount} questions. 
                  Immediate feedback is disabled.
                </p>
              </div>
            </div>

            <button
              onClick={startExam}
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-primary text-white font-bold text-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-primary/20 active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Sparkles className="w-6 h-6 animate-spin-slow" />
                  Generating Exam...
                </>
              ) : (
                <>
                  <Play className="w-6 h-6 fill-current" />
                  Start Grand Test
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
