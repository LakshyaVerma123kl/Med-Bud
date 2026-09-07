"use client";

import { useState, useEffect, useCallback } from "react";

const NOTES_KEY = "medquiz_notes";

export interface QuestionNote {
  text: string;
  updatedAt: string;
}

type NotesMap = Record<string, QuestionNote>;

export function useNotes() {
  const [notes, setNotes] = useState<NotesMap>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(NOTES_KEY);
      if (stored) {
        setNotes(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load notes from localStorage", e);
    }
    setIsLoaded(true);
  }, []);

  const persist = useCallback((updated: NotesMap) => {
    try {
      localStorage.setItem(NOTES_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save notes", e);
    }
  }, []);

  const getNote = useCallback(
    (questionId: string): QuestionNote | null => {
      return notes[questionId] || null;
    },
    [notes]
  );

  const hasNote = useCallback(
    (questionId: string): boolean => {
      return !!notes[questionId]?.text;
    },
    [notes]
  );

  const setNote = useCallback(
    (questionId: string, text: string) => {
      setNotes((prev) => {
        const trimmed = text.trim();
        const updated = { ...prev };

        if (!trimmed) {
          // Remove empty notes
          delete updated[questionId];
        } else {
          updated[questionId] = {
            text: trimmed,
            updatedAt: new Date().toISOString(),
          };
        }

        persist(updated);
        return updated;
      });
    },
    [persist]
  );

  const deleteNote = useCallback(
    (questionId: string) => {
      setNotes((prev) => {
        const updated = { ...prev };
        delete updated[questionId];
        persist(updated);
        return updated;
      });
    },
    [persist]
  );

  const getAllNotes = useCallback((): Array<{ questionId: string } & QuestionNote> => {
    return Object.entries(notes)
      .filter(([, note]) => note.text)
      .map(([questionId, note]) => ({ questionId, ...note }))
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [notes]);

  return {
    getNote,
    hasNote,
    setNote,
    deleteNote,
    getAllNotes,
    isLoaded,
    noteCount: Object.keys(notes).filter((k) => notes[k]?.text).length,
  };
}
