import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const data = await req.json();
  const result = {
    suggestions: [
      'Add estimate & category',
      'Needs crew assignment',
      'Add linked PR'
    ]
  };
  return NextResponse.json(result);
}
