"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useSync } from "./useSync";

const BOOKMARKS_KEY = "medquiz_bookmarks";

export function useBookmarks() {
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);
  const { syncBookmarksToCloud, fetchRemoteData } = useSync();

  useEffect(() => {
    let currentBookmarks = new Set<string>();
    try {
      const stored = localStorage.getItem(BOOKMARKS_KEY);
      if (stored) {
        currentBookmarks = new Set(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load bookmarks from localStorage", e);
    }
    setBookmarkedIds(currentBookmarks);
    setIsLoaded(true);

    const initRemoteSync = async () => {
      const remote = await fetchRemoteData();
      if (remote?.bookmarks && Array.isArray(remote.bookmarks)) {
        // Merge bookmarks
        const merged = new Set([...Array.from(currentBookmarks), ...remote.bookmarks]);
        setBookmarkedIds(merged);
        try {
          localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(Array.from(merged)));
        } catch {}
      }
    };

    initRemoteSync();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        initRemoteSync();
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchRemoteData]);

  const toggleBookmark = useCallback((questionId: string) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) {
        next.delete(questionId);
      } else {
        next.add(questionId);
      }
      
      // Save to localStorage
      try {
        const arr = Array.from(next);
        localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(arr));
        syncBookmarksToCloud(arr);
      } catch (err) {
        console.error("Failed to save bookmarks", err);
      }
      
      return next;
    });
  }, [syncBookmarksToCloud]);

  const isBookmarked = useCallback(
    (questionId: string) => bookmarkedIds.has(questionId),
    [bookmarkedIds]
  );

  return {
    bookmarkedIds: Array.from(bookmarkedIds),
    toggleBookmark,
    isBookmarked,
    isLoaded,
  };
}
