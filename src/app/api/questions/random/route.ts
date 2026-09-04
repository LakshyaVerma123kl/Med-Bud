import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { seedQuestions } from "@/lib/data/seed-questions";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const countStr = searchParams.get("count");
    const count = countStr ? parseInt(countStr, 10) : 100;

    let allQuestions = [...seedQuestions];

    // Read generated questions
    const jsonPath = path.join(process.cwd(), "src/lib/data/generated-questions.json");
    if (fs.existsSync(jsonPath)) {
      const rawData = fs.readFileSync(jsonPath, "utf8");
      const generated = JSON.parse(rawData);
      allQuestions = allQuestions.concat(generated);
    }

    // Shuffle array
    for (let i = allQuestions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allQuestions[i], allQuestions[j]] = [allQuestions[j], allQuestions[i]];
    }

    // Return the requested amount
    const selected = allQuestions.slice(0, count);

    return NextResponse.json({ questions: selected, totalAvailable: allQuestions.length });
  } catch (err: any) {
    console.error("API /api/questions/random Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
