"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useSync } from "./useSync";

const SR_KEY = "medquiz_spaced_repetition";

export interface SRItem {
  id: string; // Question ID
  interval: number; // Days until next review
  repetitions: number;
  easeFactor: number;
  nextReviewDate: string; // ISO string
}

export function useSpacedRepetition() {
  const [items, setItems] = useState<Record<string, SRItem>>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const { syncSpacedRepetitionToCloud, fetchRemoteData } = useSync();

  useEffect(() => {
    let currentItems: Record<string, SRItem> = {};
    try {
      const stored = localStorage.getItem(SR_KEY);
      if (stored) {
        currentItems = JSON.parse(stored);
      }
    } catch (err) {
      console.error("Failed to parse SR data", err);
    }
    setItems(currentItems);
    setIsLoaded(true);

    const initRemoteSync = async () => {
      const remote = await fetchRemoteData();
      if (remote?.spaced_repetition && Object.keys(remote.spaced_repetition).length > 0) {
        const mergedItems = { ...currentItems };
        for (const [id, item] of Object.entries(remote.spaced_repetition)) {
          const typedItem = item as SRItem;
          // If local doesn't have it, or remote has a later nextReviewDate, take remote
          if (!mergedItems[id] || new Date(typedItem.nextReviewDate) > new Date(mergedItems[id].nextReviewDate)) {
            mergedItems[id] = typedItem;
          }
        }
        setItems(mergedItems);
        try {
          localStorage.setItem(SR_KEY, JSON.stringify(mergedItems));
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

  const processAnswer = useCallback((questionId: string, isCorrect: boolean) => {
    setItems((prev) => {
      const existing = prev[questionId] || {
        id: questionId,
        interval: 0,
        repetitions: 0,
        easeFactor: 2.5,
        nextReviewDate: new Date().toISOString(),
      };

      // Quality rating: 0 = wrong, 5 = perfect recall
      const q = isCorrect ? 5 : 0;
      let newRepetitions = existing.repetitions;
      let newInterval = existing.interval;
      let newEaseFactor = existing.easeFactor;

      if (q >= 3) { // Correct
        if (newRepetitions === 0) {
          newInterval = 1;
        } else if (newRepetitions === 1) {
          newInterval = 6;
        } else {
          newInterval = Math.round(newInterval * newEaseFactor);
        }
        newRepetitions += 1;
      } else { // Wrong
        newRepetitions = 0;
        newInterval = 1;
      }

      // Update ease factor: EF = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
      newEaseFactor = newEaseFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
      if (newEaseFactor < 1.3) newEaseFactor = 1.3;

      // Calculate next review date
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + newInterval);

      const updatedItem: SRItem = {
        id: questionId,
        interval: newInterval,
        repetitions: newRepetitions,
        easeFactor: newEaseFactor,
        nextReviewDate: nextDate.toISOString(),
      };

      const nextState = { ...prev, [questionId]: updatedItem };
      
      try {
        localStorage.setItem(SR_KEY, JSON.stringify(nextState));
        syncSpacedRepetitionToCloud(nextState);
      } catch (err) {
        console.error("Failed to save SR data", err);
      }

      return nextState;
    });
  }, [syncSpacedRepetitionToCloud]);

  const getDueItems = useCallback(() => {
    const now = new Date();
    return Object.values(items).filter((item) => new Date(item.nextReviewDate) <= now);
  }, [items]);

  return {
    items,
    processAnswer,
    getDueItems,
    isLoaded,
  };
}
