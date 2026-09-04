"use client";

import { useState, useEffect, useCallback } from "react";

const BOOKMARKS_KEY = "medquiz_bookmarks";

export function useBookmarks() {
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(BOOKMARKS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setBookmarkedIds(new Set(parsed));
        }
      }
    } catch (err) {
      console.error("Failed to parse bookmarks", err);
    }
    setIsLoaded(true);
  }, []);

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
        localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(Array.from(next)));
      } catch (err) {
        console.error("Failed to save bookmark", err);
      }
      
      return next;
    });
  }, []);

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
