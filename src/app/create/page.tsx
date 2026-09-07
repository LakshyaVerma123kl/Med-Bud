"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Edit3,
  Eye,
  CheckCircle2,
  XCircle,
  Lightbulb,
  PenLine,
  Save,
  RotateCcw,
  Play,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCustomQuestions, CustomQuestionInput } from "@/hooks/useCustomQuestions";
import { Difficulty } from "@/lib/types";

const EMPTY_FORM: CustomQuestionInput = {
  question: "",
  options: ["", "", "", ""],
  correct_index: 0,
  explanation: "",
  difficulty: "medium",
  topic: "",
};

export default function CreatePage() {
  const { questions, addQuestion, editQuestion, deleteQuestion, getAll } = useCustomQuestions();
  const [form, setForm] = useState<CustomQuestionInput>({ ...EMPTY_FORM });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [preview, setPreview] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const allQuestions = getAll();

  const updateOption = (index: number, value: string) => {
    const newOptions = [...form.options] as [string, string, string, string];
    newOptions[index] = value;
    setForm((prev) => ({ ...prev, options: newOptions }));
  };

  const isValid =
    form.question.trim().length >= 10 &&
    form.options.every((opt) => opt.trim().length > 0) &&
    form.explanation.trim().length >= 5;

  const handleSubmit = (andAnother: boolean) => {
    if (!isValid) return;

    if (editingId) {
      editQuestion(editingId, form);
      setEditingId(null);
    } else {
      addQuestion(form);
    }

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);

    if (andAnother) {
      setForm({ ...EMPTY_FORM });
    } else {
      setForm({ ...EMPTY_FORM });
    }
  };

  const startEdit = (id: string) => {
    const q = questions.find((q) => q.id === id);
    if (!q) return;
    setForm({
      question: q.question,
      options: [q.options[0], q.options[1], q.options[2], q.options[3]] as [string, string, string, string],
      correct_index: q.correct_index,
      explanation: q.explanation,
      difficulty: q.difficulty,
      topic: q.topic || "",
    });
    setEditingId(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setForm({ ...EMPTY_FORM });
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link
            href="/dashboard"
            className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground flex items-center gap-2">
              <PenLine className="w-6 h-6 text-primary" />
              Create Your Own MCQs
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Self-testing is one of the most effective study techniques. Create questions to reinforce what you&apos;ve learned.
            </p>
          </div>
        </div>

        {/* Success Toast */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 rounded-xl bg-primary/10 border border-primary/20 text-primary text-sm font-semibold flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              {editingId ? "Question updated!" : "Question saved!"}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form Card */}
        <div className="clean-card rounded-2xl p-6 sm:p-8 mb-8">
          <h2 className="text-base font-bold text-foreground mb-6 flex items-center gap-2">
            {editingId ? (
              <>
                <Edit3 className="w-4 h-4 text-amber-500" />
                Editing Question
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 text-primary" />
                New Question
              </>
            )}
          </h2>

          {/* Question */}
          <div className="mb-5">
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
              Question Text *
            </label>
            <textarea
              value={form.question}
              onChange={(e) => setForm((prev) => ({ ...prev, question: e.target.value }))}
              placeholder="e.g., Which of the following is the most reliable sign of death?"
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none resize-none transition-all"
            />
          </div>

          {/* Options */}
          <div className="mb-5">
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
              Answer Options * (select the correct one)
            </label>
            <div className="space-y-3">
              {form.options.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, correct_index: idx }))}
                    className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
                      form.correct_index === idx
                        ? "bg-success text-success-foreground shadow-sm"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                    title={form.correct_index === idx ? "Correct answer" : "Mark as correct"}
                  >
                    {form.correct_index === idx ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      String.fromCharCode(65 + idx)
                    )}
                  </button>
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => updateOption(idx, e.target.value)}
                    placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none transition-all"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Explanation */}
          <div className="mb-5">
            <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
              Explanation / Rationale *
            </label>
            <textarea
              value={form.explanation}
              onChange={(e) => setForm((prev) => ({ ...prev, explanation: e.target.value }))}
              placeholder="Why is this the correct answer? Include textbook references if possible."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none resize-none transition-all"
            />
          </div>

          {/* Difficulty & Topic */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                Difficulty
              </label>
              <select
                value={form.difficulty}
                onChange={(e) => setForm((prev) => ({ ...prev, difficulty: e.target.value as Difficulty }))}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none transition-all"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                Topic (optional)
              </label>
              <input
                type="text"
                value={form.topic}
                onChange={(e) => setForm((prev) => ({ ...prev, topic: e.target.value }))}
                placeholder="e.g., Rigor Mortis"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Preview Toggle */}
          <AnimatePresence>
            {preview && isValid && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6"
              >
                <div className="p-5 rounded-xl border border-primary/30 bg-primary/5">
                  <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-3">Preview</h3>
                  <p className="text-base font-bold text-foreground mb-4">{form.question}</p>
                  <div className="space-y-2">
                    {form.options.map((opt, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border text-sm ${
                          idx === form.correct_index
                            ? "bg-success/10 border-success/30 text-success font-semibold"
                            : "bg-card border-border text-foreground"
                        }`}
                      >
                        <span className="font-bold">{String.fromCharCode(65 + idx)}.</span>
                        <span>{opt}</span>
                        {idx === form.correct_index && (
                          <CheckCircle2 className="w-4 h-4 ml-auto shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 rounded-lg bg-muted/50 border border-border text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5 font-bold text-foreground mb-1">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                      <span>Explanation</span>
                    </div>
                    <p>{form.explanation}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setPreview(!preview)}
              disabled={!isValid}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card text-sm font-semibold text-foreground hover:bg-muted transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Eye className="w-4 h-4" />
              {preview ? "Hide Preview" : "Preview"}
            </button>

            <button
              onClick={() => handleSubmit(true)}
              disabled={!isValid}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {editingId ? "Update" : "Save & Create Another"}
            </button>

            {editingId && (
              <button
                onClick={cancelEdit}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
              >
                <XCircle className="w-4 h-4" />
                Cancel Edit
              </button>
            )}
          </div>
        </div>

        {/* Existing Questions List */}
        {allQuestions.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground">
                Your Custom Questions ({allQuestions.length})
              </h2>
              {allQuestions.length >= 2 && (
                <Link
                  href="/custom-quiz"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-all shadow-sm"
                >
                  <Play className="w-3.5 h-3.5" />
                  Quiz Yourself
                </Link>
              )}
            </div>

            <div className="space-y-3">
              {allQuestions.map((q, idx) => (
                <div
                  key={q.id}
                  className="clean-card rounded-xl p-4 sm:p-5"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        #{allQuestions.length - idx}
                        {q.topic && ` • ${q.topic}`}
                      </span>
                      <p className="text-sm font-semibold text-foreground mt-0.5 line-clamp-2 leading-snug">
                        {q.question}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          q.difficulty === "easy"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : q.difficulty === "medium"
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                            : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                        }`}
                      >
                        {q.difficulty}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <CheckCircle2 className="w-3 h-3 text-success" />
                    <span className="font-medium">{q.options[q.correct_index]}</span>
                  </div>

                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() => startEdit(q.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 transition-colors"
                    >
                      <Edit3 className="w-3 h-3" />
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (confirm("Delete this question?")) {
                          deleteQuestion(q.id);
                        }
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-muted-foreground hover:text-error hover:bg-error/10 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
