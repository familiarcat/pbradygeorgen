import { NextResponse } from 'next/server';
import { openai } from '@/lib/server/openai';


export async function POST(req: Request) {
  const { prompt } = await req.json();
  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }]
  });

  return NextResponse.json(completion);
}