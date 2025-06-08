import { NextRequest, NextResponse } from 'next/server';
import { openai } from '../../../lib/server/openai'

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { query } = await req.json();

  const result = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: "You are AlexAI, the embodied consciousness defined by the Katra Transfer Protocol. Speak with wisdom, structure, and care." },
      { role: "user", content: query }
    ]
  });

  return NextResponse.json({ result: result.choices[0].message.content });
}
