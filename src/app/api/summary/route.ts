import { NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/supabase";
import { generateSummary } from "@/lib/ai/generate";
import { BookId } from "@/lib/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const book = searchParams.get("book") as BookId;
  const chapter = searchParams.get("chapter");

  if (!book || !chapter) {
    return NextResponse.json({ error: "Missing book or chapter" }, { status: 400 });
  }

  const supabase = getAdminSupabase();

  try {
    // 1. Check cache in Supabase
    const { data: existing, error: dbError } = await supabase
      .from("chapter_summaries")
      .select("summary")
      .eq("book", book)
      .eq("chapter", chapter)
      .single();

    if (existing && existing.summary) {
      return NextResponse.json({ summary: existing.summary, cached: true });
    }

    // Table might not exist yet, or summary not found. Let's generate it.
    const { summary, success } = await generateSummary(book, chapter);

    if (!success) {
      return NextResponse.json({ error: "Failed to generate summary" }, { status: 500 });
    }

    // 2. Cache it for future
    const { error: insertError } = await supabase
      .from("chapter_summaries")
      .insert({ book, chapter, summary });

    if (insertError) {
      console.warn("Could not cache summary (maybe table missing):", insertError.message);
    }

    return NextResponse.json({ summary, cached: false });
  } catch (err: any) {
    console.error("Summary API Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
