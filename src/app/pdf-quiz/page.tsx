"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { QuizContent } from "@/components/quiz/QuizContent";
import { Question } from "@/lib/types";
import { ArrowLeft, FileText } from "lucide-react";
import Link from "next/link";

export default function PDFQuizPage() {
  const router = useRouter();
  const [data, setData] = useState<{ summary: string; questions: Question[]; title: string } | null>(null);

  useEffect(() => {
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
  }, [router]);

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
