import { NextResponse } from "next/server";
import { callForGeneration, ChatMessage } from "@/lib/ai/client";
import { getAdminSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { id, chapterIndex, isChunked } = await request.json();

    if (!id) {
      return NextResponse.json({ success: false, error: "Document ID required" }, { status: 400 });
    }

    const supabaseAdmin = getAdminSupabase();
    const { data: doc, error } = await supabaseAdmin
      .from("pdf_quizzes")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !doc) {
      return NextResponse.json({ success: false, error: "Document not found" }, { status: 404 });
    }

    let textToAnalyze = "";
    let existingQuestions = [];

    if (isChunked && doc.questions?.is_chunked) {
      const chapter = doc.questions.chapters[chapterIndex];
      if (!chapter) {
        return NextResponse.json({ success: false, error: "Chapter not found" }, { status: 404 });
      }
      textToAnalyze = chapter.text;
      existingQuestions = chapter.questions || [];
    } else {
      // Legacy or small document (not chunked), we need to extract text from the source or maybe we don't have it?
      // Actually, for small documents, we didn't save the raw text. 
      // So generating "more" for legacy unchunked without raw_text is impossible.
      // But for NEW unchunked documents... wait, I didn't save raw_text for new unchunked documents!
      // Ah, for small documents, I just generated the quiz. The user can't generate *more* unless we save raw_text.
      // If we don't have raw_text, we return an error.
      if (doc.questions?.raw_text) {
        textToAnalyze = doc.questions.raw_text;
        existingQuestions = Array.isArray(doc.questions) ? doc.questions : (doc.questions.questions || []);
      } else {
        return NextResponse.json({ success: false, error: "Raw text not available for this legacy document. Please re-upload." });
      }
    }

    const existingContext = existingQuestions.length > 0 
      ? `\n\nDo NOT generate questions similar to these existing ones:\n${existingQuestions.map((q: any) => q.question).join('\n')}`
      : "";

    const messages: ChatMessage[] = [
      {
        role: "system",
        content: `You are an expert educator and analyst. Your task is to analyze the provided document text and create 5 new, high-quality multiple-choice questions based strictly on its contents. If the document is non-medical (e.g. a resume, professional document, literature, etc.), adapt your questions to the subject matter of the text.${existingContext}
Return a JSON object with EXACTLY this structure:
{
  "summary": "A brief summary of this specific text section (only if no summary exists yet, otherwise leave empty)",
  "questions": [
    {
      "id": "q_new_1",
      "question": "Clear, challenging multiple choice question?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_index": 0,
      "explanation": "Detailed clinical rationale explaining why the answer is correct.",
      "difficulty": "medium",
      "topic": "Specific sub-topic"
    }
  ]
}`
      },
      {
        role: "user",
        content: `Document Text:\n\n${textToAnalyze}`
      }
    ];

    const response = await callForGeneration(messages);

    if (!response || !response.content) {
      throw new Error("AI Generation failed");
    }

    let generatedData: any;
    try {
      generatedData = JSON.parse(response.content);
    } catch (e) {
      throw new Error("AI returned invalid JSON");
    }

    const newQuestions = generatedData.questions || [];
    if (newQuestions.length === 0) {
      throw new Error("AI generated 0 questions");
    }

    // Save back to DB
    if (isChunked) {
      const updatedChapters = [...doc.questions.chapters];
      const chapter = updatedChapters[chapterIndex];
      
      // Update chapter questions and summary
      chapter.questions = [...(chapter.questions || []), ...newQuestions];
      if (!chapter.summary && generatedData.summary) {
        chapter.summary = generatedData.summary;
      }

      const updatedChunkedData = {
        ...doc.questions,
        chapters: updatedChapters
      };

      await supabaseAdmin
        .from("pdf_quizzes")
        .update({ questions: updatedChunkedData })
        .eq("id", id);
        
      return NextResponse.json({ success: true, newQuestions, summary: chapter.summary });
    } else {
      // For unchunked
      const updatedQuestionsData = {
        ...(doc.questions || {}),
        is_chunked: false,
        questions: [...existingQuestions, ...newQuestions]
      };
      
      await supabaseAdmin
        .from("pdf_quizzes")
        .update({ questions: updatedQuestionsData })
        .eq("id", id);

      return NextResponse.json({ success: true, newQuestions });
    }

  } catch (error) {
    console.error("[Generate More Error]:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }, { status: 500 });
  }
}
