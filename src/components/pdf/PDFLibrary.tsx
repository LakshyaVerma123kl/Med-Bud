"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FileText, Calendar, Trash2, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

export function PDFLibrary() {
  const [pdfLibrary, setPdfLibrary] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPDFs = async () => {
      try {
        const { data } = await supabase
          .from("pdf_quizzes")
          .select("id, name, created_at, questions")
          .order('created_at', { ascending: false });
        
        if (data) setPdfLibrary(data);
      } catch (e) {
        console.error("Error fetching PDFs:", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPDFs();
  }, []);

  const handleDeletePDF = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!window.confirm("Remove this quiz and permanently delete it for everyone?")) return;
    
    try {
      const res = await fetch(`/api/pdf/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete from database");

      setPdfLibrary(prev => prev.filter(pdf => pdf.id !== id));
    } catch (err) {
      console.error("Error deleting PDF quiz:", err);
    }
  };

  if (pdfLibrary.length === 0 && !isLoading) {
    return null;
  }

  if (isLoading) {
    return (
      <section className="py-12 bg-background border-b border-border/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 w-full">
          <div className="mb-6">
            <div className="h-8 w-64 bg-muted animate-pulse rounded-md mb-2"></div>
            <div className="h-4 w-96 bg-muted animate-pulse rounded-md"></div>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="clean-card rounded-2xl h-36 bg-muted/20 animate-pulse border border-border/50"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-background border-b border-border/60">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 w-full">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <FileText className="w-6 h-6 text-primary" />
              Community PDF Quizzes
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Quizzes generated from PDFs by other MedQuiz users.
            </p>
          </div>
        </div>
        
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {pdfLibrary.map((pdf) => (
            <Link
              key={pdf.id}
              href={`/pdf-quiz?id=${pdf.id}`}
              className="clean-card rounded-2xl overflow-hidden flex flex-col group hover:border-primary/50 transition-all hover:shadow-lg"
            >
              <div className="p-4 bg-primary/5 border-b border-border/50 relative">
                <button
                  onClick={(e) => handleDeletePDF(e, pdf.id)}
                  className="absolute top-3 right-3 p-1.5 rounded-md hover:bg-error/10 text-muted-foreground hover:text-error opacity-0 group-hover:opacity-100 transition-all z-10"
                  title="Delete for everyone"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <h4 className="font-semibold text-foreground text-sm pr-8 truncate group-hover:text-primary transition-colors">
                  {pdf.name}
                </h4>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(pdf.created_at || pdf.date).toLocaleDateString()}
                  <span className="mx-1">•</span>
                  <span className="font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                    {pdf.questions?.length || 0} Qs
                  </span>
                </div>
                <div className="flex items-center text-xs font-semibold text-primary">
                  Start Quiz
                  <ArrowRight className="w-3.5 h-3.5 ml-1 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
