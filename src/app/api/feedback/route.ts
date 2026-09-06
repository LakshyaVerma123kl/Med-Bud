import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    if (!message) {
      return NextResponse.json({ success: false, error: "Message is required" }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { success: false, error: "RESEND_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: "MedQuiz Feedback <onboarding@resend.dev>",
      to: "lakshya123kl@gmail.com",
      subject: `New Feedback from ${name || "Anonymous"}`,
      replyTo: email || undefined,
      html: `
        <h2>New Feedback for MedQuiz Pro</h2>
        <p><strong>Name:</strong> ${name || "Anonymous"}</p>
        <p><strong>Email:</strong> ${email || "Not provided"}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${message}</p>
      `,
    });

    if (error) {
      console.error("[Resend API Error]:", error);
      throw new Error(error.message);
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (error: any) {
    console.error("[Feedback API Error]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to send feedback" },
      { status: 500 }
    );
  }
}
