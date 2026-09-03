import { NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ success: false, error: "No ID provided" }, { status: 400 });
    }

    const supabaseAdmin = getAdminSupabase();

    // Delete the custom quiz from the database
    const { error } = await supabaseAdmin
      .from("pdf_quizzes")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Supabase delete error:", error);
      return NextResponse.json({ success: false, error: "Failed to delete quiz from database." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[PDF Delete Error]:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error deleting PDF quiz",
    }, { status: 500 });
  }
}
