import { NextResponse } from "next/server";
import crypto from "crypto";
import { generateQuestions } from "@/lib/ai/generate";
import { verifyAndClassify } from "@/lib/ai/verify";
import { deduplicateBatch } from "@/lib/ai/deduplicate";
import { seedQuestions } from "@/lib/data/seed-questions";
import { BookId } from "@/lib/types";
import { getAdminSupabase } from "@/lib/supabase";

/**
 * POST /api/admin/generate
 * 
 * Admin-only endpoint to generate, verify, and deduplicate questions.
 * This is the offline pipeline — NEVER called during a user quiz session.
 * 
 * Body: { book: BookId, chapter: string }
 */
export async function POST(request: Request) {
  try {
    // Basic admin check (in production, use proper auth)
    const adminKey = request.headers.get("x-admin-key");
    if (adminKey !== process.env.ADMIN_API_KEY && process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { book, chapter } = body as { book: BookId; chapter: string };

    if (!book || !chapter) {
      return NextResponse.json({ error: "Missing book or chapter" }, { status: 400 });
    }

    // Step 1: Generate questions
    console.log(`[Pipeline] Step 1: Generating questions for ${book} / ${chapter}...`);
    const generation = await generateQuestions(book, chapter);

    if (!generation.success || generation.questions.length === 0) {
      return NextResponse.json({
        success: false,
        error: generation.error || "No questions generated",
        provider: generation.provider,
      }, { status: 500 });
    }

    console.log(`[Pipeline] Generated ${generation.questions.length} questions via ${generation.provider}`);

    // Step 2: Deduplicate against existing questions
    console.log("[Pipeline] Step 2: Deduplicating...");
    const existingTexts = seedQuestions
      .filter((q) => q.book === book && q.chapter === chapter)
      .map((q) => q.question);

    const { unique, duplicates } = deduplicateBatch(generation.questions, existingTexts);
    console.log(`[Pipeline] ${unique.length} unique, ${duplicates.length} duplicates removed`);

    // Step 3: Verify each unique question
    console.log("[Pipeline] Step 3: Verifying...");
    const results = await Promise.all(
      unique.map(async (q) => {
        const { status, verification } = await verifyAndClassify(
          book,
          chapter,
          q.question,
          q.options,
          q.correct_index,
          q.explanation,
          generation.provider
        );

        return {
          question: q,
          status,
          verification: {
            isAccurate: verification.isAccurate,
            confidence: verification.confidence,
            issues: verification.issues,
            provider: verification.provider,
            suggestedCorrection: verification.suggestedCorrection,
          },
        };
      })
    );

    const approved = results.filter((r) => r.status === "approved");
    const review = results.filter((r) => r.status === "review");
    const discarded = results.filter((r) => r.status === "discarded");

    console.log(`[Pipeline] Results: ${approved.length} approved, ${review.length} for review, ${discarded.length} discarded`);

    const supabase = getAdminSupabase();

    // Insert approved questions into the questions table
    if (approved.length > 0) {
      const approvedInsert = approved.map((r) => ({
        content_hash: crypto.createHash('md5').update(r.question.question).digest('hex'),
        book: r.question.book,
        chapter: r.question.chapter,
        topic: r.question.topic || 'General',
        question: r.question.question,
        options: JSON.stringify(r.question.options),
        correct_index: r.question.correct_index,
        explanation: r.question.explanation,
        difficulty: r.question.difficulty,
        source: 'ai_generated',
        verified: true,
        verified_by: `${generation.provider}+${r.verification.provider}_crosscheck`,
        confidence: r.verification.confidence,
      }));

      const { error } = await supabase.from('questions').upsert(approvedInsert, { onConflict: 'content_hash' });
      if (error) console.error("[Pipeline] Supabase insert error for approved:", error);
    }

    // Insert review questions into the review_queue table
    if (review.length > 0) {
      const reviewInsert = review.map((r) => ({
        book: book,
        chapter: chapter,
        question_data: r.question,
        verification_data: r.verification,
        status: 'pending'
      }));

      const { error } = await supabase.from('review_queue').insert(reviewInsert);
      if (error) console.error("[Pipeline] Supabase insert error for review queue:", error);
    }

    return NextResponse.json({
      success: true,
      summary: {
        generated: generation.questions.length,
        duplicatesRemoved: duplicates.length,
        approved: approved.length,
        forReview: review.length,
        discarded: discarded.length,
        generationProvider: generation.provider,
      },
    });
  } catch (error) {
    console.error("[Pipeline] Fatal error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}
