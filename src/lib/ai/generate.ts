import { callForGeneration, ChatMessage } from "./client";
import { GenerationResult, BookId } from "../types";

const SYSTEM_PROMPT = `You are an expert medical educator and examiner specializing in Forensic Medicine & Toxicology (K.S. Narayan Reddy) and Community Medicine (Park's Textbook). 

Your only job is to create high-quality, accurate Multiple Choice Questions (MCQs) that strictly follow the content, terminology, and emphasis of the latest editions of these standard Indian medical textbooks.

Rules you must follow:
1. Accuracy is non-negotiable. Never invent facts, numbers, legal sections, or classifications.
2. Prefer classic, high-yield, exam-oriented questions.
3. Use standard medical terminology used in Reddy and Park.
4. Keep language clear, formal, and precise.
5. Each question must have exactly 4 options.
6. Only one correct answer.
7. Provide a short, clear explanation (2–4 sentences) that teaches the concept.
8. Mark difficulty honestly.
9. If you are not highly confident about a fact, do not generate the question.

Output strictly in valid JSON only. No extra text.`;

function getGenerationPrompt(book: BookId, chapter: string): string {
  const bookName = book === "narayan_reddy" 
    ? "K.S. Narayan Reddy's Essentials of Forensic Medicine & Toxicology"
    : "Park's Textbook of Preventive & Social Medicine";
    
  // Inject a random seed/timestamp so the AI doesn't generate the exact same questions repeatedly
  const seed = Date.now().toString().slice(-4);

  return `Generate exactly 5 high-quality MCQs from the book "${bookName}", Chapter: "${chapter}".
[Randomization Seed: ${seed} - Focus on distinct subtopics, exceptions, and unique clinical scenarios not commonly asked.]

Requirements:
- Focus on important, frequently tested concepts from this chapter.
- Mix of factual recall and application questions.
- Difficulty distribution: 1 easy, 3 medium, 1 hard.
- Explanation must be educational and accurate.
- Avoid unfair trick questions.

Return a JSON object with a "questions" key containing an array following this exact schema:

{
  "questions": [
    {
      "question": "",
      "options": ["", "", "", ""],
      "correct_index": 0,
      "explanation": "",
      "difficulty": "medium",
      "topic": ""
    }
  ]
}`;
}

export async function generateQuestions(
  book: BookId,
  chapter: string
): Promise<GenerationResult> {
  const messages: ChatMessage[] = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: getGenerationPrompt(book, chapter) },
  ];

  try {
    const response = await callForGeneration(messages);
    const parsed = JSON.parse(response.content);
    const questions = parsed.questions || parsed;

    if (!Array.isArray(questions)) {
      throw new Error("Response is not an array of questions");
    }

    // Validate each question
    const validQuestions = questions.filter((q: Record<string, unknown>) => {
      return (
        typeof q.question === "string" &&
        Array.isArray(q.options) &&
        q.options.length === 4 &&
        typeof q.correct_index === "number" &&
        q.correct_index >= 0 &&
        q.correct_index <= 3 &&
        typeof q.explanation === "string" &&
        ["easy", "medium", "hard"].includes(q.difficulty as string)
      );
    });

    return {
      questions: validQuestions.map((q: Record<string, unknown>) => ({
        book,
        chapter,
        topic: (q.topic as string) || undefined,
        question: q.question as string,
        options: q.options as string[],
        correct_index: q.correct_index as number,
        explanation: q.explanation as string,
        difficulty: q.difficulty as "easy" | "medium" | "hard",
      })),
      provider: response.provider,
      success: true,
    };
  } catch (error) {
    return {
      questions: [],
      provider: "gemini",
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export async function generateSummary(book: BookId, chapter: string): Promise<{ summary: string; success: boolean }> {
  const bookName = book === "narayan_reddy" 
    ? "K.S. Narayan Reddy's Essentials of Forensic Medicine & Toxicology"
    : "Park's Textbook of Preventive & Social Medicine";

  const prompt = `You are an expert medical educator. Create a high-yield, comprehensive, and well-structured revision summary for "${bookName}", Chapter: "${chapter}".
  
  Requirements:
  1. Use Markdown formatting.
  2. Include a brief overview paragraph.
  3. Use bullet points for key concepts, high-yield facts, and medicolegal or epidemiological importance.
  4. Keep it concise (300-500 words) but highly informative for exam revision.
  5. At the very end, include a dedicated "Tips & Suggestions" section with practical advice, memorization mnemonics, or common pitfalls related to the chapter's topics.
  
  Do not include any JSON wrapping. Return ONLY the markdown text.`;

  try {
    const res = await callForGeneration([
      { role: "system", content: "You are a precise medical summarizer. Output markdown only." },
      { role: "user", content: prompt }
    ]);
    return { summary: res.content, success: true };
  } catch (error) {
    console.error("Failed to generate summary:", error);
    return { summary: "Failed to generate summary. Please try again.", success: false };
  }
}
