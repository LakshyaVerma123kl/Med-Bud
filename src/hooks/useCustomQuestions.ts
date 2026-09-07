"use client";

import { useState, useEffect, useCallback } from "react";
import { Question, BookId, Difficulty } from "@/lib/types";

const CUSTOM_QUESTIONS_KEY = "medquiz_custom_questions";

export interface CustomQuestionInput {
  question: string;
  options: [string, string, string, string];
  correct_index: number;
  explanation: string;
  difficulty: Difficulty;
  topic?: string;
  book?: BookId;
  chapter?: string;
}

function generateHash(text: string): string {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const chr = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

export function useCustomQuestions() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CUSTOM_QUESTIONS_KEY);
      if (stored) {
        setQuestions(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load custom questions from localStorage", e);
    }
    setIsLoaded(true);
  }, []);

  const persist = useCallback((updated: Question[]) => {
    try {
      localStorage.setItem(CUSTOM_QUESTIONS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save custom questions", e);
    }
  }, []);

  const addQuestion = useCallback(
    (input: CustomQuestionInput): Question => {
      const now = new Date().toISOString();
      const newQuestion: Question = {
        id: `custom_${crypto.randomUUID()}`,
        book: input.book || "narayan_reddy",
        chapter: input.chapter || "custom",
        topic: input.topic || "Custom",
        question: input.question,
        options: [...input.options],
        correct_index: input.correct_index,
        explanation: input.explanation,
        difficulty: input.difficulty,
        source: "ai_generated" as const, // Reuse existing union — functionally "user_created"
        verified: true,
        confidence: 1,
        content_hash: generateHash(input.question + input.options.join("")),
        image_url: undefined,
        created_at: now,
        updated_at: now,
      };

      setQuestions((prev) => {
        const updated = [newQuestion, ...prev];
        persist(updated);
        return updated;
      });

      return newQuestion;
    },
    [persist]
  );

  const editQuestion = useCallback(
    (id: string, input: Partial<CustomQuestionInput>) => {
      setQuestions((prev) => {
        const updated = prev.map((q) => {
          if (q.id !== id) return q;
          return {
            ...q,
            ...(input.question !== undefined && { question: input.question }),
            ...(input.options !== undefined && { options: [...input.options] }),
            ...(input.correct_index !== undefined && { correct_index: input.correct_index }),
            ...(input.explanation !== undefined && { explanation: input.explanation }),
            ...(input.difficulty !== undefined && { difficulty: input.difficulty }),
            ...(input.topic !== undefined && { topic: input.topic }),
            content_hash: generateHash(
              (input.question || q.question) + (input.options || q.options).join("")
            ),
            updated_at: new Date().toISOString(),
          };
        });
        persist(updated);
        return updated;
      });
    },
    [persist]
  );

  const deleteQuestion = useCallback(
    (id: string) => {
      setQuestions((prev) => {
        const updated = prev.filter((q) => q.id !== id);
        persist(updated);
        return updated;
      });
    },
    [persist]
  );

  const getAll = useCallback((): Question[] => {
    return [...questions].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [questions]);

  return {
    questions,
    addQuestion,
    editQuestion,
    deleteQuestion,
    getAll,
    isLoaded,
    count: questions.length,
  };
}
