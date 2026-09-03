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
    if (selectedFile.type !== "application/pdf") {
      setError("Please upload a valid PDF file.");
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("File is too large. Please upload a PDF under 5MB.");
      return;
    }
    setFile(selectedFile);
    setQuizName(selectedFile.name.replace(".pdf", ""));
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
        throw new Error(data.error || "Failed to process PDF");
      }

      // Save ID to localStorage library
      const existingLib = localStorage.getItem("my_pdf_quizzes");
      const library: string[] = existingLib ? JSON.parse(existingLib) : [];
      
      localStorage.setItem("my_pdf_quizzes", JSON.stringify([data.id, ...library]));

      // Redirect to the custom quiz
      router.push(`/pdf-quiz?id=${data.id}`);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full clean-card rounded-3xl p-8 border border-border shadow-sm">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
          <FileText className="w-6 h-6 text-primary" />
          Turn Any PDF into a Quiz
        </h2>
        <p className="text-sm text-muted-foreground mt-2">
          Upload your own lecture notes, guidelines, or research papers. Our AI will read it, summarize it, and test your knowledge instantly.
        </p>
      </div>

      {!file ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
            isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/50"
          }`}
        >
          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            ref={fileInputRef}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) handleFileSelect(e.target.files[0]);
            }}
          />
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Upload className="w-7 h-7 text-primary" />
          </div>
          <p className="text-foreground font-semibold mb-1">Click to upload or drag and drop</p>
          <p className="text-xs text-muted-foreground">PDF files up to 5MB</p>
          
          {error && (
            <div className="mt-4 flex items-center gap-2 text-error text-sm font-medium">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
        </div>
      ) : (
        <div className="border border-primary/20 bg-primary/5 rounded-2xl p-6 flex flex-col items-center justify-center">
          
          <div className="w-full max-w-sm mb-6 space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-background border border-border shadow-sm">
              <FileText className="w-8 h-8 text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              {!isProcessing && (
                <button 
                  onClick={(e) => { e.stopPropagation(); setFile(null); }}
                  className="text-xs text-muted-foreground hover:text-error transition-colors p-2"
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
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm font-medium focus:ring-2 focus:ring-primary focus:outline-none transition-all"
              />
            </div>
          </div>

          <button
            onClick={processPDF}
            disabled={isProcessing || !quizName.trim()}
            className="w-full max-w-sm inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold shadow-md hover:bg-primary/90 disabled:opacity-70 transition-all"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing PDF...
              </>
            ) : (
              <>
                <SparklesIcon className="w-5 h-5" />
                Save & Generate Quiz
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
