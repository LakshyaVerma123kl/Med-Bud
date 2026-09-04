import { NextResponse } from "next/server";
import { callForGeneration, ChatMessage } from "@/lib/ai/client";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { question, correctAnswer, explanation, topic, book } = body;

    if (!question || !correctAnswer) {
      return NextResponse.json(
        { error: "Missing question or answer" },
        { status: 400 }
      );
    }

    const messages: ChatMessage[] = [
      {
        role: "system",
        content: `You are a brilliant medical professor who excels at breaking down complex clinical concepts for MBBS students. 
Your explanations are deep, vivid, and memorable. You use real-world clinical scenarios, analogies, and mnemonics to make concepts stick.
Use Markdown formatting with headers, bullet points, and bold text. Use LaTeX for any formulas (e.g. $\\chi^2$).
Keep it focused and educational (150-300 words). Do NOT repeat the question.`,
      },
      {
        role: "user",
        content: `Explain this concept in depth for an MBBS student:

**Book:** ${book || "Medical Textbook"}
**Topic:** ${topic || "General"}
**Question:** ${question}
**Correct Answer:** ${correctAnswer}
**Brief Rationale:** ${explanation}

Give me:
1. A clear, deeper explanation of WHY this answer is correct
2. The underlying mechanism or principle
3. A clinical pearl or memory aid
4. Common exam traps related to this topic`,
      },
    ];

    const response = await callForGeneration(messages, false);

    if (!response || !response.content) {
      return NextResponse.json(
        { error: "AI failed to generate explanation" },
        { status: 500 }
      );
    }

    return NextResponse.json({ explanation: response.content });
  } catch (error: any) {
    console.error("Explain API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
