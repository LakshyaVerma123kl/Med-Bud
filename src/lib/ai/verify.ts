import { callForVerification, ChatMessage } from "./client";
import { VerificationResult, AIProvider, BookId } from "../types";

function getVerificationPrompt(
  book: BookId,
  chapter: string,
  question: string,
  options: string[],
  correctIndex: number,
  explanation: string
): string {
  const bookName = book === "narayan_reddy"
    ? "K.S. Narayan Reddy — Forensic Medicine & Toxicology"
    : "Park — Community Medicine";

  const correctOption = options[correctIndex];

  return `You are an independent fact-checker for medical exam questions. You did not write this question and have no stake in it being correct — your only job is accuracy.

Book context: ${bookName} — ${chapter}
Question: ${question}
Options: ${options.map((o, i) => `${String.fromCharCode(65 + i)}. ${o}`).join(", ")}
Marked correct: ${String.fromCharCode(65 + correctIndex)}. ${correctOption}
Explanation: ${explanation}

Check independently:
1. Is the marked correct answer actually correct per standard forensic medicine / community medicine references?
2. Are the distractors plausible-but-wrong (not accidentally also correct, not absurdly implausible)?
3. Any factual, numerical, or legal-threshold error?
4. For Park/community medicine content: is this consistent with current national programmes, or does it reference outdated scheme names/numbers?

Return JSON only:
{
  "isAccurate": true/false,
  "issues": [],
  "suggestedCorrection": "" or null,
  "confidence": 0-100
}`;
}

export async function verifyQuestion(
  book: BookId,
  chapter: string,
  question: string,
  options: string[],
  correctIndex: number,
  explanation: string,
  generationProvider: AIProvider
): Promise<VerificationResult> {
  const messages: ChatMessage[] = [
    {
      role: "system",
      content: "You are an independent medical fact-checker. Respond only with valid JSON. Be strict and thorough in your verification.",
    },
    {
      role: "user",
      content: getVerificationPrompt(book, chapter, question, options, correctIndex, explanation),
    },
  ];

  try {
    const response = await callForVerification(messages, generationProvider);
    const parsed = JSON.parse(response.content);

    return {
      isAccurate: Boolean(parsed.isAccurate),
      issues: Array.isArray(parsed.issues) ? parsed.issues : [],
      suggestedCorrection: parsed.suggestedCorrection || null,
      confidence: typeof parsed.confidence === "number" ? parsed.confidence : 0,
      provider: response.provider,
    };
  } catch (error) {
    return {
      isAccurate: false,
      issues: [`Verification failed: ${error instanceof Error ? error.message : String(error)}`],
      suggestedCorrection: null,
      confidence: 0,
      provider: generationProvider,
    };
  }
}

/**
 * Full pipeline: verify a question and determine its status
 * - confidence >= 90 AND accurate → auto-approve
 * - confidence 70-89 → manual review
 * - confidence < 70 OR not accurate → discard
 */
export async function verifyAndClassify(
  book: BookId,
  chapter: string,
  question: string,
  options: string[],
  correctIndex: number,
  explanation: string,
  generationProvider: AIProvider
): Promise<{
  status: "approved" | "review" | "discarded";
  verification: VerificationResult;
}> {
  const verification = await verifyQuestion(
    book, chapter, question, options, correctIndex, explanation, generationProvider
  );

  let status: "approved" | "review" | "discarded";

  if (verification.confidence >= 90 && verification.isAccurate) {
    status = "approved";
  } else if (verification.confidence >= 70 && verification.isAccurate) {
    status = "review";
  } else {
    status = "discarded";
  }

  return { status, verification };
}
