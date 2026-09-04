import { NextResponse } from "next/server";
import { callForGeneration, ChatMessage } from "@/lib/ai/client";
import { getAdminSupabase } from "@/lib/supabase";
import { BookId } from "@/lib/types";

export const dynamic = "force-dynamic";

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
    const { data: existing } = await supabase
      .from("chapter_notes")
      .select("notes")
      .eq("book", book)
      .eq("chapter", chapter)
      .single();

    if (existing && existing.notes) {
      return NextResponse.json({ notes: existing.notes, cached: true });
    }

    // 2. Generate fresh notes via AI
    const bookName = book === "narayan_reddy"
      ? "K.S. Narayan Reddy's Essentials of Forensic Medicine & Toxicology"
      : "Park's Textbook of Preventive & Social Medicine";

    const messages: ChatMessage[] = [
      {
        role: "system",
        content: `You are a world-class medical educator who writes the most effective, exam-oriented study notes for MBBS students. Your notes are comprehensive yet concise, covering all exam-relevant content. Output in clean Markdown format. Use LaTeX for formulas.`,
      },
      {
        role: "user",
        content: `Write comprehensive short notes (2-3 pages worth) for "${bookName}", Chapter: "${chapter}".

Structure your notes EXACTLY as follows:

## Introduction
Brief introduction to the topic with definition and importance.

## Key Definitions & Terminology
All important terms and definitions a student must know.

## Core Concepts
Detailed explanation of all major concepts, mechanisms, classifications, and principles. Use sub-headings for each major topic.

## Important Classifications & Tables
Present any relevant classifications, staging systems, or comparative data in structured lists or tables.

## Medicolegal / Epidemiological Significance
Legal provisions (IPC/BNS sections), public health significance, or forensic importance as applicable.

## Frequently Tested Facts
Bullet list of the most commonly asked facts in exams (NEET PG, university exams).

## Mnemonics & Memory Aids
Helpful mnemonics, acronyms, or memory tricks for this chapter.

## Common Exam Questions & Traps
Types of questions asked and common mistakes students make.

Requirements:
- Be thorough and cover ALL subtopics within this chapter.
- Use proper medical terminology from the textbook.
- Use LaTeX for formulas (e.g. $\\chi^2$, $\\text{SE} = \\frac{\\sigma}{\\sqrt{n}}$).
- Use tables where appropriate with markdown table syntax.
- Keep it exam-focused and high-yield.
- This should be detailed enough to serve as a standalone revision resource.`,
      },
    ];

    const response = await callForGeneration(messages, false);

    if (!response || !response.content) {
      return NextResponse.json({ error: "Failed to generate notes" }, { status: 500 });
    }

    // 3. Cache for future use
    const { error: insertError } = await supabase
      .from("chapter_notes")
      .insert({ book, chapter, notes: response.content });

    if (insertError) {
      console.warn("Could not cache notes:", insertError.message);
    }

    return NextResponse.json({ notes: response.content, cached: false });
  } catch (err: any) {
    console.error("Notes API Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
