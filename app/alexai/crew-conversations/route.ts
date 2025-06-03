import { NextResponse } from "next/server";
import openai from "@/lib/server/openai"; // Ensure this exists

export async function POST(req: Request) {
  const { prompt } = await req.json();
  const logFile = "logs/observation_lounge/crew_conversations.log";

  try {
    const res = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    const message = res.choices[0]?.message?.content || "No response.";
    const log = `> ${prompt}\n${message}\n---\n`;

    await Bun.write(logFile, log, { append: true });

    return NextResponse.json({ reply: message });
  } catch (err) {
    return NextResponse.json({ error: "Failed to generate response." }, { status: 500 });
  }
}
