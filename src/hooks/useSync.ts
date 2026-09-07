"use client";

import { useEffect, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";

// Debounce helper
function debounce<T extends (...args: any[]) => void>(func: T, wait: number): T {
  let timeout: NodeJS.Timeout;
  return ((...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  }) as T;
}

export function useSync() {
  const syncProgressToCloud = useCallback(
    debounce(async (progress: any) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      try {
        await supabase
          .from("user_profiles")
          .update({ progress, updated_at: new Date().toISOString() })
          .eq("id", session.user.id);
      } catch (err) {
        console.error("Failed to sync progress to cloud", err);
      }
    }, 2000),
    []
  );

  const syncBookmarksToCloud = useCallback(
    debounce(async (bookmarks: string[]) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      try {
        await supabase
          .from("user_profiles")
          .update({ bookmarks, updated_at: new Date().toISOString() })
          .eq("id", session.user.id);
      } catch (err) {
        console.error("Failed to sync bookmarks to cloud", err);
      }
    }, 2000),
    []
  );

  const syncSpacedRepetitionToCloud = useCallback(
    debounce(async (spaced_repetition: any) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      try {
        await supabase
          .from("user_profiles")
          .update({ spaced_repetition, updated_at: new Date().toISOString() })
          .eq("id", session.user.id);
      } catch (err) {
        console.error("Failed to sync SR data to cloud", err);
      }
    }, 2000),
    []
  );

  // Helper to fetch remote data on login
  const fetchRemoteData = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return null;

    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("progress, bookmarks, spaced_repetition")
        .eq("id", session.user.id)
        .single();
        
      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Failed to fetch remote data", err);
      return null;
    }
  }, []);

  return {
    syncProgressToCloud,
    syncBookmarksToCloud,
    syncSpacedRepetitionToCloud,
    fetchRemoteData,
  };
}
