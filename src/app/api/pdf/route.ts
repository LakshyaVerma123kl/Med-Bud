import { NextResponse } from "next/server";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require("pdf-parse");
import { callForGeneration, ChatMessage } from "@/lib/ai/client";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Read file buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse PDF
    console.log(`[PDF] Parsing uploaded file: ${file.name} (${file.size} bytes)`);
    const pdfData = await pdfParse(buffer);
    
    // We only take the first 15000 characters to avoid huge token costs or context limits
    const textChunk = pdfData.text.substring(0, 15000);

    console.log(`[PDF] Extracted ${pdfData.text.length} chars. Using ${textChunk.length} for AI.`);

    const systemPrompt = `You are an expert medical educator. Your job is to read the provided text extracted from a medical PDF and generate a highly educational quiz and summary based STRICTLY on the text provided.

Do not invent facts outside of the text.

Output strictly in valid JSON format matching this schema:
{
  "summary": "A concise 2-3 paragraph summary of the key concepts in this text.",
  "questions": [
    {
      "question": "The question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_index": 0,
      "explanation": "Why this is correct based on the text.",
      "difficulty": "medium",
      "topic": "Topic Name"
    }
  ]
}`;

    const userPrompt = `Please generate a summary and exactly 10 high-quality MCQs based on the following text:\n\n---\n${textChunk}\n---`;

    const messages: ChatMessage[] = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ];

    console.log("[PDF] Calling AI for summary and generation...");
    const aiResponse = await callForGeneration(messages);
    
    const parsed = JSON.parse(aiResponse.content);
    
    // Ensure all questions conform to the type we expect on the frontend
    const validQuestions = (parsed.questions || []).map((q: any, i: number) => ({
      id: `pdf-q-${i}`,
      book: "custom_pdf",
      chapter: file.name,
      question: q.question,
      options: q.options,
      correct_index: q.correct_index,
      explanation: q.explanation,
      difficulty: q.difficulty || "medium",
      source: "ai_generated",
      verified: true
    }));

    return NextResponse.json({
      success: true,
      summary: parsed.summary || "No summary provided.",
      questions: validQuestions,
      title: file.name
    });

  } catch (error) {
    console.error("[PDF Error]:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error processing PDF",
    }, { status: 500 });
  }
}
