"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/lib/supabase";
import { useTheme } from "next-themes";
import { Cloud, Smartphone, Sparkles, ArrowLeft, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const [origin, setOrigin] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }

    // Check if user is already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace("/dashboard");
      }
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        router.replace("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="w-full max-w-md space-y-6">
        {/* Main Card */}
        <div className="clean-card rounded-3xl p-8 sm:p-10 shadow-lg border border-border/80">
          <div className="flex flex-col items-center text-center">
            {/* Logo */}
            <div className="w-14 h-14 rounded-2xl overflow-hidden border border-border/60 shadow-md mb-4 bg-primary/10 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icon.png" alt="MedQuiz Pro" className="w-full h-full object-cover" />
            </div>

            <h1 className="text-2xl font-serif font-bold text-foreground tracking-tight">
              Sign In to MedQuiz Pro
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground max-w-xs leading-relaxed">
              Connect your Google account to sync bookmarks, SM-2 spaced repetition, and quiz scores across all devices.
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-2 gap-2.5 my-6 p-3.5 rounded-2xl bg-muted/40 border border-border/50 text-xs">
            <div className="flex items-center gap-2 text-foreground font-medium">
              <Cloud className="w-4 h-4 text-primary shrink-0" />
              <span>Cloud Sync</span>
            </div>
            <div className="flex items-center gap-2 text-foreground font-medium">
              <Smartphone className="w-4 h-4 text-primary shrink-0" />
              <span>PWA Ready</span>
            </div>
            <div className="flex items-center gap-2 text-foreground font-medium">
              <Sparkles className="w-4 h-4 text-accent shrink-0" />
              <span>Smart Revision</span>
            </div>
            <div className="flex items-center gap-2 text-foreground font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Local-First</span>
            </div>
          </div>

          {/* Supabase Auth UI with corrected CSS variables */}
          <div className="mt-6">
            <Auth
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: 'var(--primary)',
                      brandAccent: 'var(--primary)',
                      brandButtonText: '#ffffff',
                      inputText: 'var(--foreground)',
                      inputBackground: 'var(--card)',
                      inputBorder: 'var(--border)',
                      inputBorderHover: 'var(--primary)',
                      inputBorderFocus: 'var(--ring)',
                      dividerBackground: 'var(--border)',
                    },
                    space: {
                      buttonPadding: '12px 16px',
                      inputPadding: '12px 16px',
                    },
                    radii: {
                      borderRadiusButton: '12px',
                      buttonBorderRadius: '12px',
                      inputBorderRadius: '12px',
                    },
                  },
                },
                className: {
                  container: 'auth-container',
                  button: 'auth-button min-h-[46px] font-semibold text-sm transition-all active:scale-[0.99]',
                  input: 'auth-input min-h-[46px] text-sm',
                }
              }}
              theme={theme === 'dark' ? 'dark' : 'default'}
              providers={['google']}
              redirectTo={origin ? `${origin}/auth/callback` : undefined}
            />
          </div>

          {/* Guest / Return Option */}
          <div className="mt-6 pt-6 border-t border-border/50 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors py-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Continue as Guest (No sign-in required)</span>
            </Link>
          </div>
        </div>

        {/* Security / Privacy Footer */}
        <p className="text-center text-[11px] text-muted-foreground/80">
          MedQuiz Pro respects your privacy. All study statistics can be backed up or cleared anytime in Settings.
        </p>
      </div>
    </div>
  );
}
