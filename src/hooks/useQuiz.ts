"use client";

import { useState, useCallback, useEffect } from "react";
import { Question, QuizState, QuizResult, QuizMode, BookId } from "@/lib/types";
import { shuffleArray } from "@/lib/data/seed-questions";

interface UseQuizOptions {
  questions: Question[];
  mode: QuizMode;
  bookId: BookId;
  chapterId: string;
  questionCount?: number;
}

export function useQuiz({ questions, mode, bookId, chapterId, questionCount }: UseQuizOptions) {
  const [state, setState] = useState<QuizState>(() => {
    const shuffled = shuffleArray(questions);
    const selected = questionCount ? shuffled.slice(0, questionCount) : shuffled;
    return {
      questions: selected,
      currentIndex: 0,
      answers: new Array(selected.length).fill(null),
      score: 0,
      streak: 0,
      startTime: Date.now(),
      mode,
      bookId,
      chapterId,
      isComplete: false,
      showExplanation: false,
      selectedOption: null,
      isAnswered: false,
    };
  });

  // Shuffle options for current question (stable per question)
  const [shuffledOptionIndices, setShuffledOptionIndices] = useState<number[]>([]);

  useEffect(() => {
    if (state.questions.length > 0 && state.currentIndex < state.questions.length) {
      const indices = state.questions[state.currentIndex].options.map((_, i) => i);
      setShuffledOptionIndices(shuffleArray(indices));
    }
  }, [state.currentIndex, state.questions]);

  // Sync state if questions are loaded asynchronously
  useEffect(() => {
    if (questions.length > 0 && state.questions.length === 0) {
      const shuffled = shuffleArray(questions);
      const selected = questionCount ? shuffled.slice(0, questionCount) : shuffled;
      setState(prev => ({
        ...prev,
        questions: selected,
        answers: new Array(selected.length).fill(null),
      }));
    }
  }, [questions, questionCount, state.questions.length]);

  const currentQuestion = state.questions[state.currentIndex] ?? null;

  const selectOption = useCallback((optionIndex: number) => {
    if (state.isAnswered) return;

    const question = state.questions[state.currentIndex];
    const isCorrect = optionIndex === question.correct_index;

    setState((prev) => ({
      ...prev,
      selectedOption: optionIndex,
      isAnswered: true,
      showExplanation: true,
      score: isCorrect ? prev.score + 1 : prev.score,
      streak: isCorrect ? prev.streak + 1 : 0,
      answers: prev.answers.map((a, i) => (i === prev.currentIndex ? optionIndex : a)),
    }));
  }, [state.isAnswered, state.currentIndex, state.questions]);

  const nextQuestion = useCallback(() => {
    setState((prev) => {
      const nextIndex = prev.currentIndex + 1;
      if (nextIndex >= prev.questions.length) {
        return {
          ...prev,
          isComplete: true,
          endTime: Date.now(),
          showExplanation: false,
          selectedOption: null,
          isAnswered: false,
        };
      }
      return {
        ...prev,
        currentIndex: nextIndex,
        showExplanation: false,
        selectedOption: null,
        isAnswered: false,
      };
    });
  }, []);

  const getResult = useCallback((): QuizResult => {
    const timeTaken = ((state.endTime ?? Date.now()) - state.startTime) / 1000;
    const questionsWithAnswers = state.questions.map((q, i) => ({
      question: q,
      chosenIndex: state.answers[i],
      isCorrect: state.answers[i] === q.correct_index,
    }));

    return {
      totalQuestions: state.questions.length,
      correctAnswers: state.score,
      accuracy: state.questions.length > 0 ? Math.round((state.score / state.questions.length) * 100) : 0,
      timeTaken,
      streak: state.streak,
      questionsWithAnswers,
    };
  }, [state]);

  const restart = useCallback(() => {
    const shuffled = shuffleArray(questions);
    const selected = questionCount ? shuffled.slice(0, questionCount) : shuffled;
    setState({
      questions: selected,
      currentIndex: 0,
      answers: new Array(selected.length).fill(null),
      score: 0,
      streak: 0,
      startTime: Date.now(),
      mode,
      bookId,
      chapterId,
      isComplete: false,
      showExplanation: false,
      selectedOption: null,
      isAnswered: false,
    });
  }, [questions, questionCount, mode, bookId, chapterId]);

  return {
    state,
    currentQuestion,
    shuffledOptionIndices,
    selectOption,
    nextQuestion,
    getResult,
    restart,
    progress: {
      current: state.currentIndex + 1,
      total: state.questions.length,
      percentage: state.questions.length > 0
        ? Math.round(((state.currentIndex + (state.isAnswered ? 1 : 0)) / state.questions.length) * 100)
        : 0,
    },
  };
}
