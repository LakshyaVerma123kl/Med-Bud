import { NextResponse } from "next/server";
import { callForGeneration, ChatMessage } from "@/lib/ai/client";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    if (typeof globalThis !== 'undefined') {
      (globalThis as any).DOMMatrix = class DOMMatrix {};
      (globalThis as any).ImageData = class ImageData {};
      (globalThis as any).Path2D = class Path2D {};
    }
    if (typeof global !== 'undefined') {
      (global as any).DOMMatrix = class DOMMatrix {};
      (global as any).ImageData = class ImageData {};
      (global as any).Path2D = class Path2D {};
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Server-side size validation (50MB)
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json({ error: "File size exceeds 50MB limit" }, { status: 413 });
    }

    // Read file buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let text = "";
    const isDocx = file.name.toLowerCase().endsWith(".docx") || file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

    if (isDocx) {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const mammoth = require("mammoth");
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else {
      // Require pdf-parse dynamically inside the try/catch block to prevent unhandled crashing
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const pdfParse = require("pdf-parse");
      const parsedData = await pdfParse(buffer);
      text = parsedData.text;
    }
    
    // Extract name from formData, fallback to file name, fallback to title
    let quizName = formData.get("quizName") as string;
    if (!quizName || !quizName.trim()) {
      quizName = file.name ? file.name.replace(/\.(pdf|docx)$/i, "") : "Untitled Document";
    }

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ success: false, error: "Could not extract text from document. It might be scanned, image-based, or empty." });
    }

    // Import Supabase inside the function to avoid top-level issues
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getAdminSupabase } = require("@/lib/supabase");
    const supabaseAdmin = getAdminSupabase();

    if (text.length > 30000) {
      // Chunking logic for large documents
      const chunkSize = 20000;
      const chapters = [];
      for (let i = 0; i < text.length; i += chunkSize) {
        chapters.push({
          index: i / chunkSize,
          title: `Part ${Math.floor(i / chunkSize) + 1}`,
          text: text.substring(i, i + chunkSize),
          summary: "",
          questions: []
        });
      }

      // Save chunked data in the flexible questions column
      const chunkedData = {
        is_chunked: true,
        raw_text: text,
        chapters: chapters
      };

      const { data: insertedData, error: insertError } = await supabaseAdmin
        .from("pdf_quizzes")
        .insert({
          name: quizName,
          summary: "Large document processed into chapters.",
          questions: chunkedData, // Storing our structure here
        })
        .select("id")
        .single();

      if (insertError || !insertedData) {
        console.error("Supabase insert error:", insertError);
        return NextResponse.json({ success: false, error: "Failed to save document to database." });
      }

      return NextResponse.json({
        success: true,
        id: insertedData.id,
        title: quizName,
        summary: "Document chunked",
        questionCount: chapters.length
      });
    }

    // Prepare messages for Gemini (Legacy single-shot generation for small docs)
    const messages: ChatMessage[] = [
      {
        role: "system",
        content: `You are an expert medical educator. Your task is to analyze the provided medical document text and create a high-quality quiz.
Return a JSON object with EXACTLY this structure:
{
  "title": "A short, descriptive title for the document",
  "summary": "A comprehensive markdown-formatted summary of the document. Include a brief overview paragraph, bullet points for key concepts and topics, and a dedicated 'Tips & Suggestions' section with practical advice, mnemonics, or common pitfalls at the very end.",
  "questions": [
    {
      "id": "q1",
      "question": "Clear, challenging multiple choice question?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_index": 0,
      "explanation": "Detailed clinical rationale explaining why the answer is correct.",
      "difficulty": "medium",
      "topic": "Specific sub-topic"
    }
  ]
}
Generate 5 high-quality, clinical-vignette style questions if possible.`
      },
      {
        role: "user",
        content: `Document Text:\n\n${text}` 
      }
    ];

    // Call the unified AI generation client
    const response = await callForGeneration(messages);

    if (!response || !response.content) {
      console.error("AI Generation failed: No content returned");
      return NextResponse.json({ success: false, error: "Failed to generate quiz from AI. Please try again." });
    }

    // Get the parsed data from the AI
    let quizData: any;
    try {
      quizData = JSON.parse(response.content);
    } catch (e) {
      return NextResponse.json({ success: false, error: "AI returned invalid JSON format." });
    }

    if (!quizData.questions || !Array.isArray(quizData.questions) || quizData.questions.length === 0) {
      return NextResponse.json({ success: false, error: "AI could not generate questions from this document." });
    }

    const finalQuestions = {
      is_chunked: false,
      raw_text: text,
      questions: quizData.questions
    };

    // Insert into Supabase
    const { data: insertedData, error: insertError } = await supabaseAdmin
      .from("pdf_quizzes")
      .insert({
        name: quizName,
        summary: quizData.summary || "Custom Quiz",
        questions: finalQuestions,
      })
      .select("id")
      .single();

    if (insertError || !insertedData) {
      console.error("Supabase insert error:", insertError);
      return NextResponse.json({ success: false, error: "Failed to save quiz to database." });
    }

    return NextResponse.json({
      success: true,
      id: insertedData.id,
      title: quizName,
      summary: quizData.summary,
      questionCount: quizData.questions.length
    });

  } catch (error) {
    console.error("[PDF Error]:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error processing PDF",
    }, { status: 500 });
  }
}
