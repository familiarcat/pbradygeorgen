import { NextResponse } from 'next/server';

const mockStories = [
  { id: '1', title: 'Set up warp core', description: 'Initial LCARS routing', assignee: 'Geordi', status: 'NEW' },
  { id: '2', title: 'Connect ArangoDB', description: 'Establish link with AI crew katras', assignee: 'Data', status: 'GROOMED' },
  { id: '3', title: 'Render Sprint Board', description: 'Complete UI column layout', assignee: 'Riker', status: 'PLANNED' },
  { id: '4', title: 'Style with LCARS CSS', description: 'Integrate proper federation colors', assignee: 'Crusher', status: 'IN_PROGRESS' },
  { id: '5', title: 'Conduct Retrospective', description: 'Highlight crew performance', assignee: 'Picard', status: 'COMPLETE' },
];

export function GET() {
  return NextResponse.json(mockStories);
}

