"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { QuizContent } from "@/components/quiz/QuizContent";
import { Question } from "@/lib/types";
import { ArrowLeft, FileText } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

function PDFQuizContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [data, setData] = useState<{ summary: string; questions: Question[]; title: string } | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const id = searchParams.get("id");
    
    if (id) {
      // Fetch from Supabase
      supabase
        .from("pdf_quizzes")
        .select("*")
        .eq("id", id)
        .single()
        .then(({ data: quizData, error }) => {
          if (error || !quizData) {
            console.error("Failed to fetch PDF quiz", error);
            setError(true);
            return;
          }
          setData({
            summary: quizData.summary,
            questions: quizData.questions,
            title: quizData.name,
          });
        });
      return;
    }
    
    const stored = sessionStorage.getItem("pdf_quiz_data");
    if (!stored) {
      router.push("/");
      return;
    }
    
    try {
      setData(JSON.parse(stored));
    } catch (e) {
      console.error("Failed to parse PDF quiz data", e);
      router.push("/");
    }
  }, [router, searchParams]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <FileText className="w-12 h-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-bold mb-2">Quiz Not Found</h2>
        <p className="text-muted-foreground mb-6 text-center max-w-sm">
          This custom PDF quiz doesn't exist or has been deleted.
        </p>
        <Link href="/" className="px-6 py-3 rounded-xl bg-primary text-white font-semibold">
          Return to Home
        </Link>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-muted rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-muted-foreground" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <FileText className="w-6 h-6 text-primary" />
              {data.title}
            </h1>
            <p className="text-muted-foreground text-sm">AI-Generated Custom Study Session</p>
          </div>
        </div>

        {/* AI Summary */}
        <div className="bg-card/50 backdrop-blur-sm border border-primary/20 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-primary mb-3">AI Document Summary</h2>
          <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {data.summary}
          </div>
        </div>

        {/* Quiz Engine */}
        <div className="mt-8">
          <QuizContent
            questions={data.questions}
            mode="practice"
            bookId={"custom_pdf" as any}
            chapterId={data.title}
          />
        </div>

      </div>
    </div>
  );
}

export default function PDFQuizPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
      <PDFQuizContent />
    </Suspense>
  );
}
