import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    velocity: 34,
    pointsRemaining: 21,
    completion: 0.65
  });
}
