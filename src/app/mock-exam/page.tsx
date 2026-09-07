"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Play, Timer, Sparkles, Settings2, BookOpen, Target, Clock as ClockIcon, FileText } from "lucide-react";
import { Question } from "@/lib/types";
import { MockExamContent } from "@/components/quiz/MockExamContent";
import { narayanReddyChapters, parkChapters } from "@/lib/data/chapters";
import { supabase } from "@/lib/supabase";

export default function MockExamPage() {
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Customization States
  const [source, setSource] = useState<"official" | "custom">("official");
  const [questionCount, setQuestionCount] = useState<number>(100);
  const [duration, setDuration] = useState<number>(90); // minutes
  const [difficulty, setDifficulty] = useState<string>("all");
  
  // Official Bank States
  const allChapterIds = [...narayanReddyChapters, ...parkChapters].map(c => c.id);
  const [selectedChapters, setSelectedChapters] = useState<Set<string>>(new Set(allChapterIds));
  const [showChapterSelect, setShowChapterSelect] = useState(false);

  // Custom PDF States
  const [customPdfs, setCustomPdfs] = useState<any[]>([]);
  const [selectedPdfs, setSelectedPdfs] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (source === "custom" && customPdfs.length === 0) {
      const fetchPdfs = async () => {
        const { data } = await supabase.from("pdf_quizzes").select("id, title, questions");
        if (data) setCustomPdfs(data);
      };
      fetchPdfs();
    }
  }, [source]);

  const toggleChapter = (id: string) => {
    setSelectedChapters(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const togglePdf = (id: string) => {
    setSelectedPdfs(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleBook = (bookChapters: any[]) => {
    const bookIds = bookChapters.map(c => c.id);
    const allSelected = bookIds.every(id => selectedChapters.has(id));
    
    setSelectedChapters(prev => {
      const next = new Set(prev);
      bookIds.forEach(id => {
        if (allSelected) next.delete(id);
        else next.add(id);
      });
      return next;
    });
  };

  const startExam = async () => {
    if (source === "official" && selectedChapters.size === 0) {
      alert("Please select at least one chapter.");
      return;
    }
    if (source === "custom" && selectedPdfs.size === 0) {
      alert("Please select at least one custom PDF.");
      return;
    }
    
    setLoading(true);
    try {
      if (source === "official") {
        const chaptersParam = Array.from(selectedChapters).join(",");
        const res = await fetch(`/api/questions/random?count=${questionCount}&difficulty=${difficulty}&chapters=${chaptersParam}`);
        if (res.ok) {
          const data = await res.json();
          if (!data.questions || data.questions.length === 0) {
            alert("No questions found matching your criteria.");
          } else {
            setQuestions(data.questions);
          }
        }
      } else {
        // Custom PDF logic
        let allCustomQuestions: Question[] = [];
        customPdfs.forEach(pdf => {
          if (selectedPdfs.has(pdf.id) && pdf.questions) {
            allCustomQuestions.push(...pdf.questions);
          }
        });

        if (difficulty !== "all") {
          allCustomQuestions = allCustomQuestions.filter(q => q.difficulty === difficulty);
        }

        if (allCustomQuestions.length === 0) {
          alert("No questions found in selected PDFs.");
          setLoading(false);
          return;
        }

        // Shuffle and take subset
        allCustomQuestions.sort(() => Math.random() - 0.5);
        const finalQs = allCustomQuestions.slice(0, questionCount);
        setQuestions(finalQs);
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
      <div className="w-full max-w-2xl">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Dashboard
        </Link>

        <div className="clean-card rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl shadow-primary/5">
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
                <Timer className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Custom Mock Exam</h1>
                <p className="text-muted-foreground">Configure your exam parameters</p>
              </div>
            </div>

            <div className="space-y-8 mb-10">
              
              {/* Top Grid: Count & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-foreground mb-3 uppercase tracking-wider">
                    <Target className="w-4 h-4 text-primary" /> Questions
                  </label>
                  <div className="flex items-center gap-3">
                    {[25, 50, 100].map((num) => (
                      <button
                        key={num}
                        onClick={() => {
                          setQuestionCount(num);
                          if (num === 25) setDuration(30);
                          if (num === 50) setDuration(45);
                          if (num === 100) setDuration(90);
                        }}
                        className={`flex-1 py-2 rounded-xl font-bold border-2 transition-all ${
                          questionCount === num
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border/50 text-muted-foreground hover:border-border hover:bg-muted/50"
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                    <input 
                      type="number" 
                      value={questionCount}
                      onChange={(e) => setQuestionCount(Number(e.target.value) || 10)}
                      className="w-20 px-3 py-2 rounded-xl border-2 border-border/50 bg-transparent text-center font-bold focus:border-primary focus:outline-none transition-colors"
                      min={5}
                      max={500}
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-foreground mb-3 uppercase tracking-wider">
                    <ClockIcon className="w-4 h-4 text-primary" /> Duration (Mins)
                  </label>
                  <input 
                    type="number" 
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value) || 10)}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-border/50 bg-transparent font-bold focus:border-primary focus:outline-none transition-colors"
                    min={5}
                    max={300}
                  />
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-foreground mb-3 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-primary" /> Difficulty
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { id: "all", label: "Mixed" },
                    { id: "easy", label: "Easy" },
                    { id: "medium", label: "Medium" },
                    { id: "hard", label: "Hard" }
                  ].map((lvl) => (
                    <button
                      key={lvl.id}
                      onClick={() => setDifficulty(lvl.id)}
                      className={`py-2 rounded-xl font-bold border-2 transition-all ${
                        difficulty === lvl.id
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border/50 text-muted-foreground hover:border-border hover:bg-muted/50"
                      }`}
                    >
                      {lvl.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Source Selection Toggle */}
              <div className="border-t border-border pt-6">
                <label className="flex items-center gap-2 text-sm font-bold text-foreground mb-4 uppercase tracking-wider">
                  <FileText className="w-4 h-4 text-primary" /> Question Source
                </label>
                <div className="flex gap-4 mb-6">
                  <button
                    onClick={() => setSource("official")}
                    className={`flex-1 py-3 rounded-xl font-bold border-2 transition-all ${
                      source === "official"
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border/50 text-muted-foreground hover:border-border hover:bg-muted/50"
                    }`}
                  >
                    Official Bank
                  </button>
                  <button
                    onClick={() => setSource("custom")}
                    className={`flex-1 py-3 rounded-xl font-bold border-2 transition-all flex items-center justify-center gap-2 ${
                      source === "custom"
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border/50 text-muted-foreground hover:border-border hover:bg-muted/50"
                    }`}
                  >
                    Uploaded PDFs
                  </button>
                </div>

                {source === "official" && (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <label className="flex items-center gap-2 text-sm font-bold text-foreground uppercase tracking-wider">
                        <BookOpen className="w-4 h-4 text-primary" /> Topics & Chapters
                      </label>
                      <button 
                        onClick={() => setShowChapterSelect(!showChapterSelect)}
                        className="text-xs font-bold text-primary hover:underline"
                      >
                        {showChapterSelect ? "Hide List" : "Customize Topics"}
                      </button>
                    </div>
                    
                    {!showChapterSelect && (
                      <div className="p-4 rounded-xl bg-muted/50 border border-border text-sm text-muted-foreground">
                        {selectedChapters.size === allChapterIds.length 
                          ? "All chapters from Forensic and Community Medicine selected."
                          : `${selectedChapters.size} out of ${allChapterIds.length} chapters selected.`}
                      </div>
                    )}
                  </>
                )}

                {source === "custom" && (
                  <div className="space-y-4">
                    {customPdfs.length === 0 ? (
                      <div className="p-6 text-center rounded-xl bg-muted/50 border border-border">
                        <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                        <p className="text-sm font-medium text-foreground mb-1">No custom PDFs found</p>
                        <p className="text-xs text-muted-foreground mb-4">Upload and process PDFs first to create mock exams from them.</p>
                        <Link href="/pdf-quiz" className="text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-md hover:bg-primary/20">
                          Upload PDF
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-2 p-4 rounded-xl border border-border bg-muted/20 max-h-[300px] overflow-y-auto custom-scrollbar">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-muted-foreground uppercase">Select PDFs</span>
                          <button 
                            onClick={() => {
                              if (selectedPdfs.size === customPdfs.length) {
                                setSelectedPdfs(new Set());
                              } else {
                                setSelectedPdfs(new Set(customPdfs.map(p => p.id)));
                              }
                            }}
                            className="text-xs font-bold text-primary hover:underline"
                          >
                            Toggle All
                          </button>
                        </div>
                        {customPdfs.map(pdf => {
                          const qCount = pdf.questions?.length || 0;
                          return (
                            <label key={pdf.id} className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all ${
                              selectedPdfs.has(pdf.id) ? "border-primary bg-primary/5" : "border-transparent bg-background hover:border-border"
                            }`}>
                              <div className="flex items-center gap-3">
                                <input 
                                  type="checkbox" 
                                  checked={selectedPdfs.has(pdf.id)}
                                  onChange={() => togglePdf(pdf.id)}
                                  className="w-4 h-4 rounded text-primary border-border/80 focus:ring-primary bg-background"
                                />
                                <span className={`text-sm font-medium ${selectedPdfs.has(pdf.id) ? "text-foreground" : "text-muted-foreground"}`}>
                                  {pdf.title || "Untitled PDF"}
                                </span>
                              </div>
                              <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                                {qCount} Qs
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {showChapterSelect && (
                  <div className="space-y-6 max-h-[300px] overflow-y-auto p-4 rounded-xl border border-border bg-muted/20 custom-scrollbar">
                    {/* Forensic Medicine */}
                    <div>
                      <div className="flex items-center justify-between mb-3 sticky top-0 bg-background/95 backdrop-blur py-2 z-10">
                        <h3 className="font-bold text-foreground">Forensic Medicine</h3>
                        <button 
                          onClick={() => toggleBook(narayanReddyChapters)}
                          className="text-xs font-bold text-primary px-2 py-1 rounded bg-primary/10 hover:bg-primary/20"
                        >
                          Toggle All
                        </button>
                      </div>
                      <div className="space-y-2">
                        {narayanReddyChapters.map(c => (
                          <label key={c.id} className="flex items-center gap-3 cursor-pointer group">
                            <input 
                              type="checkbox" 
                              checked={selectedChapters.has(c.id)}
                              onChange={() => toggleChapter(c.id)}
                              className="w-4 h-4 rounded text-primary border-border/80 focus:ring-primary focus:ring-offset-background bg-background"
                            />
                            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                              {c.name}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Community Medicine */}
                    <div>
                      <div className="flex items-center justify-between mb-3 sticky top-0 bg-background/95 backdrop-blur py-2 z-10">
                        <h3 className="font-bold text-foreground">Community Medicine</h3>
                        <button 
                          onClick={() => toggleBook(parkChapters)}
                          className="text-xs font-bold text-primary px-2 py-1 rounded bg-primary/10 hover:bg-primary/20"
                        >
                          Toggle All
                        </button>
                      </div>
                      <div className="space-y-2">
                        {parkChapters.map(c => (
                          <label key={c.id} className="flex items-center gap-3 cursor-pointer group">
                            <input 
                              type="checkbox" 
                              checked={selectedChapters.has(c.id)}
                              onChange={() => toggleChapter(c.id)}
                              className="w-4 h-4 rounded text-primary border-border/80 focus:ring-primary focus:ring-offset-background bg-background"
                            />
                            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                              {c.name}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={startExam}
              disabled={loading || selectedChapters.size === 0}
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
                  Start Test
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
