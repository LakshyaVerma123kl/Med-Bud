import { NextResponse } from "next/server";
import { callForGeneration, ChatMessage } from "@/lib/ai/client";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { question, correctAnswer, topic, book, explanation } = body;

    if (!question || !correctAnswer) {
      return NextResponse.json(
        { error: "Missing question or answer" },
        { status: 400 }
      );
    }

    const messages: ChatMessage[] = [
      {
        role: "system",
        content: `You are a medical education expert who creates vivid, memorable mnemonics for MBBS students.
Rules:
- Create ONE short, catchy mnemonic (acronym, rhyme, or visual association)
- Explain what each letter/part stands for in 1 line each
- Keep it under 80 words total — students need it to be snappy and memorable
- Use Markdown formatting (bold the mnemonic itself)
- If the topic already has a well-known mnemonic, use that instead of inventing a new one
- Never repeat the full question text`,
      },
      {
        role: "user",
        content: `Create a memorable mnemonic for this medical concept:

**Topic:** ${topic || "General"}
**Book:** ${book || "Medical Textbook"}
**Question:** ${question}
**Correct Answer:** ${correctAnswer}
**Context:** ${explanation || ""}

Give me a short, sticky mnemonic that will help me remember this forever.`,
      },
    ];

    const response = await callForGeneration(messages, false);

    if (!response || !response.content) {
      return NextResponse.json(
        { error: "AI failed to generate mnemonic" },
        { status: 500 }
      );
    }

    return NextResponse.json({ mnemonic: response.content });
  } catch (error: any) {
    console.error("Mnemonic API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
