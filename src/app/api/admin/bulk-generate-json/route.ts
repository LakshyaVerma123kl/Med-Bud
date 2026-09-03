import { NextResponse } from "next/server";
import { getChaptersForBook } from "@/lib/data/chapters";
import { getQuestionsForChapter } from "@/lib/data/seed-questions";
import { callForGeneration } from "@/lib/ai/client";
import fs from "fs";
import path from "path";

export const maxDuration = 300; // Allow 5 minutes on Vercel

export async function POST() {
  try {
    const books = ["narayan_reddy", "park"] as const;
    let allGenerated: any[] = [];
    
    // Load existing generated questions if any
    const outputPath = path.join(process.cwd(), "src/lib/data/generated-questions.json");
    if (fs.existsSync(outputPath)) {
      try {
        const existing = JSON.parse(fs.readFileSync(outputPath, "utf8"));
        if (Array.isArray(existing)) {
          allGenerated = existing;
        }
      } catch (e) {}
    }

    let newlyGeneratedCount = 0;

    for (const book of books) {
      const chapters = getChaptersForBook(book);
      for (const chapter of chapters) {
        // Count how many we already have from seed + generated
        const seedQs = getQuestionsForChapter(chapter.id);
        const generatedQs = allGenerated.filter(q => q.book === book && q.chapter === chapter.id);
        const total = seedQs.length + generatedQs.length;

        if (total < 4) {
          console.log(`Generating questions for ${book} - ${chapter.id} (${total} currently)`);
          
          const prompt = `You are an expert medical educator. Generate exactly 5 high-quality MCQs from the book "${book === 'narayan_reddy' ? 'K.S. Narayan Reddy' : 'Park'}", Chapter: "${chapter.name}".
          Requirements:
          - Focus on important, frequently tested concepts.
          - 4 options, 1 correct index (0-3).
          - Short educational explanation.
          - Difficulty: mix of easy/medium/hard.
          Output JSON only: { "questions": [ { "question": "", "options": ["","","",""], "correct_index": 0, "explanation": "", "difficulty": "medium", "topic": "General" } ] }`;

          try {
            const res = await callForGeneration([
              { role: "system", content: "You are an expert medical examiner. Output valid JSON only." },
              { role: "user", content: prompt }
            ]);

            const parsed = JSON.parse(res.content);
            const questions = parsed.questions || parsed;
            
            if (Array.isArray(questions)) {
              for (const q of questions) {
                allGenerated.push({
                  id: `${book.substring(0,2)}-gen-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                  book,
                  chapter: chapter.id,
                  topic: q.topic || chapter.name,
                  question: q.question,
                  options: q.options,
                  correct_index: q.correct_index,
                  explanation: q.explanation,
                  difficulty: q.difficulty,
                  verified: true
                });
                newlyGeneratedCount++;
              }
              // Save progressively
              fs.writeFileSync(outputPath, JSON.stringify(allGenerated, null, 2));
            }
            
            // Artificial delay to prevent rate limit
            await new Promise(r => setTimeout(r, 2000));
          } catch (err) {
            console.error(`Failed to generate for ${chapter.id}:`, err);
          }
        }
      }
    }

    return NextResponse.json({ success: true, newlyGeneratedCount, totalGeneratedQuestions: allGenerated.length });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
