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

  // 1. Get bundled questions (these are static from build time)
  let baseQuestions: any[] = [];
  if (chapter) {
    baseQuestions = getQuestionsForChapter(chapter);
  } else if (book) {
    baseQuestions = getQuestionsForBook(book);
  }

  // 2. To ensure LIVE generated questions from the background daemon show up,
  // we dynamically read the JSON file from the filesystem.
  try {
    const jsonPath = path.join(process.cwd(), "src/lib/data/generated-questions.json");
    if (fs.existsSync(jsonPath)) {
      const rawData = fs.readFileSync(jsonPath, "utf8");
      const generated = JSON.parse(rawData);
      
      if (Array.isArray(generated)) {
        const relevantGenerated = generated.filter(q => 
          (chapter ? q.chapter === chapter : true) &&
          (book ? q.book === book : true) &&
          q.verified === true
        );

        const baseIds = new Set(baseQuestions.map((q: any) => q.id));
        const newGenerated = relevantGenerated.filter(q => !baseIds.has(q.id));
        baseQuestions = [...baseQuestions, ...newGenerated];
      }
    }
  } catch (err) {
    console.error("Failed to read live generated questions:", err);
  }

  // 3. Fetch questions from Supabase (from the GENERATE AI button)
  try {
    const { supabase } = await import("@/lib/supabase");
    let query = supabase.from("questions").select("*").eq("verified", true);
    
    if (chapter) {
      query = query.eq("chapter", chapter);
    } else if (book) {
      query = query.eq("book", book);
    }

    const { data, error } = await query;
    if (!error && data && data.length > 0) {
      // Parse options if stored as string
      const parsedData = data.map(q => ({
        ...q,
        options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options
      }));

      // Merge Supabase questions, removing duplicates by content_hash or id
      const existingHashes = new Set(baseQuestions.map((q: any) => q.content_hash || q.question));
      const existingIds = new Set(baseQuestions.map((q: any) => q.id));
      
      const uniqueSupabase = parsedData.filter(q => 
        !existingHashes.has(q.content_hash || q.question) && 
        !existingIds.has(q.id)
      );
      
      baseQuestions = [...baseQuestions, ...uniqueSupabase];
    }
  } catch (err) {
    console.error("Failed to fetch questions from Supabase:", err);
  }

  return NextResponse.json({ questions: baseQuestions });
}
