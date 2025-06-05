import { NextResponse } from "next/server";
import { openai } from "@/lib/server/openai";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const logDir = path.join(process.cwd(), "logs", "observation_lounge");
  const logFile = path.join(logDir, "crew_conversations.log");

  try {
    // Ensure log directory exists
    if (!existsSync(logDir)) {
      await mkdir(logDir, { recursive: true });
    }

    const res = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    const message = res.choices[0]?.message?.content || "No response.";
    const log = `> ${prompt}\n${message}\n---\n`;

    // Append log using fs/promises
    await writeFile(logFile, log, { flag: "a" }); // 'a' for append mode

    return NextResponse.json({ reply: message });
  } catch (err) {
    return NextResponse.json({ error: "Failed to generate response." }, { status: 500 });
  }
}
