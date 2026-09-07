"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function handleAuth() {
      try {
        if (typeof window === "undefined") return;

        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        const errorDesc = params.get("error_description") || params.get("error");

        if (errorDesc) {
          if (isMounted) setAuthError(errorDesc);
          return;
        }

        // Handle modern PKCE code exchange flow
        if (code) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            console.error("Auth exchange error:", error);
            if (isMounted) setAuthError(error.message);
            return;
          }
          if (data.session && isMounted) {
            router.replace("/dashboard");
            return;
          }
        }

        // Fallback for implicit hash fragments (#access_token=...)
        const { data: { session } } = await supabase.auth.getSession();
        if (session && isMounted) {
          router.replace("/dashboard");
          return;
        }

        // Listen for auth state change
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          if (event === "SIGNED_IN" && session && isMounted) {
            router.replace("/dashboard");
          }
        });

        // Timeout fallback after 6s to avoid infinite spinner
        const timer = setTimeout(() => {
          if (isMounted) {
            supabase.auth.getSession().then(({ data: { session } }) => {
              if (session) {
                router.replace("/dashboard");
              } else {
                setAuthError("Authentication timed out. Please try logging in again.");
              }
            });
          }
        }, 6000);

        return () => {
          subscription.unsubscribe();
          clearTimeout(timer);
        };
      } catch (err: any) {
        console.error("Callback error:", err);
        if (isMounted) setAuthError(err.message || "An unexpected error occurred during sign-in.");
      }
    }

    handleAuth();

    return () => {
      isMounted = false;
    };
  }, [router]);

  if (authError) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
        <div className="clean-card rounded-2xl p-8 max-w-md w-full text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Sign In Incomplete</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {authError}
          </p>
          <div className="pt-2">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-9 h-9 animate-spin text-primary" />
        <p className="text-base font-semibold text-foreground tracking-tight">Completing sign-in...</p>
        <p className="text-xs text-muted-foreground">Securing your session & syncing medical progress</p>
      </div>
    </div>
  );
}
