"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getChapterById } from "@/lib/data/chapters";
import { getBookById } from "@/lib/data/books";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

function PrintNotePageInner() {
  const searchParams = useSearchParams();
  const bookId = searchParams.get("book");
  const chapterId = searchParams.get("chapter");
  const type = searchParams.get("type"); // 'notes' or 'summary'
  
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const book = getBookById(bookId as any);
  const chapter = getChapterById(chapterId as any);

  useEffect(() => {
    if (!chapterId || !bookId || !type) return;
    
    async function fetchContent() {
      try {
        if (type === "notes") {
          const res = await fetch(`/api/notes?book=${bookId}&chapter=${chapterId}`);
          const data = await res.json();
          setContent(data.notes);
        } else if (type === "summary") {
          const res = await fetch(`/api/summary?book=${bookId}&chapter=${chapterId}`);
          const data = await res.json();
          // The summary API might return a JSON structure or string
          // We handle formatting here
          if (data.summary) {
            let mdContent = "";
            try {
              const parsed = JSON.parse(data.summary);
              mdContent = `### Overview\n${parsed.overview}\n\n`;
              mdContent += `### Key Concepts\n${parsed.key_concepts.map((c: string) => `- ${c}`).join('\n')}\n\n`;
              mdContent += `### High Yield Facts\n${parsed.high_yield_facts.map((c: string) => `- ${c}`).join('\n')}\n\n`;
              mdContent += `### Epidemiological & Medicolegal Importance\n${parsed.epidemiological_and_medicolegal_importance.map((c: string) => `- ${c}`).join('\n')}\n\n`;
              mdContent += `### Tips & Suggestions\n${parsed.tips_and_suggestions.map((c: string) => `- ${c}`).join('\n')}\n\n`;
              setContent(mdContent);
            } catch (e) {
              setContent(data.summary); // Fallback if it's raw text
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch content for printing", err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchContent();
  }, [bookId, chapterId, type]);

  useEffect(() => {
    if (!loading && content) {
      setTimeout(() => {
        window.print();
      }, 500);
    }
  }, [loading, content]);

  if (loading) {
    return <div className="p-8">Preparing document...</div>;
  }

  if (!content) {
    return <div className="p-8">No content found to print.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-8 print-container bg-white text-black min-h-screen">
      <div className="mb-10 border-b border-gray-300 pb-6 text-center">
        <h1 className="text-3xl font-bold mb-2">{chapter?.name || "Study Guide"}</h1>
        {book && <h2 className="text-xl text-gray-600">{book.title}</h2>}
        <p className="mt-4 text-gray-500 font-bold uppercase tracking-widest text-sm">
          {type === "notes" ? "Short Notes" : "Chapter Summary"}
        </p>
      </div>

      <div className="prose max-w-none text-black">
        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}

export default function PrintNotePage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <PrintNotePageInner />
    </Suspense>
  );
}
