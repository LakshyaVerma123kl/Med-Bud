"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import {
  Settings as SettingsIcon,
  User as UserIcon,
  LogOut,
  Trash2,
  RefreshCw,
  ShieldAlert,
  Smartphone,
  CheckCircle2,
  Download,
  Upload,
  Cloud,
  LogIn,
  Share2,
  Copy,
  MessageCircle,
  Check,
  FileText,
} from "lucide-react";
import { useSync } from "@/hooks/useSync";

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const { fetchRemoteData } = useSync();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [pasteInput, setPasteInput] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const getExportPayload = () => {
    return {
      app: "MedQuiz Pro",
      version: 1,
      exportedAt: new Date().toISOString(),
      data: {
        notes: JSON.parse(localStorage.getItem("medquiz_notes") || "{}"),
        customQuestions: JSON.parse(localStorage.getItem("medquiz_custom_questions") || "[]"),
        bookmarks: JSON.parse(localStorage.getItem("medquiz_bookmarks") || "[]"),
        progress: JSON.parse(localStorage.getItem("medquiz_progress") || "{}"),
        spacedRepetition: JSON.parse(localStorage.getItem("medquiz_sr_state") || "{}"),
        mnemonics: JSON.parse(localStorage.getItem("medquiz_mnemonics") || "{}"),
      },
    };
  };

  const handleCopyWhatsAppCode = async () => {
    try {
      const payload = getExportPayload();
      const jsonStr = JSON.stringify(payload);
      const code = btoa(encodeURIComponent(jsonStr));
      const questionsCount = payload.data.customQuestions.length;
      const notesCount = Object.keys(payload.data.notes).length;

      const shareText = `🩺 *MedQuiz Pro Study Deck*\n${questionsCount} custom MCQs • ${notesCount} high-yield notes\n\nTo load this in your app:\n1. Open MedQuiz Pro ➔ Settings\n2. Paste in "Load Study Deck":\n\nMEDQUIZ_${code}`;

      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareText);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = shareText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }

      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
      setMessage({
        type: "success",
        text: "Study Code copied! Paste it into your WhatsApp or Telegram study group.",
      });
    } catch (e) {
      console.error(e);
      setMessage({ type: "error", text: "Could not generate share code." });
    }
  };

  const handleDownloadStudyFile = () => {
    try {
      const payload = getExportPayload();
      const blob = new Blob([JSON.stringify(payload, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const dateStr = new Date().toISOString().split("T")[0];
      a.href = url;
      a.download = `MedQuiz-StudyDeck-${dateStr}.medquiz`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setMessage({ type: "success", text: "Study deck file (.medquiz) downloaded!" });
    } catch (e) {
      console.error(e);
      setMessage({ type: "error", text: "Failed to download study file." });
    }
  };

  const processImportPayload = (parsed: any) => {
    if (!parsed?.data) {
      throw new Error("Invalid study deck format");
    }
    const { notes, customQuestions, bookmarks, progress, spacedRepetition, mnemonics } = parsed.data;

    let restoredNotes = 0;
    let restoredQuestions = 0;

    // Smart merge notes
    if (notes && typeof notes === "object") {
      const existing = JSON.parse(localStorage.getItem("medquiz_notes") || "{}");
      const merged = { ...existing, ...notes };
      localStorage.setItem("medquiz_notes", JSON.stringify(merged));
      restoredNotes = Object.keys(notes).length;
    }

    // Smart merge custom questions without duplicates
    if (Array.isArray(customQuestions)) {
      const existing: any[] = JSON.parse(localStorage.getItem("medquiz_custom_questions") || "[]");
      const existingHashes = new Set(existing.map((q) => q.content_hash || q.id));
      const newQuestions = customQuestions.filter((q) => !existingHashes.has(q.content_hash || q.id));
      const merged = [...newQuestions, ...existing];
      localStorage.setItem("medquiz_custom_questions", JSON.stringify(merged));
      restoredQuestions = customQuestions.length;
    }

    // Merge bookmarks
    if (Array.isArray(bookmarks)) {
      const existing: string[] = JSON.parse(localStorage.getItem("medquiz_bookmarks") || "[]");
      const merged = Array.from(new Set([...existing, ...bookmarks]));
      localStorage.setItem("medquiz_bookmarks", JSON.stringify(merged));
    }

    if (progress && typeof progress === "object") {
      localStorage.setItem("medquiz_progress", JSON.stringify(progress));
    }
    if (spacedRepetition && typeof spacedRepetition === "object") {
      localStorage.setItem("medquiz_sr_state", JSON.stringify(spacedRepetition));
    }
    if (mnemonics && typeof mnemonics === "object") {
      const existing = JSON.parse(localStorage.getItem("medquiz_mnemonics") || "{}");
      localStorage.setItem("medquiz_mnemonics", JSON.stringify({ ...existing, ...mnemonics }));
    }

    return { restoredNotes, restoredQuestions };
  };

  const handleLoadPastedCode = () => {
    if (!pasteInput.trim()) return;
    try {
      const raw = pasteInput.trim();
      const match = raw.match(/MEDQUIZ_([A-Za-z0-9+/=]+)/);
      if (match) {
        const decoded = decodeURIComponent(atob(match[1]));
        const parsed = JSON.parse(decoded);
        const { restoredNotes, restoredQuestions } = processImportPayload(parsed);
        setMessage({
          type: "success",
          text: `Study deck loaded! Merged ${restoredQuestions} custom MCQs & ${restoredNotes} notes.`,
        });
        setPasteInput("");
        return;
      }

      // Fallback for raw JSON paste
      const parsed = JSON.parse(raw);
      const { restoredNotes, restoredQuestions } = processImportPayload(parsed);
      setMessage({
        type: "success",
        text: `Study deck loaded! Merged ${restoredQuestions} custom MCQs & ${restoredNotes} notes.`,
      });
      setPasteInput("");
    } catch (e) {
      console.error(e);
      setMessage({
        type: "error",
        text: "Could not read that study code. Make sure you copied the whole WhatsApp message.",
      });
    }
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        const { restoredNotes, restoredQuestions } = processImportPayload(parsed);

        setMessage({
          type: "success",
          text: `Study deck loaded from file! Merged ${restoredQuestions} MCQs & ${restoredNotes} notes.`,
        });
      } catch (err) {
        console.error(err);
        setMessage({
          type: "error",
          text: "Failed to read file. Please select a valid .medquiz study deck.",
        });
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  useEffect(() => {
    // Detect PWA Standalone status & iOS
    if (typeof window !== "undefined") {
      setIsStandalone(
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone === true
      );
      setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream);

      const handleBeforeInstall = (e: any) => {
        e.preventDefault();
        setDeferredPrompt(e);
      };
      window.addEventListener("beforeinstallprompt", handleBeforeInstall);
      return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    }
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) {
        setUser(null);
        setIsLoading(false);
        return;
      }
      setUser(session.user);

      if (session.user.user_metadata?.full_name) {
        setFullName(session.user.user_metadata.full_name);
      } else {
        const { data } = await supabase
          .from("user_profiles")
          .select("full_name")
          .eq("id", session.user.id)
          .single();
        if (data?.full_name) setFullName(data.full_name);
      }

      setIsLoading(false);
    });
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setMessage({ type: "success", text: "MedQuiz Pro installed successfully!" });
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setIsSaving(true);
    setMessage(null);
    try {
      const { error } = await supabase
        .from("user_profiles")
        .update({ full_name: fullName })
        .eq("id", user.id);

      if (error) throw error;
      setMessage({ type: "success", text: "Profile updated successfully." });
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: "Failed to update profile." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleForceSync = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      await fetchRemoteData();
      setMessage({ type: "success", text: "Data synchronized with cloud successfully." });
    } catch (error) {
      setMessage({ type: "error", text: "Sync failed. Check your network connection." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleClearLocal = () => {
    if (
      confirm(
        "Are you sure you want to clear local progress? This will reset your device's progress until you sync with the cloud again."
      )
    ) {
      localStorage.removeItem("medquiz_progress");
      localStorage.removeItem("medquiz_bookmarks");
      localStorage.removeItem("medquiz_sr_state");
      setMessage({ type: "success", text: "Local data cleared. Refresh to see reset metrics." });
    }
  };

  const handleDeleteAccount = async () => {
    if (
      confirm(
        "DANGER: Are you absolutely sure you want to permanently delete your account and all associated cloud data? This cannot be undone."
      )
    ) {
      setIsDeleting(true);
      try {
        const res = await fetch("/api/auth/delete-account", { method: "POST" });
        if (!res.ok) throw new Error("Deletion failed");

        await supabase.auth.signOut();
        router.push("/");
      } catch (error) {
        console.error(error);
        alert("Failed to delete account. Please try again.");
        setIsDeleting(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-muted-foreground text-sm font-medium">
        Loading settings...
      </div>
    );
  }

  const avatarUrl = user?.user_metadata?.avatar_url;

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
          <SettingsIcon className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">Settings & Preferences</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">Manage your account, device storage, and PWA settings.</p>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 mb-8 rounded-xl font-medium text-sm flex items-center gap-2 ${
            message.type === "error" ? "bg-error/10 text-error border border-error/20" : "bg-primary/10 text-primary border border-primary/20"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="space-y-6">
        {/* Account / Guest Profile Section */}
        {user ? (
          <section className="clean-card rounded-2xl p-6 sm:p-8">
            <h2 className="text-base font-bold text-foreground mb-6 flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-primary" />
              Profile Information
            </h2>
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              <div className="shrink-0">
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarUrl} alt="Avatar" className="w-20 h-20 rounded-full border-2 border-primary/30 shadow-md object-cover" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20 shadow-md text-primary">
                    <UserIcon className="w-8 h-8" />
                  </div>
                )}
              </div>
              <div className="flex-1 w-full space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">
                    Email
                  </label>
                  <input
                    type="text"
                    disabled
                    value={user.email || ""}
                    className="w-full px-4 py-2 rounded-xl border border-border bg-muted/40 text-muted-foreground text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full px-4 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary focus:outline-none transition-all text-sm font-medium"
                  />
                </div>
                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="bg-primary text-primary-foreground px-5 py-2 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save Profile"}
                </button>
              </div>
            </div>
          </section>
        ) : (
          <section className="clean-card rounded-2xl p-6 sm:p-8 border-primary/30 bg-primary/5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold uppercase tracking-wider mb-2">
                  <Cloud className="w-3.5 h-3.5" /> Guest Mode Active
                </span>
                <h2 className="text-lg font-bold text-foreground">Studying without an account</h2>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-md leading-relaxed">
                  Your quizzes, bookmarks, and spaced repetition metrics are safely stored on this device. Sign in with Google to enable automatic cloud backup across your phone, tablet, and laptop.
                </p>
              </div>
              <Link
                href="/login"
                className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all shadow-sm"
              >
                <LogIn className="w-4 h-4" />
                Sign In with Google
              </Link>
            </div>
          </section>
        )}

        {/* PWA & Device Status Section */}
        <section className="clean-card rounded-2xl p-6 sm:p-8">
          <h2 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-primary" />
            PWA & App Installation
          </h2>
          <div className="p-4 rounded-xl border border-border bg-muted/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-foreground">Application Status:</span>
                {isStandalone ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Installed (Standalone Mode)
                  </span>
                ) : (
                  <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full border border-border">
                    Running in Browser
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {isStandalone
                  ? "You are running the full-screen Progressive Web App with offline textbook access."
                  : "Install MedQuiz Pro to your home screen or dock for an immersive, distraction-free study experience."}
              </p>
            </div>

            {!isStandalone && deferredPrompt && (
              <button
                onClick={handleInstallClick}
                className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary/90 transition-colors shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                Install MedQuiz Pro
              </button>
            )}

            {!isStandalone && isIOS && (
              <div className="text-xs text-muted-foreground bg-background/80 p-2.5 rounded-lg border border-border/60">
                <span className="font-semibold text-foreground">On iPad/iPhone:</span> Tap{" "}
                <Share2 className="inline w-3.5 h-3.5 text-primary mx-0.5" /> Share ➔{" "}
                <span className="font-semibold text-foreground">Add to Home Screen</span>.
              </div>
            )}
          </div>
        </section>

        {/* Study Decks & Classmate Sharing Section */}
        <section className="clean-card rounded-2xl p-6 sm:p-8">
          <h2 className="text-base font-bold text-foreground mb-1 flex items-center gap-2">
            <Share2 className="w-4 h-4 text-primary" />
            Study Decks & Classmate Sharing
          </h2>
          <p className="text-xs text-muted-foreground mb-5 leading-relaxed">
            Share your custom questions and high-yield notes with your batchmates on WhatsApp, or save an offline study file.
          </p>

          {/* Hidden file input for .medquiz or JSON import */}
          <input
            type="file"
            ref={fileInputRef}
            accept=".medquiz,.json,application/json"
            onChange={handleImportFile}
            className="hidden"
          />

          <div className="grid sm:grid-cols-2 gap-4">
            {/* Share Deck Card */}
            <div className="p-4 rounded-xl border border-border bg-muted/20 flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-sm mb-1 text-foreground flex items-center gap-1.5">
                  <MessageCircle className="w-4 h-4 text-emerald-500" />
                  Share with Batchmates
                </h3>
                <p className="text-xs text-muted-foreground mb-4">
                  Copies a formatted text code you can send directly in your WhatsApp or Telegram study groups.
                </p>
              </div>
              <div className="space-y-2">
                <button
                  onClick={handleCopyWhatsAppCode}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 active:scale-[0.98]"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <MessageCircle className="w-4 h-4" />
                      <span>Copy WhatsApp Study Code</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleDownloadStudyFile}
                  className="w-full bg-background border border-border hover:bg-muted text-xs font-semibold py-2 px-3 rounded-xl transition-colors flex items-center justify-center gap-1.5 text-muted-foreground hover:text-foreground"
                >
                  <Download className="w-3.5 h-3.5" />
                  Save .medquiz Study File
                </button>
              </div>
            </div>

            {/* Load Deck Card */}
            <div className="p-4 rounded-xl border border-border bg-muted/20 flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-sm mb-1 text-foreground flex items-center gap-1.5">
                  <Upload className="w-4 h-4 text-violet-500" />
                  Load Deck from Classmate
                </h3>
                <p className="text-xs text-muted-foreground mb-3">
                  Paste the message from WhatsApp, or load a shared study file.
                </p>

                <div className="flex gap-1.5 mb-2">
                  <input
                    type="text"
                    value={pasteInput}
                    onChange={(e) => setPasteInput(e.target.value)}
                    placeholder="Paste WhatsApp code here..."
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary min-w-0"
                  />
                  <button
                    onClick={handleLoadPastedCode}
                    disabled={!pasteInput.trim()}
                    className="px-3 py-2 rounded-xl bg-primary text-white text-xs font-bold shrink-0 disabled:opacity-50 hover:bg-primary/90 transition-colors"
                  >
                    Load
                  </button>
                </div>
              </div>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-background border border-border hover:bg-muted text-xs font-semibold py-2 px-3 rounded-xl transition-colors flex items-center justify-center gap-1.5 text-muted-foreground hover:text-foreground"
              >
                <FileText className="w-3.5 h-3.5 text-violet-500" />
                Pick .medquiz Study File
              </button>
            </div>

            {/* Cloud Sync (if logged in) */}
            {user && (
              <div className="p-4 rounded-xl border border-border bg-muted/20 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-sm mb-1 text-foreground flex items-center gap-1.5">
                    <Cloud className="w-3.5 h-3.5 text-blue-500" />
                    Cloud Sync
                  </h3>
                  <p className="text-xs text-muted-foreground mb-4">Pull latest cloud stats and merge with this device.</p>
                </div>
                <button
                  onClick={handleForceSync}
                  disabled={isSaving}
                  className="w-full bg-background border border-border hover:bg-muted text-xs font-semibold py-2 rounded-xl transition-colors disabled:opacity-50"
                >
                  {isSaving ? "Syncing..." : "Sync Cloud Now"}
                </button>
              </div>
            )}

            {/* Reset Study Progress */}
            <div className={`p-4 rounded-xl border border-border bg-muted/20 flex flex-col justify-between ${!user ? "" : ""}`}>
              <div>
                <h3 className="font-semibold text-sm mb-1 text-foreground">Reset Quiz Progress</h3>
                <p className="text-xs text-muted-foreground mb-4">
                  Resets practice scores and spaced repetition timers on this device. Your custom questions & notes remain safe.
                </p>
              </div>
              <button
                onClick={handleClearLocal}
                className="w-full bg-background border border-border hover:bg-rose-500/10 hover:text-rose-600 hover:border-rose-500/30 text-xs font-semibold py-2 rounded-xl transition-colors"
              >
                Reset Progress Only
              </button>
            </div>
          </div>
        </section>

        {/* Danger Zone (Logged in users only) */}
        {user && (
          <section className="clean-card rounded-2xl p-6 sm:p-8 border-error/20 bg-error/5">
            <h2 className="text-base font-bold text-error mb-2 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" />
              Danger Zone
            </h2>
            <p className="text-xs text-error/80 mb-4 leading-relaxed">
              Permanently delete your account and all associated cloud data (progress, bookmarks, custom quizzes). This action cannot be undone.
            </p>
            <button
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="inline-flex items-center gap-2 bg-error text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-error/90 transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {isDeleting ? "Deleting..." : "Permanently Delete Account"}
            </button>
          </section>
        )}

        {/* Sign Out (Logged in users) */}
        {user && (
          <div className="pt-2 flex justify-end">
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                setUser(null);
                setMessage({ type: "success", text: "Signed out successfully." });
              }}
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm font-semibold px-4 py-2 rounded-xl hover:bg-muted transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
