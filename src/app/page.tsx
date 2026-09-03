"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen,
  Brain,
  Trophy,
  Zap,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  GraduationCap,
  ChevronRight,
  CheckCircle2
} from "lucide-react";
import { books } from "@/lib/data/books";
import { seedQuestions } from "@/lib/data/seed-questions";
import { narayanReddyChapters, parkChapters } from "@/lib/data/chapters";
import { PDFUploader } from "@/components/pdf/PDFUploader";

export default function HomePage() {
  const totalQuestions = seedQuestions.length;
  const totalChapters = narayanReddyChapters.length + parkChapters.length;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* ── Hero Section ────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border/60 py-16 sm:py-24">
        {/* Subtle background glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-primary/10 dark:bg-primary/15 rounded-full blur-[120px]" />
          <div className="absolute top-20 right-10 w-[350px] h-[350px] bg-accent/10 dark:bg-accent/10 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
          {/* Top Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs sm:text-sm font-semibold mb-6"
          >
            <Sparkles className="w-4 h-4" />
            <span>Forensic Medicine & Community Medicine • High-Yield Q-Bank</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15] mb-6"
          >
            Master Medical Knowledge with{" "}
            <span className="text-primary bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 bg-clip-text text-transparent">
              Textbook Accuracy
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed font-normal"
          >
            Practice chapter-wise authentic MCQs from <strong className="text-foreground font-semibold">K.S. Narayan Reddy</strong> and{" "}
            <strong className="text-foreground font-semibold">Park&apos;s PSM</strong>. Every question includes clinical rationale,
            textbook citations, and instant performance feedback.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14"
          >
            <Link
              href="#textbooks"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-primary text-white font-semibold text-base shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all hover:-translate-y-1"
            >
              Choose a Textbook
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-card border border-border text-foreground font-semibold text-base shadow-sm hover:bg-muted transition-all hover:-translate-y-1"
            >
              <Trophy className="w-4 h-4 text-amber-500" />
              View Your Dashboard
            </Link>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto"
          >
            {[
              { label: "Standard Chapters", value: totalChapters.toString(), icon: BookOpen, color: "text-blue-500" },
              { label: "Verified Questions", value: `${totalQuestions}+`, icon: ShieldCheck, color: "text-emerald-500" },
              { label: "Standard Textbooks", value: "2", icon: GraduationCap, color: "text-indigo-500" },
              { label: "Exam-Oriented", value: "100%", icon: Zap, color: "text-amber-500" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="clean-card rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-center text-center"
              >
                <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
                <span className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">{stat.value}</span>
                <span className="text-xs text-muted-foreground font-medium mt-1">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── PDF Upload Section ────────────────────────────────────────── */}
      <section className="py-12 bg-muted/20 border-b border-border/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 w-full">
          <PDFUploader />
        </div>
      </section>

      {/* ── Textbook Selection Section ──────────────────────────────────── */}
      <section id="textbooks" className="py-16 sm:py-20 max-w-6xl mx-auto px-4 sm:px-6 w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-3">
            Select Your Subject
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            Pick a textbook to access its complete chapter syllabus. All questions are aligned with standard Indian medical curricula.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {books.map((book) => {
            const isReddy = book.id === "narayan_reddy";
            const chapterList = isReddy ? narayanReddyChapters : parkChapters;

            return (
              <div
                key={book.id}
                className="clean-card rounded-3xl overflow-hidden flex flex-col border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group"
              >
                {/* Header Band */}
                <div
                  className={`p-6 sm:p-8 ${
                    isReddy
                      ? "bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white"
                      : "bg-gradient-to-br from-teal-900 via-emerald-950 to-slate-900 text-white"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-4xl sm:text-5xl">{book.icon}</span>
                    <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-white/15 border border-white/20 text-white">
                      {book.chapterCount} Chapters
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-1">
                    {book.subject}
                  </h3>
                  <p className="text-white/80 text-sm font-medium">{book.author}</p>
                </div>

                {/* Body Content */}
                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {book.description}
                  </p>

                  {/* Highlights */}
                  <div className="space-y-2.5 pt-2 border-t border-border">
                    <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{isReddy ? "Thanatology, Injuries, Asphyxia, Toxicology & Jurisprudence" : "Epidemiology, UIP, MCH, Screening, Communicable & NCDs"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{chapterList.length} Chapters with instant feedback & explanation</span>
                    </div>
                  </div>

                  {/* Button */}
                  <Link
                    href={`/book/${book.id}`}
                    className="w-full inline-flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-primary text-white font-semibold text-base hover:bg-primary/90 transition-all shadow-md group-hover:shadow-primary/25"
                  >
                    Browse Chapters ({book.chapterCount})
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Key Features ────────────────────────────────────────────────── */}
      <section className="border-t border-border/60 bg-muted/30 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-2">
              Why Medical Students Choose MedQuiz
            </h3>
            <p className="text-sm sm:text-base text-muted-foreground">
              Designed specifically for MBBS profs and competitive PG entrance preparation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="clean-card rounded-2xl p-6">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4 font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-foreground mb-2">Verified Accuracy</h4>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Zero hallucinated facts or made-up questions. All content cites classic criteria from Reddy and Park.
              </p>
            </div>

            <div className="clean-card rounded-2xl p-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4 font-bold">
                <Brain className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-foreground mb-2">Detailed Explanations</h4>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Every question reveals why the correct answer is right and highlights high-yield facts to retain.
              </p>
            </div>

            <div className="clean-card rounded-2xl p-6">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-4 font-bold">
                <Trophy className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-foreground mb-2">Chapter Mastery & Weak Areas</h4>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Track your accuracy across all 43 chapters, earn milestone badges, and quickly revise low-scoring topics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="mt-auto border-t border-border py-8 text-center text-xs text-muted-foreground">
        <div className="max-w-5xl mx-auto px-4">
          <p>MedQuiz Pro • Standard Reference Medical Quiz System</p>
          <p className="mt-1">Based on K.S. Narayan Reddy (Forensic Medicine) and K. Park (Preventive & Social Medicine).</p>
        </div>
      </footer>
    </div>
  );
}
