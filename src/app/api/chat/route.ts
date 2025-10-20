import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ text: "No message provided" }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
    });

    const responseText = completion.choices[0].message?.content || "No response";
    return NextResponse.json({ text: responseText });
  } catch (error) {
    console.error("🔥 OpenAI error:", error);
    return NextResponse.json({ text: "Server error occurred" }, { status: 500 });
  }
}
