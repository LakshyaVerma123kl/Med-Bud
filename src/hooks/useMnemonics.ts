"use client";

import { useState, useEffect, useCallback } from "react";

const MNEMONICS_KEY = "medquiz_mnemonics";

export interface CachedMnemonic {
  mnemonic: string;
  createdAt: string;
}

type MnemonicsMap = Record<string, CachedMnemonic>;

export function useMnemonics() {
  const [mnemonics, setMnemonics] = useState<MnemonicsMap>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(MNEMONICS_KEY);
      if (stored) {
        setMnemonics(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load mnemonics from localStorage", e);
    }
    setIsLoaded(true);
  }, []);

  const persist = useCallback((updated: MnemonicsMap) => {
    try {
      localStorage.setItem(MNEMONICS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save mnemonics", e);
    }
  }, []);

  const getCached = useCallback(
    (questionId: string): string | null => {
      return mnemonics[questionId]?.mnemonic || null;
    },
    [mnemonics]
  );

  const saveMnemonic = useCallback(
    (questionId: string, mnemonic: string) => {
      setMnemonics((prev) => {
        const updated = {
          ...prev,
          [questionId]: {
            mnemonic,
            createdAt: new Date().toISOString(),
          },
        };
        persist(updated);
        return updated;
      });
    },
    [persist]
  );

  const fetchMnemonic = useCallback(
    async (
      questionId: string,
      context: {
        question: string;
        correctAnswer: string;
        topic: string;
        book: string;
        explanation: string;
      }
    ): Promise<string> => {
      // Check cache first — zero repeat cost
      const cached = mnemonics[questionId]?.mnemonic;
      if (cached) return cached;

      // Call API
      const res = await fetch("/api/mnemonic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(context),
      });

      if (!res.ok) {
        throw new Error("Failed to generate mnemonic");
      }

      const data = await res.json();
      const mnemonic = data.mnemonic || "Could not generate a mnemonic. Try again.";

      // Cache for future — never call API for this question again
      saveMnemonic(questionId, mnemonic);

      return mnemonic;
    },
    [mnemonics, saveMnemonic]
  );

  return {
    getCached,
    fetchMnemonic,
    saveMnemonic,
    isLoaded,
  };
}
