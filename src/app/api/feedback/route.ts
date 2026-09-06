import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    if (!message) {
      return NextResponse.json({ success: false, error: "Message is required" }, { status: 400 });
    }

    const targetEmail = "lakshya123kl@gmail.com";

    const origin = request.headers.get("origin") || request.headers.get("referer") || "http://localhost:3000";

    const response = await fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Origin: origin,
        Referer: origin
      },
      body: JSON.stringify({
        name: name || "Anonymous User",
        email: email || "No Email Provided",
        message,
        _subject: "New Feedback for MedQuiz Pro",
        _captcha: "false" // Disable Captcha since this is an API call
      }),
    });

    let data;
    const responseText = await response.text();
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      if (!response.ok) {
        throw new Error("FormSubmit failed: " + responseText.substring(0, 100));
      }
    }

    if (data && data.success === "false") {
       throw new Error(data.message || "FormSubmit failed");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Feedback API Error]:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send feedback. Please try again." },
      { status: 500 }
    );
  }
}
