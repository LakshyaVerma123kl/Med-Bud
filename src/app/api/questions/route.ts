import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getQuestionsForChapter, getQuestionsForBook } from "@/lib/data/seed-questions";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const chapter = searchParams.get("chapter");
  const book = searchParams.get("book");
  
  if (!chapter && !book) {
    return NextResponse.json({ error: "Missing chapter or book parameter" }, { status: 400 });
  }

  // Get bundled questions (these are static from build time)
  let baseQuestions: any[] = [];
  if (chapter) {
    baseQuestions = getQuestionsForChapter(chapter);
  } else if (book) {
    baseQuestions = getQuestionsForBook(book);
  }

  // To ensure LIVE generated questions show up immediately without a rebuild,
  // we must dynamically read the JSON file from the filesystem.
  try {
    const jsonPath = path.join(process.cwd(), "src/lib/data/generated-questions.json");
    if (fs.existsSync(jsonPath)) {
      const rawData = fs.readFileSync(jsonPath, "utf8");
      const generated = JSON.parse(rawData);
      
      if (Array.isArray(generated)) {
        // Filter for the requested chapter/book
        const relevantGenerated = generated.filter(q => 
          (chapter ? q.chapter === chapter : true) &&
          (book ? q.book === book : true) &&
          q.verified === true
        );

        // Remove duplicates if the bundled seed-questions already contains some of them
        const baseIds = new Set(baseQuestions.map((q: any) => q.id));
        const newGenerated = relevantGenerated.filter(q => !baseIds.has(q.id));
        
        baseQuestions = [...baseQuestions, ...newGenerated];
      }
    }
  } catch (err) {
    console.error("Failed to read live generated questions:", err);
  }

  return NextResponse.json({ questions: baseQuestions });
}
