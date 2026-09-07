"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  ChevronRight,
  Timer,
  Trophy,
  BookOpen
} from "lucide-react";
import { books } from "@/lib/data/books";
import { seedQuestions } from "@/lib/data/seed-questions";
import { narayanReddyChapters, parkChapters } from "@/lib/data/chapters";
import { PDFUploader } from "@/components/pdf/PDFUploader";
import { PDFLibrary } from "@/components/pdf/PDFLibrary";

export default function HomePage() {
  const totalQuestions = seedQuestions.length;
  const totalChapters = narayanReddyChapters.length + parkChapters.length;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* ── Hero Section ────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border py-20 sm:py-32">
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
          
          {/* Top Label */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center text-[11px] sm:text-xs font-bold tracking-[0.15em] uppercase text-accent mb-6"
          >
            Textbook-Based Medical Practice
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-foreground leading-[1.15] mb-8"
          >
            Master Medical Knowledge <br className="hidden sm:block" />
            <span className="italic text-primary">with Textbook Accuracy.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Practice chapter-wise authentic MCQs from K.S. Narayan Reddy and Park&apos;s PSM. 
            Every question includes clinical rationale, textbook citations, and instant performance feedback.
          </motion.p>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-16"
          >
            <Link
              href="#textbooks"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-primary text-primary-foreground font-semibold text-sm transition-colors hover:bg-primary/90"
            >
              Choose a Textbook
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/mock-exam"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-transparent border border-border text-foreground font-semibold text-sm transition-colors hover:bg-muted"
            >
              <Timer className="w-4 h-4 text-primary" />
              Grand Mock Exam
            </Link>
            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-transparent text-foreground font-semibold text-sm transition-colors hover:text-primary"
            >
              <Trophy className="w-4 h-4 text-accent" />
              Dashboard
            </Link>
          </motion.div>

          {/* Academic Metric Strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 max-w-4xl mx-auto border-t border-border pt-8"
          >
            {[
              { label: "CHAPTERS", value: totalChapters.toString() },
              { label: "VERIFIED MCQS", value: `${totalQuestions}+` },
              { label: "TEXTBOOKS", value: "2" },
              { label: "EXAM-ORIENTED", value: "100%" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center">
                <span className="text-2xl sm:text-3xl font-serif font-bold text-foreground mb-1">{stat.value}</span>
                <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Textbook Selection Section ──────────────────────────────────── */}
      <section id="textbooks" className="py-20 max-w-5xl mx-auto px-4 sm:px-6 w-full">
        <div className="mb-12 border-b border-border pb-4">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
            Reference Library
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {books.map((book, idx) => (
            <Link
              key={book.id}
              href={`/book/${book.id}`}
              className="group block p-6 sm:p-8 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors"
            >
              <div className="flex flex-col h-full">
                <div className="mb-6">
                  <span className="inline-block px-2.5 py-1 rounded bg-accent/10 text-accent text-[10px] font-bold tracking-wider uppercase mb-4">
                    {book.id === "narayan_reddy" ? "Forensic Medicine" : "Community Medicine"}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {book.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {book.description}
                  </p>
                </div>
                
                <div className="mt-auto pt-6 border-t border-border/50 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                    <BookOpen className="w-4 h-4" />
                    {book.chapterCount} Chapters
                  </div>
                  <div className="flex items-center gap-1.5 text-sm font-semibold text-primary">
                    Browse <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── PDF Upload Section ────────────────────────────────────────── */}
      <section className="py-20 bg-secondary/50 border-y border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 w-full">
          <PDFUploader />
        </div>
      </section>

      {/* ── Community PDF Quizzes ─────────────────────────────────────── */}
      <div className="py-10">
        <PDFLibrary />
      </div>

    </div>
  );
}
