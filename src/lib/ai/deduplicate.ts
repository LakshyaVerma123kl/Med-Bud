/**
 * Content-based deduplication for questions.
 * Uses normalized text hashing to prevent near-duplicate questions
 * from flooding the question bank.
 */

/**
 * Normalize question text for hashing:
 * - Lowercase
 * - Remove extra whitespace
 * - Remove punctuation
 * - Sort words (makes it order-insensitive for near-duplicates)
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Simple djb2 hash function for content deduplication
 */
function hashString(str: string): string {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
    hash |= 0; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Generate a content hash for a question.
 * Combines the normalized question text with correct answer to create a unique hash.
 */
export function generateContentHash(questionText: string, correctAnswer: string): string {
  const normalized = normalizeText(questionText) + "::" + normalizeText(correctAnswer);
  return hashString(normalized);
}

/**
 * Check if a question is a near-duplicate of any existing questions.
 * Uses Jaccard similarity on word sets.
 */
export function isNearDuplicate(
  newQuestion: string,
  existingQuestions: string[],
  threshold: number = 0.8
): { isDuplicate: boolean; similarTo?: string; similarity: number } {
  const newWords = new Set(normalizeText(newQuestion).split(" "));

  let maxSimilarity = 0;
  let mostSimilar: string | undefined;

  for (const existing of existingQuestions) {
    const existingWords = new Set(normalizeText(existing).split(" "));

    // Jaccard similarity
    const intersection = new Set([...newWords].filter((w) => existingWords.has(w)));
    const union = new Set([...newWords, ...existingWords]);
    const similarity = union.size > 0 ? intersection.size / union.size : 0;

    if (similarity > maxSimilarity) {
      maxSimilarity = similarity;
      mostSimilar = existing;
    }
  }

  return {
    isDuplicate: maxSimilarity >= threshold,
    similarTo: maxSimilarity >= threshold ? mostSimilar : undefined,
    similarity: maxSimilarity,
  };
}

/**
 * Deduplicate a batch of questions against existing ones.
 * Returns only unique questions.
 */
export function deduplicateBatch<T extends { question: string; options: string[]; correct_index: number }>(
  newQuestions: T[],
  existingQuestions: string[],
  threshold: number = 0.8
): { unique: T[]; duplicates: { question: T; similarTo: string }[] } {
  const unique: T[] = [];
  const duplicates: { question: T; similarTo: string }[] = [];
  const allQuestions = [...existingQuestions];

  for (const q of newQuestions) {
    const result = isNearDuplicate(q.question, allQuestions, threshold);

    if (result.isDuplicate && result.similarTo) {
      duplicates.push({ question: q, similarTo: result.similarTo });
    } else {
      unique.push(q);
      allQuestions.push(q.question); // Add to pool for subsequent checks
    }
  }

  return { unique, duplicates };
}
