"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Question } from "@/lib/types";
import { getChapterById } from "@/lib/data/chapters";
import { getBookById } from "@/lib/data/books";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

function PrintPageInner() {
  const searchParams = useSearchParams();
  const bookId = searchParams.get("book");
  const chapterId = searchParams.get("chapter");
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  const book = getBookById(bookId as any);
  const chapter = getChapterById(chapterId as any);

  useEffect(() => {
    if (!chapterId) return;
    
    async function fetchQuestions() {
      try {
        const res = await fetch(`/api/questions?chapter=${chapterId}`);
        const data = await res.json();
        if (data.questions) {
          setQuestions(data.questions);
        }
      } catch (err) {
        console.error("Failed to fetch questions for printing", err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchQuestions();
  }, [chapterId]);

  useEffect(() => {
    if (!loading && questions.length > 0) {
      // Small delay to ensure math formatting has rendered
      setTimeout(() => {
        window.print();
      }, 500);
    }
  }, [loading, questions]);

  if (loading) {
    return <div className="p-8">Preparing study guide...</div>;
  }

  if (questions.length === 0) {
    return <div className="p-8">No questions found to print.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-8 print-container bg-white text-black min-h-screen">
      <div className="mb-10 border-b border-gray-300 pb-6 text-center">
        <h1 className="text-3xl font-bold mb-2">{chapter?.name || "Study Guide"}</h1>
        {book && <h2 className="text-xl text-gray-600">{book.title}</h2>}
        <p className="mt-4 text-gray-500 text-sm">{questions.length} Questions</p>
      </div>

      <div className="space-y-12">
        {questions.map((q, idx) => (
          <div key={q.id} className="break-inside-avoid">
            <div className="flex gap-4">
              <span className="font-bold text-lg min-w-[24px]">{idx + 1}.</span>
              <div className="flex-1">
                {q.image_url && (
                  <div className="mb-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={q.image_url} alt="Figure" className="max-h-48 object-contain" />
                  </div>
                )}
                
                <div className="font-semibold text-lg mb-4 prose max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                    {q.question}
                  </ReactMarkdown>
                </div>

                <div className="space-y-2 mb-4 ml-2">
                  {q.options.map((opt, optIdx) => {
                    const isCorrect = optIdx === q.correct_index;
                    return (
                      <div key={optIdx} className="flex gap-2">
                        <span className="font-medium text-gray-500 w-6">
                          {String.fromCharCode(65 + optIdx)}.
                        </span>
                        <span className={isCorrect ? "font-bold border-b-2 border-black" : ""}>
                          {opt}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="font-bold block mb-1">Explanation:</span>
                  <div className="prose max-w-none text-sm">
                    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                      {q.explanation}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PrintPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <PrintPageInner />
    </Suspense>
  );
}
