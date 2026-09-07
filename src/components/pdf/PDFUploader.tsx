"use client";

import { useState, useRef } from "react";
import { Upload, FileText, Loader2, AlertCircle, Edit2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Question } from "@/lib/types";

export interface SavedPDFQuiz {
  id: string;
  name: string;
  summary: string;
  questions: Question[];
  date: string;
}

export function PDFUploader() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [quizName, setQuizName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (selectedFile: File) => {
    setError(null);
    const isDocx = selectedFile.name.toLowerCase().endsWith(".docx") || selectedFile.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    if (selectedFile.type !== "application/pdf" && !isDocx) {
      setError("Please upload a valid PDF or Word Document (.docx).");
      return;
    }
    if (selectedFile.size > 50 * 1024 * 1024) {
      setError("File is too large. Please upload a document under 50MB.");
      return;
    }
    setFile(selectedFile);
    setQuizName(selectedFile.name.replace(/\.(pdf|docx)$/i, ""));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const processPDF = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("quizName", quizName);

      const res = await fetch("/api/pdf", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to process document");
      }

      // Redirect to the custom quiz
      router.push(`/pdf-quiz?id=${data.id}`);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full bg-card rounded-lg p-8 sm:p-10 border border-border">
      <div className="text-center mb-8">
        <div className="inline-block px-2.5 py-1 rounded bg-accent/10 text-accent text-[10px] font-bold tracking-widest uppercase mb-4">
          FROM YOUR NOTES
        </div>
        <p className="text-base sm:text-lg text-muted-foreground mt-2 font-serif italic max-w-lg mx-auto">
          Turn lecture notes, guidelines, and research material into questions for revision.
        </p>
      </div>

      {!file ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border border-dashed rounded-lg p-10 sm:p-16 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
            isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/30"
          }`}
        >
          <input
            type="file"
            accept="application/pdf, .docx, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="hidden"
            ref={fileInputRef}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) handleFileSelect(e.target.files[0]);
            }}
          />
          <div className="text-muted-foreground font-semibold mb-2 tracking-wide uppercase text-sm">
            [ Upload / Drag & Drop Area ]
          </div>
          <p className="text-xs text-muted-foreground mt-2">PDF or DOCX · up to 50 MB</p>
          
          {error && (
            <div className="mt-6 flex items-center gap-2 text-error text-sm font-medium bg-error/10 px-3 py-2 rounded">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
        </div>
      ) : (
        <div className="border border-border bg-muted/20 rounded-lg p-8 flex flex-col items-center justify-center">
          
          <div className="w-full max-w-sm mb-6 space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-md bg-background border border-border shadow-sm">
              <FileText className="w-8 h-8 text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground truncate">{file.name}</p>
                <p className="text-xs font-serif text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              {!isProcessing && (
                <button 
                  onClick={(e) => { e.stopPropagation(); setFile(null); }}
                  className="text-xs font-semibold text-muted-foreground hover:text-error transition-colors p-2"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Edit2 className="w-3.5 h-3.5" />
                Name your Quiz
              </label>
              <input 
                type="text" 
                value={quizName}
                onChange={(e) => setQuizName(e.target.value)}
                disabled={isProcessing}
                placeholder="e.g. Pathology Chapter 4 Notes"
                className="w-full px-4 py-3 sm:py-3.5 rounded-xl border border-border bg-background text-base font-medium focus:ring-2 focus:ring-primary focus:outline-none transition-all"
              />
            </div>
          </div>

          <button
            onClick={processPDF}
            disabled={isProcessing}
            className={`w-full max-w-sm py-3 px-6 rounded-md font-semibold flex items-center justify-center gap-2 transition-colors ${
              isProcessing 
                ? "bg-muted text-muted-foreground cursor-not-allowed border border-border" 
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing Document...
              </>
            ) : (
              <>
                Generate Custom Quiz
              </>
            )}
          </button>
          
          {error && (
            <div className="mt-4 flex items-center gap-2 text-error text-sm font-medium">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SparklesIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
    </svg>
  );
}
