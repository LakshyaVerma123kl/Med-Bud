"use client";

import { useState } from "react";
import { Send, CheckCircle, AlertCircle, Loader2, MessageSquareHeart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function FeedbackForm() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.message.trim()) return;

    setStatus("loading");

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to send feedback");
      }

      setStatus("success");
      setFormData({ name: "", email: "", message: "" });

      // Reset success state after 5 seconds
      setTimeout(() => setStatus("idle"), 5000);
    } catch (err: any) {
      console.error(err);
      setStatus("error");
      setErrorMessage(err.message || "An unexpected error occurred.");
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto clean-card rounded-3xl p-6 sm:p-8 bg-card border border-border">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <MessageSquareHeart className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">Have Feedback?</h2>
          <p className="text-xs text-muted-foreground">We'd love to hear what features you need next.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground ml-1">Name (Optional)</label>
            <input
              type="text"
              placeholder="Dr. Smith"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground ml-1">Email (Optional)</label>
            <input
              type="email"
              placeholder="smith@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground ml-1">Your Message <span className="text-error">*</span></label>
          <textarea
            required
            rows={4}
            placeholder="I'd love to see a flashcard feature..."
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full px-4 py-3 bg-background border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={status === "loading" || !formData.message.trim()}
          className="w-full py-3.5 rounded-xl bg-primary text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-70"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              Send Feedback
              <Send className="w-4 h-4" />
            </>
          )}
        </button>

        <AnimatePresence mode="wait">
          {status === "success" && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              className="flex items-center gap-2 p-3 mt-4 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold overflow-hidden"
            >
              <CheckCircle className="w-4 h-4" />
              Thank you! Your feedback has been sent directly to the developer.
            </motion.div>
          )}
          {status === "error" && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              className="flex items-center gap-2 p-3 mt-4 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-semibold overflow-hidden"
            >
              <AlertCircle className="w-4 h-4" />
              {errorMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}
