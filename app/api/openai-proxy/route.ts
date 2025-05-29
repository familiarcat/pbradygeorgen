import { NextResponse } from 'next/server';
import { openai } from '@/lib/server-only/openai';

export async function POST(req: Request) {
  const body = await req.json();
  const { prompt } = body;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
  });

  return NextResponse.json({ result: completion.choices[0].message.content });
}
