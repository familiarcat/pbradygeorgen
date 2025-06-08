// @Spock @Crusher
import { NextRequest, NextResponse } from 'next/server'
import {openai} from '@/lib/server/openai'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { content } = body
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content }]
  })
  return NextResponse.json({ result: response.choices[0].message.content })
}
