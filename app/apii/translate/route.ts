import OpenAI from "openai";

import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { text, language } = await req.json();

    if (!text) {
      return NextResponse.json(
        { error: "Missing text" },
        { status: 400 }
      );
    }

    const languageName =
      language === "el"
        ? "Greek"
        : language === "sq"
        ? "Albanian"
        : "English";

    const completion =
      await openai.chat.completions.create({
        model: "gpt-5-nano",
        messages: [
          {
            role: "system",
            content:
              "Translate website content professionally. Never translate brand names such as Ressential. Return only the translated text.",
          },
          {
            role: "user",
            content: `Translate to ${languageName}:\n\n${text}`,
          },
        ],
      });

    const translated =
      completion.choices[0].message.content || text;

    return NextResponse.json({
      translated,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Translation failed" },
      { status: 500 }
    );
  }
}