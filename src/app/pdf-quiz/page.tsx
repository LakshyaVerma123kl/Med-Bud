"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { QuizContent } from "@/components/quiz/QuizContent";
import { Question } from "@/lib/types";
import { ArrowLeft, FileText, Loader2, Sparkles, BookOpen, Plus } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

type Chapter = {
  index: number;
  title: string;
  summary: string;
  questions: Question[];
  text?: string;
};

type DocumentData = {
  id: string;
  title: string;
  summary: string;
  isChunked: boolean;
  chapters?: Chapter[];
  questions?: Question[];
  rawText?: string;
};

function PDFQuizContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [data, setData] = useState<DocumentData | null>(null);
  const [error, setError] = useState(false);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

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

          let isChunked = false;
          let chapters = [];
          let rawText = "";
          let questions = [];

          if (quizData.questions && !Array.isArray(quizData.questions) && quizData.questions.is_chunked !== undefined) {
            isChunked = quizData.questions.is_chunked;
            rawText = quizData.questions.raw_text || "";
            if (isChunked) {
              chapters = quizData.questions.chapters || [];
            } else {
              questions = quizData.questions.questions || [];
            }
          } else {
            // Legacy single-shot
            questions = Array.isArray(quizData.questions) ? quizData.questions : [];
          }

          setData({
            id: quizData.id,
            summary: quizData.summary,
            title: quizData.name,
            isChunked,
            chapters,
            questions,
            rawText
          });
        });
      return;
    }
  }, [router, searchParams]);

  const handleGenerateMore = async (chapterIndex?: number) => {
    if (!data) return;
    setIsGenerating(true);
    try {
      const res = await fetch("/api/pdf/generate-more", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: data.id,
          isChunked: data.isChunked,
          chapterIndex
        })
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.error || "Failed to generate more questions");
      }

      // Update local state
      setData(prev => {
        if (!prev) return prev;
        if (prev.isChunked && prev.chapters && chapterIndex !== undefined) {
          const newChapters = [...prev.chapters];
          newChapters[chapterIndex] = {
            ...newChapters[chapterIndex],
            questions: [...(newChapters[chapterIndex].questions || []), ...result.newQuestions],
            summary: newChapters[chapterIndex].summary || result.summary || ""
          };
          return { ...prev, chapters: newChapters };
        } else {
          return {
            ...prev,
            questions: [...(prev.questions || []), ...result.newQuestions]
          };
        }
      });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

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

  const renderQuestions = (questions: Question[], chapterIdx?: number) => {
    if (questions.length === 0) {
      return (
        <div className="clean-card rounded-2xl p-8 flex flex-col items-center justify-center text-center border-dashed">
          <BookOpen className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-lg font-bold mb-2">No Questions Yet</h3>
          <p className="text-muted-foreground mb-6 max-w-sm">
            Generate clinical-vignette style questions for this section of the document.
          </p>
          <button
            onClick={() => handleGenerateMore(chapterIdx)}
            disabled={isGenerating}
            className="px-6 py-3 rounded-xl bg-primary text-white font-semibold flex items-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            Generate Quiz Now
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <QuizContent
          questions={questions}
          mode="practice"
          bookId={"custom_pdf" as any}
          chapterId={data.title}
        />
        
        {/* Generate More Button */}
        {data.rawText && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => handleGenerateMore(chapterIdx)}
              disabled={isGenerating}
              className="px-6 py-3 rounded-xl bg-muted text-foreground font-semibold flex items-center gap-2 hover:bg-muted/80 transition-colors border border-border disabled:opacity-50"
            >
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Generate More Questions
            </button>
          </div>
        )}
      </div>
    );
  };

  const formattedSummary = data.summary ? data.summary.replace(/\\n/g, '\n') : "";

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
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

        {data.isChunked && data.chapters ? (
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="w-full md:w-64 shrink-0 space-y-2">
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 px-2">Chapters</h3>
              {data.chapters.map((chapter, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveChapterIndex(idx)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeChapterIndex === idx
                      ? "bg-primary text-white shadow-md"
                      : "hover:bg-muted text-foreground/80"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span>{chapter.title}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${activeChapterIndex === idx ? "bg-white/20" : "bg-muted-foreground/10"}`}>
                      {(chapter.questions || []).length} Qs
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0 space-y-8">
              {data.chapters[activeChapterIndex]?.summary && (
                <div className="bg-card/50 backdrop-blur-sm border border-primary/20 rounded-2xl p-6 shadow-sm">
                  <h2 className="text-lg font-bold text-primary mb-3">Chapter Summary</h2>
                  <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                      {data.chapters[activeChapterIndex].summary}
                    </ReactMarkdown>
                  </div>
                </div>
              )}
              
              {renderQuestions(data.chapters[activeChapterIndex]?.questions || [], activeChapterIndex)}
            </div>
          </div>
        ) : (
          /* Unchunked layout */
          <div className="max-w-4xl mx-auto space-y-8">
            {formattedSummary && (
              <div className="bg-card/50 backdrop-blur-sm border border-primary/20 rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-primary mb-3">AI Document Summary</h2>
                <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                  <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                    {formattedSummary}
                  </ReactMarkdown>
                </div>
              </div>
            )}

            {renderQuestions(data.questions || [])}
          </div>
        )}

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
