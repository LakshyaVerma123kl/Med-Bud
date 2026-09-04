import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { seedQuestions } from "@/lib/data/seed-questions";

export async function POST(request: Request) {
  try {
    const { ids } = await request.json();
    if (!ids || !Array.isArray(ids)) {
      return NextResponse.json({ error: "Missing or invalid ids array" }, { status: 400 });
    }

    const requestedIds = new Set(ids);
    const matchedQuestions: any[] = [];

    // 1. Check seed questions
    seedQuestions.forEach((q) => {
      if (requestedIds.has(q.id)) {
        matchedQuestions.push(q);
      }
    });

    // 2. Check generated questions
    const jsonPath = path.join(process.cwd(), "src/lib/data/generated-questions.json");
    if (fs.existsSync(jsonPath)) {
      const rawData = fs.readFileSync(jsonPath, "utf8");
      const generated = JSON.parse(rawData);
      generated.forEach((q: any) => {
        if (requestedIds.has(q.id)) {
          matchedQuestions.push(q);
        }
      });
    }

    return NextResponse.json({ questions: matchedQuestions });
  } catch (err: any) {
    console.error("API /api/questions/ids Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
